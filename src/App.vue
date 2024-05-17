<script setup>
import { ref, computed, onMounted } from 'vue';
import { useStore } from 'vuex';
import { getCharacters, getEpisode } from 'rickmortyapi'

// store из vuex
const store = useStore();

// Список персонажей, найденных по запросу
const list = ref([]);
// Имя персонажа
const name = ref('');
// Статус персонажа
const status = ref('');

// Пагинация
/*
"Реализовать пагинацию с помощью api" - api выдает пагинацию по 20 персонажей на странице
Вероятно, я просто не разобрался, но я не нашел возможности настроить пагинацию у api
Поэтому принял решение - сделать пагинацию самостоятельно, 
так как хочется гибкости и отзывчивости у html-страницы, например, чтобы пользователь сам мог выбрать
количество персонажей, показываемое на каждой странице
*/
// Список персонажей, разбитый по страницам
const paginatedList = computed(()=> paginate());
// Номер отображаемой страницы
const page = ref(0);
// Номер максимальной страницы
const maxPage = computed(()=> Math.ceil(list.value.length/count.value) - 1);
// Количество персонажей, отображаемое на странице
const count = ref(6);
// ----------------------------------------------------------------

// Функция запроса к API с целью получения персонажей
function requestCharacters(name, status, page = 1) {
  return new Promise(async (resolve, reject) => {
    await getCharacters({name: name, status: status, page: page})
      .then((response) => resolve(response.data))
      .catch((err) => reject(err))
  })
}

// Функция получения списка всех найденных персонажей по переданным name и status
async function getListCharacters(name, status) {
  const persons = []; // Массив, содержащий всех найденных по запросу персонажей
  try {
    const response = await requestCharacters(name, status); // Делаем первый запрос к API
    if (response.results) { // Проверяем, есть ли результаты или запрос не вернул ничего
      persons.push(...response.results); // Добавляем персонажей в общий список
      const maxPage = response.info.pages; // Номер максимальной страницы
      for (let i = 2; i <= maxPage; i++) { // Перебираем по страницам
        persons.push(...(await requestCharacters(name, status, i)).results);
      }
    }
  } catch(err) {
    console.error(err); // При возникновении ошибки сообщаем о ней
  } finally {
    return persons; // Передаем в любом случае массив персонажей, даже если случилась ошибка или он пустой
  }
}

// Функция разбивки по страницам
function paginate() {
  const newList = [];
  let arr = [];
  for (let i = 0; i < list.value.length; i++) {
    arr.push(list.value[i]);
    if (arr.length === count.value || i === list.value.length - 1) {
      newList.push(arr);
      arr = [];
    }
  }
  return newList;
}

// Получаем первую серию, где появился персонаж
function getOrigin(url) {
  const id = +url.slice(url.lastIndexOf('/')+1); // Получаем id серии по ссылке на серию
  return new Promise(async (resolve, reject) => { 
    await getEpisode(id)
    .then(result => resolve(result.data.name)) // При успешном получении возвращаем название серии
    .catch((err) => reject(err)) // В противном случае возвращаем ошибку
  })
}

// Функция поиска по запросу
function showListCharacters(name = '', status = '') {
  page.value = 0; // Перемещаемся на первую страницу
  // Обращаемся к кэшу, чтобы проверить, не было ли уже такого запроса
  store.dispatch('getCache', {name: name, status: status})
    .then(async (cached) => {
      if (cached) { // Если пользователь уже делал такой запрос в течение этой сессии
        list.value = cached;
      } else { // Новый запрос
        const newList = await getListCharacters(name, status);
        list.value = [];
        for (let i = 0; i < newList.length; i++) {
          let origin = 'Unknown'
          try {
            origin = await getOrigin(newList[i].episode[0]);
          } catch(err) {
            console.error(err)
          }
          // Так как ответ на запрос к api содержит много информации, оставил только нужную -
          // показываемую на странице, оставшаяся проигнорирована 
          // (при необходимости можно это отредактировать или убрать)
          list.value.push({
            name: newList[i].name, // Имя персонажа
            status: newList[i].status, // Статус персонажа (жив, мертв, неизвестно)
            species: newList[i].species, // Раса (человек, инопланетянин и т.д.)
            location: newList[i].location.name, // Локация последнего появления
            origin: origin, // Название серии первого появления
            img: newList[i].image, // Ссылка на изображение
          })
        }
        store.dispatch('setCache', {name: name, status: status, list: list.value});
      }
    })
}

// При запуске приложения запросить всех персонажей
onMounted(() => {
  showListCharacters();
})

</script>

<template>
  <div class="flex">
    <input class="filter-name" id="name" type="text" placeholder="Имя" @input="(event) => name = event.target.value"/>
    <input class="filter-status" id="status" placeholder="Статус" type="text" @input="(event) => status = event.target.value"/>
    <button @click="showListCharacters(name, status)">Применить</button>
  </div>
  <my-list :list="paginatedList[page]" />
  <div v-show="list.length !== 0" class="flex pagination">
    <button @click="page > 0 ? --page: page">Назад</button>
    <span> Страница <select @change="(event) => page = event.target.value-1">
      <option v-for="n in maxPage+1" :selected="n === page+1">{{ n }}</option>
    </select> из {{ maxPage + 1 }}</span>
    <button @click="page < maxPage ? ++page: page">Вперед</button>
  </div>
</template>

<style lang="sass" scoped>
  .flex 
    display: flex
    flex-direction: row
    justify-content: space-evenly
    align-items: center
  .filter-name
    margin: 8px
</style>
