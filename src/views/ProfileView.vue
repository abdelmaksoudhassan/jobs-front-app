<template>
    <div class="column items-center" v-if="loading">
        <q-spinner-hourglass
            color="secondary"
            size="8em"
        />
    </div>
    <q-card v-else dark bordered class="bg-secondary text-white my-card">
        <q-card-section>
            <q-img
                :src="get_url(user.avatar)"
                spinner-color="white"
                style="height: 100px; max-width: 100px; margin-bottom: 10px; border-radius: 50%;"
            />
            <div class="text-h4">{{ user.fullName }}</div>
            <div class="text-subtitle2 row justify-between">
                <span>
                    ( {{ user.email }} )
                </span>
                <span>
                    From {{ createdAt }}
                </span>
            </div>
        </q-card-section>
        <q-separator dark inset />
        <q-card-section>
            <q-item>
                <q-item-section side>
                    <q-icon color="white" name="info" size="1em" />
                </q-item-section>
                <q-item-section>
                    <div class="row">
                        <strong>Age :</strong>&nbsp;<span>{{ user.age}} Years</span>
                    </div>
                </q-item-section>
            </q-item>
            <q-item>
                <q-item-section side>
                    <q-icon color="white" name="info" size="1em" />
                </q-item-section>
                <q-item-section>
                    <div class="row">
                        <strong>Admin :</strong>&nbsp;<span>{{ user.admin ? 'Yes' : 'No' }}</span>
                    </div>
                </q-item-section>
            </q-item>
            <q-item v-if="extraData">
                <q-item-section side>
                    <q-icon color="white" name="info" size="1em" />
                </q-item-section>
                <q-item-section>
                    <div class="row">
                        <strong>Specialty :</strong>&nbsp;<span>{{ extraData.category.title}}</span>
                    </div>
                </q-item-section>
            </q-item>
            <q-btn color="grey-4" v-if="extraData" @click="downloadCV(extraData.cv)" text-color="purple" glossy unelevated icon="download" label="Download Cv.." />
        </q-card-section>
        <q-separator dark inset />
        <q-card-section>
            <div class="row justify-start">
                <q-btn color="grey-4" v-if="showComplete" @click="onComplete" text-color="purple" glossy unelevated icon="add" label="Complete data" style="margin: 2px;" />
                <q-btn style="background: #FF0080;  color: white; margin: 2px;" icon="navigation" label="Back" @click="onBack" />
            </div>
        </q-card-section>
    </q-card>
  </template>
<script>
import axios from '../helpers/axios'
import { ref } from 'vue'
import { err_Msg } from '../helpers/functions'
import moment from 'moment'
import { useAuthStore } from '../stores/UseAuthStore'
export default{
    setup () {
        const loading = ref(false)
        const user = ref(null)
        const extraData = ref(null)
        return {
            user,
            extraData,
            loading,
            get_url(avatar){
              const url = 'https://nodejs-jobs.onrender.com'
              return avatar ? `${url}/${avatar}` : "https://cube.elemecdn.com/3/7c/3ea6beec64369c2642b92c6726f1epng.png"
            }
        }
    },
    computed:{
        createdAt(){
            const value = this.user.createdAt
            return moment(new Date(value)).format("MMM Do YY");
        },
        showComplete(){
            const x = ((!useAuthStore().isAdmin) && (!this.extraData) && (!!useAuthStore().user) && (parseInt(this.$route.params.id) == useAuthStore().user.id))
            return x
        }
    },
    created(){
        this.loading = true
        const {id} = this.$route.params
        axios().get(`/profile/${id}`).then(res=>{
            const {user,extraData} = res.data
            this.user = user
            this.extraData = extraData
            this.loading = false
        }).catch(error=>{
            this.$q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'warning',
                message: err_Msg()
            })
            console.log(error)
        })
    },
    methods:{
        onBack(){
            this.$router.back()
        },
        downloadCV(cv){
            const url = 'https://nodejs-jobs.onrender.com'
            window.open(`${url}/${cv}`, "_blank");
        },
        onComplete(){
            this.$router.push({name: 'completedata'})
        }
    }
}
</script>