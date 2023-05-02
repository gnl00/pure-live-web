<template>
  <div class="wrapper">
	  <button @click="btnClick">TestController-str()</button>
	  <div class="form">
		  <input type="file" name="file" multiple @change="onFileInputChange($event)" />
		  <button @click="smtClick">submit</button>
	  </div>
  </div>
</template>

<script setup>

let file = null
let uploadBody = null;

const onFileInputChange= evt => {
	file = evt? evt.target.files[0] : null
}

const smtClick = () => {
	console.log('smtClick')
	fileUpload()
}

const handleUploadBody = () => {
  const fd = new FormData();
	fd.append('file', file, file.name)
	if (fd) {
		uploadBody = fd
  }
}

const fileUpload = () => {
	handleUploadBody()
  if (uploadBody) {
	  console.log(uploadBody)
		const url = 'http://localhost:8080/test/upload'
	  doUpload(url, uploadBody)
  }
}

const doUpload = (url, body) => {
	fetch(url,{
		method: 'post',
		body
	}).then(res => {
		console.log('file upload success ', res)
  }).catch(err => {
		console.log('file upload fail ', err.message)
  })
}

const btnClick = () => {
	fetch("http://localhost:8080/test/str")
      .then(res => {
	      console.log(res)
      })
      .catch(err => {
	      console.log("error: ", err.message)
      })
}
</script>

<style scoped>
.wrapper {
	margin: 10px;
  display: flex;
  flex-direction: column;
}
.form {
	padding: 10px;
}
</style>