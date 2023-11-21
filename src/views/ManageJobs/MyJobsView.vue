<template>
    <q-list bordered v-for="(post,index) in myJobs" :id="index">
        <q-expansion-item
            group="somegroup"
            icon="explore"
            :label="post.title"
            header-class="text-primary"
        >
        <q-card dark bordered class="bg-white text-grey-9 my-card">
            <q-card-section>
                <p>{{ post.body }}</p>
                <div>
                    <strong>Requirements:</strong>
                    <q-list v-for="(item,index) in post.requirements" :id="index">
                        <q-item >
                            <q-item-section side>
                                <q-icon color="bg-grey-9" name="send" size="1em" />
                            </q-item-section>
                            <q-item-section>
                                {{ item }}
                            </q-item-section>
                        </q-item>
                    </q-list>
                </div>
            </q-card-section>
            <q-separator inset />
            <q-card-section>
                <q-item>
                    <q-item-section side>
                        <q-icon color="bg-grey-9" name="info" size="1em" />
                    </q-item-section>
                    <q-item-section>
                        <div class="row">
                            <strong>Type :</strong>&nbsp;<span>{{ post.type}} time</span>
                        </div>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section side>
                        <q-icon color="bg-grey-9" name="info" size="1em" />
                    </q-item-section>
                    <q-item-section>
                        <div class="row">
                            <strong>Gender :</strong>&nbsp;<span>{{ post.gender}}</span>
                        </div>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section side>
                        <q-icon color="bg-grey-9" name="info" size="1em" />
                    </q-item-section>
                    <q-item-section>
                        <div class="row">
                            <strong>Salary :</strong>&nbsp;<span>{{ post.salary}} $</span>
                        </div>
                    </q-item-section>
                </q-item>
                <q-item>
                    <q-item-section side>
                        <q-icon color="bg-grey-9" name="info" size="1em" />
                    </q-item-section>
                    <q-item-section>
                        <div class="row">
                            <strong>From :</strong>&nbsp;<span>{{ $filters.fromNow(post.createdAt) }} $</span>
                        </div>
                    </q-item-section>
                </q-item>
            </q-card-section>
            <q-separator inset />
                <div class="row justify-between" style="margin: 15px">
                    <div class="col-4">
                        <div v-if="! post.approved">Still waiting admin approval</div>
                        <DialogBtn v-else :id="post.id"></DialogBtn>
                    </div>
                    <div class="col-4">
                        <DeleteBtn text="Delete" :id="post.id" url="/job" @deleted="onDelete" class="float-right"></DeleteBtn>
                    </div>
                </div>
        </q-card>
        </q-expansion-item>
        <q-separator />
    </q-list>
</template>
<script>
import axios from '../../helpers/axios';
import {ref} from 'vue'
import DeleteBtn from '../../components/delete-btn.vue';
import DialogBtn from '../../components/dialog-btn.vue'
import { err_Msg } from '../../helpers/functions';
export default{
    components: { DeleteBtn, DialogBtn },
    setup(){
        const myJobs = ref([])
        return{
            myJobs
        }
    },
    created(){
        axios({requiresAuth: true}).get('my-jobs').then(res=>{
            this.myJobs = res.data
            if(this.myJobs.length == 0){
                this.$q.notify({
                    color: 'grey-7',
                    textColor: 'white',
                    icon: 'info',
                    position: 'center',
                    message: 'No posts yet'
                })
            }
        }).catch(err=>{
            this.$q.notify({
                color: 'red-5',
                textColor: 'white',
                icon: 'warning',
                message: err_Msg()
            })
            console.log(err)
        })
    },
    methods:{
        onDelete(id){
            this.myJobs = this.myJobs.filter(item=> parseInt(item.id)!=id)
            this.$q.notify({
                color: 'green-4',
                textColor: 'white',
                icon: 'cloud_done',
                message: `post deleted`
            })
        }
    }
}
</script>