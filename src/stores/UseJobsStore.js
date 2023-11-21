import { defineStore } from "pinia"

export const useJobsStore = defineStore('jobs',{
    state:()=>{
        return{
            jobs: [],
            pending: []
        }
    },
    actions:{
        setJobs(data){
            this.jobs = data
        },
        setPending(data){
            this.pending = data
        },
        deleteFromPending(id){
            this.pending = this.pending.filter(item=> parseInt(item.id) != id)
        },
        addToJobs(job){
            this.jobs.unshift(job)
        },
        popFromJobs(){
            this.jobs.pop()
        }
    }
})