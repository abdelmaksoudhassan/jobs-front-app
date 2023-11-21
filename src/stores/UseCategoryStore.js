import { defineStore } from 'pinia'
export const useCategoryStore = defineStore('category',{
    state: () => {
        return{
            categories: []
        }
    },
    actions:{
        setArr(items){
            this.categories = items
        },
        pushToArr(item){
            this.categories.push(item)
        },
        updateItem(id,data){
            const index = this.categories.findIndex(item=>parseInt(item.id) == id)
            if(index == -1){
                return
            }
            this.categories[index] = data
        },
        deleteItem(id){
            this.categories = this.categories.filter(item=> parseInt(item.id) != id)
        }
    }
})