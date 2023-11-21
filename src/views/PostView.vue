<template>
    <div class="column items-center" v-if="loading">
        <q-spinner-hourglass
            color="secondary"
            size="8em"
        />
    </div>
    <q-card v-else dark bordered class="bg-secondary text-white my-card">
        <q-card-section>
            <div class="text-h4">{{ post.title }}</div>
            <div class="text-subtitle2 row justify-between">
                <span>
                    by {{ post.User.fullName }} ( {{ post.User.email }} )
                </span>
                <span>
                    {{ $filters.fromNow(post.createdAt) }}
                </span>
            </div>
        </q-card-section>
        <q-separator dark inset />
        <q-card-section>
            <p>{{ post.body }}</p>
            <div>
                <strong>Requirements:</strong>
                <q-list v-for="(item,index) in post.requirements" :id="index">
                    <q-item >
                        <q-item-section side>
                            <q-icon color="white" name="send" size="1em" />
                        </q-item-section>
                        <q-item-section>
                            {{ item }}
                        </q-item-section>
                    </q-item>
                </q-list>
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
                        <strong>Type :</strong>&nbsp;<span>{{ post.type}} time</span>
                    </div>
                </q-item-section>
            </q-item>
            <q-item>
                <q-item-section side>
                    <q-icon color="white" name="info" size="1em" />
                </q-item-section>
                <q-item-section>
                    <div class="row">
                        <strong>Gender :</strong>&nbsp;<span>{{ post.gender}}</span>
                    </div>
                </q-item-section>
            </q-item>
            <q-item>
                <q-item-section side>
                    <q-icon color="white" name="info" size="1em" />
                </q-item-section>
                <q-item-section>
                    <div class="row">
                        <strong>Salary :</strong>&nbsp;<span>{{ post.salary}} $</span>
                    </div>
                </q-item-section>
            </q-item>
        </q-card-section>
        <q-separator dark inset />
        <q-card-section>
            <div class="row justify-between">
                <div>
                    <div class="row">
                        <strong>{{ appliers }}</strong>&nbsp;<span>Persons applied till now</span>
                    </div>
                </div>
                <div>
                    <span v-if="userJob(post.User.id)">Job you posted</span>
                    <ApplyBtn :id="post.id" v-else></ApplyBtn>
                    <q-btn style="background: #FF0080;  color: white; margin-left: 5px;" icon="navigation" label="Back" @click="onBack" />
                </div>
            </div>
        </q-card-section>
    </q-card>
  </template>
<script>
import axios from '../helpers/axios'
import { ref } from 'vue'
import { err_Msg } from '../helpers/functions'
import ApplyBtn from '../components/apply-btn.vue'
import { mapState } from 'pinia'
import { useAuthStore } from '../stores/UseAuthStore'
export default{
    components:{ApplyBtn},
    setup () {
        const post = ref(null)
        const loading = ref(false)
        const appliers = ref(0)
        return {
            post,
            appliers,
            loading
        }
    },
    computed:{
        ...mapState(useAuthStore,['user'])
    },
    created(){
        this.loading = true
        const {id} = this.$route.params
        axios().get(`/job/${id}`).then(res=>{
            this.loading = false
            const {job,appliersCount} = res.data
            this.post = job
            this.appliers = appliersCount
        }).catch(error=>{
            const message = error.response ? error.response.data.message : err_Msg()
            this.$q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'warning',
                message
            })
            console.log(error)
        })
    },
    methods:{
        onBack(){
            this.$router.back()
        },
        userJob(id){
            if(this.user && this.user.id == id){
                return true
            }else{
                return false
            }
        }
    }
}
</script>