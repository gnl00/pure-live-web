<template>
	<div id="selector">
		<button @click="anchorClick">主播</button>
		<button @click="audienceClick">观众</button>
	</div>
</template>

<script setup>
import router from "../../router/index.js";

const anchorClick = () => {
	console.log("I am anchor")
	router.push('/anchor')
}
const audienceClick = () => {
	console.log("I am audience")
	router.push('/audience')
}

</script>

<style scoped>

 #selector {
	 height: auto;
	 width: 100%;
   padding: 5px;
   display: flex;
   flex-direction: column;
   justify-content: center;
   align-content: center;
   align-items: center;
 }

 #selector button {
   font-size: 28px;
   margin: 10px;
   padding: 5px;
   background-color: #6ba5ed;
   border: none;
   border-radius: 25px;
   color: white;
   height: 5em;
	 min-width: 45%;
 }

 #selector button:hover {
	 background-color: #195095;
 }

</style>