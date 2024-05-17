import { createStore } from 'vuex';

export default createStore({
    state: {
        cache: [] // Храним все запросы тут в виде объектов {name, status, list}
    },
    mutations: {
        cached(state, {name, status, list}) {
            state.cache.push({
                name: name, 
                status: status,
                list: list
            })
        }
    },
    actions: {
        getCache({state}, {name, status}) { // Проверяем, есть ли в кэше такой запрос
            return new Promise(resolve => {
                for (let i = 0; i < state.cache.length; i++) {
                    if (state.cache[i].name === name && state.cache[i].status === status) {
                        resolve(state.cache[i].list);
                    }
                }
                resolve(false);
            });
        },
        setCache({commit}, {name, status, list}) { // Кэшируем запрос
            commit('cached', {name, status, list});
        }
    }
});