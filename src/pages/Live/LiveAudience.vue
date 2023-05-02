<script setup>
import { onMounted } from 'vue';

onMounted(() => {
	const videoContent = document.getElementById('videoContent');
	getBlob();
})

const getBlob = () => {
	fetchBlob().then(res => {
		const reader = new FileReader();
		
	})
	// const arrayBuffer = 
	// if (arrayBuffer) {
	// 	console.log(arrayBuffer);
	// 	
	// 	// console.log(blob);
	// }

	return null;
}

const fetchBlob = async () => {
	return await fetch('http://localhost:8080/test/blobs', {
		method: 'GET',
		// headers: {
    // 	'Content-Type': 'application/octet-stream'
  	// },
  	// responseType: 'blob'
	}).then(res => {
		console.log(res);
		if (res.ok) {
			console.log(res.body);
			// const blob = new Blob([res.body], {type: 'video/webm'})
			// console.log(blob);
			// const blobObject = URL.createObjectURL(blob);
			// console.log(blobObject);

			return res
		}
	}).catch(err => {
		console.log('fetchBlob() error ', err.message);
	})
}

</script>

<template>
	<div id="audience">
		<div id="videoDiv">
			<video id="videoContent" muted controls autoplay />
		</div>
	</div>
</template>

<style scoped>

</style>