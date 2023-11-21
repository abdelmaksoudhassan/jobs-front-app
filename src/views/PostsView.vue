<template>
    <div class="column items-center">
        <q-spinner-cube
            v-if="loading"
            color="primary"
            size="5.5em"
        />
    </div>
    <div v-for="(item,index) in jobs" :id="index">
        <Card :title="item.title" :time="item.createdAt" :body="item.body">
            <template #details>
                <div>
                    <span v-if="userJob(item.UserId)">Job you posted</span>
                    <ApplyBtn :id="item.id" v-else></ApplyBtn>
                </div>
                <q-btn color="red" icon="details" class="float-right" label="Details" @click="goTo(item.id)" />
            </template>
        </Card>
    </div>
    <div class="q-pa-lg flex flex-center">
      <q-pagination
        v-model="current"
        :max="max"
      />
    </div>
</template>
<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import Card from '../components/card.vue'
import axios from '../helpers/axios'
import { err_Msg } from '../helpers/functions'
import { useJobsStore } from '../stores/UseJobsStore'
import { useAuthStore } from '../stores/UseAuthStore'
import { mapState } from 'pinia'
import ApplyBtn from '../components/apply-btn.vue'
export default{
    components:{ Card, ApplyBtn },
    setup(){
        const $q = useQuasar()
        const current = ref(1)
        const perPage = 4
        const jobsStore = useJobsStore()
        const loading = ref(false)
        const max = ref(0)

        const fetchData = async (page,perPage) =>{
            loading.value = true
            try{
                const jobsData = (await axios().get(`/jobs?page=${page}&count=${perPage}`)).data
                const {jobs,total} = jobsData
                max.value = Math.round(total/perPage)
                jobsStore.setJobs(jobs)
                loading.value = false
                if(jobs.length == 0){
                    $q.notify({
                        color: 'grey-9',
                        textColor: 'white',
                        icon: 'info',
                        message: 'No posts yet',
                        position: 'center'
                    })
                }
            }
            catch(err){
                loading.value = false
                $q.notify({
                    color: 'red-5',
                    textColor: 'white',
                    icon: 'warning',
                    message: err_Msg()
                })
                console.log(err)
                loading.value = false
            }
        }
        return{
            current,
            perPage,
            fetchData,
            max,
            loading
        }
    },
    watch:{
        current: function(newVal){
            this.fetchData(newVal,this.perPage)
        }
    },
    computed:{
        ...mapState(useJobsStore,['jobs']),
        ...mapState(useAuthStore,['user'])
    },
    created(){
        const query = this.$router.currentRoute.value.query.page
        const page =  query ? query : 1
        this.current = parseInt(page)

        this.fetchData(this.current,this.perPage)
    },
    methods:{
        goTo(id){
            this.$router.push({name:"post",params:{id}})
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