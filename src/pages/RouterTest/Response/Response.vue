<script setup>
import { ref } from 'vue';

  const blobsContent = ref(null)
  const bytesContent = ref(null)
  const JSONContent = ref(null)
  const videoObjectURL = ref(null)

  const fetchBlobs = () => {
    fetch("http://localhost:8080/test/blobs", {
      method: 'GET',
      headers: {
        'content-type': 'application/octet-stream'
      }
    })
    .then(resp => {
      console.log(resp);
      if (resp.ok) {
        resp.blob().then(body => {
          const blob = new Blob([body], {type: 'video/webm'});
          const objectURL = URL.createObjectURL(blob);
          videoObjectURL.value = objectURL
        })
        
        // resp.arrayBuffer().then(buffer => {
        //   console.log(buffer);
        //   const view = new Uint8Array(buffer);
        //   const blob = new Blob([view], {type: 'video/webm'});
        //   const objectURL = URL.createObjectURL(blob);

        //   videoObjectURL.value = objectURL
        // })
        
      }
    })
  }

  const fetchBytes = () => {
    fetch("http://localhost:8080/test/bytes")
    .then(resp => {
      if (resp.ok) {
        resp.arrayBuffer().then(bytes => {
          console.log(bytes);
          bytesContent.value = bytes
        })
        console.log(bytesContent);
      }
    })
  }

  const fetchJSON = () => {
    fetch("http://localhost:8080/test/json")
    .then(resp => {
      if (resp.ok) {
        console.log(resp);
        resp.json().then(body => {
          JSONContent.value = body
        })
        
      }
    })
  }

  const fetchVideoBuffer = () => {
    fetch("http://localhost:8080/test/videoBuffer", {
      method: 'GET',
      headers: {
        'content-type': 'application/octet-stream'
      }
    })
    .then(resp => {
      if (resp.ok) {
        console.log(resp);
        resp.arrayBuffer().then(body => {
          console.log(body);
          const view = new Uint8Array(body);
          const blob = new Blob([view], {type: 'video/webm'})
          const objectURL = URL.createObjectURL(blob);
          videoObjectURL.value = objectURL
        })
        
      }
    })
  }
</script>

<template>
  <div>
    <h2>Test Response</h2>
    <div>
      <div>
        <h3>blobs</h3>
        {{ blobsContent }}
      </div>
      <div>
        <h3>bytes</h3>
        {{ bytesContent }}
      </div>
      <div>
        <h3>JSON</h3>
        {{ JSONContent }}
      </div>
    </div>
    <button @click="fetchBlobs">fetchBlobs</button> |
    <button @click="fetchBytes">fetchBytes</button> |
    <button @click="fetchJSON">fetchJSON</button> |
    <button @click="fetchVideoBuffer">fetchVideoBuffer</button>
    <a :href="videoObjectURL">click to download</a>
  </div>
</template>

<style scoped>
</style>