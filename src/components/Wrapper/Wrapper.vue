<template>
  <div id="wrapper">
    <slot />
  </div>
</template>

<script setup>
</script>

<style scoped>
#wrapper {
	background-color: #d8d7d7;
	border-radius: 10px;

	display: flex;
	justify-content: center;
	align-content: center;
	align-items: center;
}
</style>