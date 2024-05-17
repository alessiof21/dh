<script setup>

// Определяем получаемые пропсы (список персонажей на странице)
defineProps({
  list: Array
})

</script>

<template>
  <div class="flex-articles">
    <article class="flex-persons" v-for="elem in list">
        <div class="person-flex-img">
          <img class="img-person" :src="elem.img" :alt="elem.name">
        </div>
        <div class="person-flex-info">
          <div class="info-section">
            <p class="text big"> {{ elem.name }}</p>
            <p class="text medium"> {{ elem.status }} - {{ elem.species }} </p>
          </div>
          <div class="info-section"> 
            <p class="text small grey"> Локация последнего появления </p>
            <p class="text medium"> {{ elem.location }}</p>
          </div>
          <div class="info-section">
            <p class="text small grey"> Первое появление </p>
            <p class="text medium"> {{ elem.origin }}</p>            
          </div>
        </div>
    </article>

  </div>
  


</template>

<style lang="sass" scoped>
*
  box-sizing: inherit

.flex-articles
    display: flex
    flex-direction: row
    justify-content: center
    -webkit-box-align: center
    align-items: center
    flex-wrap: wrap
    max-width: 1920px
    min-width: 768px
.flex-persons
  width: 540px
  height: 220px
  display: flex
  overflow: hidden
  background: rgb(60, 62, 68)
  border-radius: 0.5rem
  margin: 0.75rem

.person-flex-img
  flex: 2 1 0%
  width: 100%
  .img-person
    width: 100%
    height: 100%
    margin: 0px
    opacity: 1
    transition: opacity 0.5s ease 0s
    object-position: center center
    object-fit: cover
.person-flex-info
  flex: 3 1 0%
  position: relative
  padding: 0.75rem
  color: rgb(255, 255, 255)
  display: flex
  flex-direction: column
  .info-section
    flex: 1 1 0%
    display: flex
    justify-content: flex-start
    flex-direction: column
    margin-bottom: 8px
.text 
  font-family: -apple-system, 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol'
  font-weight: normal
  word-wrap: break-word
  font-kerning: normal
  margin: 0
  margin-bottom: 4px

.grey 
  color: rgb(158, 158, 158)
.big 
  font-size: 24px
  font-weight: 900
.medium 
  font-size: 16px
.small
  font-size: 14px
  font-weight: 500
</style>
