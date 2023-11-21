<template>
  <q-form
  @submit="onSubmit"
  @reset="onReset"
  class="q-gutter-md"
  >
    <div class="row justify-around">
      <div class="col-12 col-sm-5">
        <q-input
          filled
          v-model="title"
          label="Job title *"
          hint="Title"
          lazy-rules
          :rules="[
              val => val && isValidLength(5,20,val) || 'Invalid Title length (5-20)',
              val => val && onlyLettersAndSpaces(val) || 'Invalid Title (letters and spaces only)'
          ]"
        />
      </div>
      <div class="col-12 col-sm-5">
        <q-input
          filled
          type="number"
          step="500"
          v-model="salary"
          hint="Salary"
          label="Salary *"
          lazy-rules
          :rules="[
            val => val >= 2000 || 'Min salary is 2000 $'
          ]"
        />
      </div>
    </div>
    <div class="row justify-around">
      <div class="col-12 col-sm-5">
        <q-select filled clearable v-model="gender" :options="genders" label="Gender" hint="Gender"
          lazy-rules :rules="[ val => val !== null && val !== '' || 'Please select']"
        />
      </div>
      <div class="col-12 col-sm-5">
        <q-select filled clearable v-model="type" :options="types" label="Type" hint="Type"
          lazy-rules :rules="[ val => val !== null && val !== '' || 'Please select']"
        />
      </div>
    </div>
    <div class="row justify-around">
      <div class="col-12 col-sm-11">
        <CategorySelect @specialtyChanged="$event=>specialty=$event" ref="CategorySelectRef">
        </CategorySelect>
      </div>
    </div>
    <div class="row justify-around">
      <div class="col-12 col-sm-11">
        <q-input
        filled
          type="textarea"
          v-model="body"
          label="Job body *"
          hint="Body"
          lazy-rules
          :rules="[
              val => val && isValidLength(20,200,val) || 'Invalid body length (20-200)'
          ]"
          rows="4"
        />
      </div>
    </div>
    <div class="row justify-around">
      <div class="col-12 col-sm-11">
        <q-btn color="red" icon="add" label="Add to requirements" @click="onAddPoint" />
      </div>
    </div>
    <div v-for="(point, index) in requirements" :key="index" class="row justify-around">
      <div class="col-12 col-sm-11">
        <q-input
          filled
          v-model="requirements[index]"
          label="Requirements *"
          placeholder="write some thing"
          lazy-rules
          :rules="[
              val => val && isValidLength(5,200,val) || 'Invalid body length (5-200)',
              val => val && onlyLettersAndSpaces(val) || 'Invalid Point (letters and spaces only)'
          ]"
        >
          <template v-slot:append>
            <q-btn  color="negative" icon="delete" @click="onDeletePoint(index)" />
          </template>
        </q-input>
      </div>
    </div>
    <div class="row justify-around">
      <div class="col-12 col-sm-11">
        <q-btn label="Submit" type="submit" color="primary" :loading="loading" />
        <q-btn label="Reset" ref="resetBtn" type="reset" color="primary" flat class="q-ml-sm" />
      </div>
    </div>
  </q-form>
</template>
<script>
import { useQuasar } from 'quasar'
import { ref } from 'vue'
import axios from '@/helpers/axios.js'
import CategorySelect from '@/components/category-select.vue'
import { err_Msg } from '@/helpers/functions'
import { isValidLength, onlyLettersAndSpaces } from '../../helpers/validators'
export default {
  components:{ CategorySelect },
  setup () {
    const $q = useQuasar()
    const title = ref(null)
    const gender = ref(null)
    const genders = ['male','female','both']
    const body = ref(null)
    const type = ref(null)
    const types = ref(['part','full'])
    const salary = ref(null)
    const specialty = ref(null)
    const requirements = ref([])
    const resetBtn = ref(null)
    const loading = ref(false)
    const CategorySelectRef = ref(null)

    const prepareForm = () =>{
      const formData = {
          title: title.value,
          gender: gender.value,
          body: body.value,
          type: type.value,
          salary: salary.value,
          categoryId: specialty.value,
          requirements: requirements.value
      }
      return formData
    }

    return {
      title,
      gender,
      genders,
      body,
      type,
      types,
      salary,
      specialty,
      requirements,
      resetBtn,
      loading,
      CategorySelectRef,
      isValidLength,
      onlyLettersAndSpaces,

      onAddPoint () {
          const newPoint = ''
          requirements.value.push(newPoint)
      },

      onDeletePoint (id) {
          requirements.value = requirements.value.filter((req,idx) => idx !== id)
      },
      onReset(){
        title.value = null
        gender.value = null
        body.value = null
        type.value = null
        salary.value = null
        specialty.value = null
        requirements.value = []
        CategorySelectRef.value.category = null
      },

      onSubmit () {
        if (requirements.value.length < 2) {
          return $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'Add at least 2 items in requirements'
          })
        }
        const formData = prepareForm()
        loading.value = true
        axios({ requiresAuth: true }).post('/job',{...formData}).then(res=>{
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Submitted, wait admin to approve it'
          })
          resetBtn.value.$el.click()
          loading.value = false
        }).catch(error=>{
          $q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: err_Msg()
          })
          console.log(error)
          loading.value = false
        })
      }
    }
  }
}
</script>
  