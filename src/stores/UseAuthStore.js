import { defineStore } from 'pinia'
export const useAuthStore = defineStore('auth',{
    state: () => {
        return{
            user: null,
            extra: null,
            auth: false
        }
    },
    getters:{
        isAdmin(state){
            return state.user ? state.user.admin : false
        }
    },
    actions:{
        setAuthData(data){
            this.user = data,
            this.auth = true
        },
        updateAvatar(avatar){
            this.user.avatar = avatar
        },
        updateCV(cv){
            this.extra.cv = cv
        },
        setExtraData(data){
            if(data){
                this.extra = data
            }
        }
    }
})