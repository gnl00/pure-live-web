<script setup>
import Wrapper from "./components/Wrapper/Wrapper.vue";
</script>

<template>
	<h1 id="title">Pure Live</h1>
  <wrapper>
	  <router-view />
  </wrapper>
<!--	<live-main />-->
<!--  <router-test />-->
</template>

<style scoped>
#title {
	color: #6ba5ed;
}
</style>
