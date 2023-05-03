<script setup>
import { onMounted, ref } from 'vue';

let downloadLink = ref(null)
let chunks = []
let latestObjectURL = null;
let videoContentGlobal = null;

const ws = new WebSocket('ws://localhost:8080/ws/test/1');

ws.onmessage = message => {
  console.log(message);
  if (message && message.data instanceof Blob) {
    const resp = message.data

    const reader = new FileReader();
    reader.onload = () => {
      const base64Data = reader.result
      console.log(base64Data);
      videoContentGlobal.src = base64Data

    }
    reader.readAsDataURL(resp);

    chunks.push(resp)

    // const blob = new Blob([resp], {type: 'video/webm'});

    // if (latestObjectURL) {
    //   URL.revokeObjectURL(latestObjectURL)
    // }

    // const objectURL = URL.createObjectURL(blob);
    // latestObjectURL = Object.assign({}, objectURL)

    // videoContentGlobal.src = latestObjectURL
  }
}

ws.onerror = err => {
	console.log('ws onerror() ', err);
}

ws.onclose = evt => {
	console.log('ws onclose() ', evt);
}

onMounted(() => {
  videoContentGlobal = document.getElementById('videoContent');
})

const generateVideo = () => {
  console.log(chunks);

  const blob = new Blob(chunks, {type: 'video/webm'});
  const objectURL = URL.createObjectURL(blob);
  videoContentGlobal.src = objectURL

  // const reader = new FileReader();
  // reader.onload = evt => {
  //   const base64Data = reader.result
  //   videoContentGlobal.src = base64Data

  // }
  // reader.readAsDataURL(chunks[0]);

  // const mindle = parseInt(chunks.length / 2)
  // const front = chunks.slice(0, mindle);
  // const end = chunks.slice(mindle, chunks.length);;

  // const frontBlob = new Blob(front, {type: 'video/webm'});
  // const endBlob = new Blob(end, {type: 'video/webm'});

  // const frontObjectURL = URL.createObjectURL(frontBlob);
  // console.log(frontObjectURL);
  // const endObjectURL = URL.createObjectURL(endBlob);
  // console.log(endObjectURL);

  // const videoFront = document.getElementById('videoFront');
  // const videoEnd = document.getElementById('videoEnd');
  // videoFront.src = frontObjectURL
  // videoEnd.src = endObjectURL
}

</script>

<template>
  <div id="receiver">
    <h1>this is receiver</h1>
    <button @click="generateVideo">generateVideo</button>
    <video id="videoContent" autoplay muted controls />
    <a :href="downloadLink">download</a>
  </div>
  <div>
    <video id="videoFront" autoplay muted controls />
    <video id="videoEnd" autoplay muted controls />

  </div>
</template>

<style scoped>
#receiver {
  width: 100%;

  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

#videoContent {
  max-width: 50%;
}
</style>