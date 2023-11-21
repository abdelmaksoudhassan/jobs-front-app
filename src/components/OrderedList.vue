<template>
    <ol>
        <li class="animate__animated animate__fadeInLeft" v-for="(item,index) in items" :id="index">
            {{ item }}
        </li>
  </ol>
</template>
<script setup>
const props = defineProps({
    items:{
        type: Array,
        required: true
    }
})
</script>
<style scoped>
ol {
  counter-reset: li; 
  list-style: none; 
  padding: 0;
  text-shadow: 0 1px 0 rgba(255,255,255,.5);
}

ol li {
  font-size: large;
  position: relative;
  display: block;
  padding: .4em .4em .4em .8em;
  margin: .5em 0 .5em 2.5em;
  background: #f8f8fa;
  color: #444;
  text-decoration: none;
  transition: all .3s ease-out;
}

ol li:hover {
  background: #e5e6eb;
  cursor: pointer;
  }       
ol li:before {
  content: counter(li);
  counter-increment: li;
  position: absolute;
  left: -2.5em;
  top: 50%;
  margin-top: -1em;
  background: #cbdadb;
  height: 2em;
  width: 2em;
  line-height: 2em;
  text-align: center;
  font-weight: bold;
}

ol li:after {
  position: absolute;
  content: "";
  border: .5em solid transparent;
  left: -1em;
  top: 50%;
  margin-top: -.5em;
  transition: all .3s ease-out;
}

ol li:hover:after {
  left: -.5em;
  border-left-color: #cbdadb;
}
</style>