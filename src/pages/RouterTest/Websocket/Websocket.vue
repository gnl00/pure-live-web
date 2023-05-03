<script setup>
import { ref } from 'vue';

let iptVal = ref('hahaha')
let downloadLink = ref('#')

const ws = new WebSocket('ws://localhost:8080/ws/test/1');
ws.onmessage = message => {
  console.log(message);
  if (message && message.data instanceof Blob) {
    const resp = message.data
    const blob = new Blob([resp], {type: 'video/webm'});

    const objectURL = URL.createObjectURL(blob);
    downloadLink.value = objectURL
  }
}

ws.onerror = err => {
	console.log('ws onerror() ', err);
}

ws.onclose = evt => {
	console.log('ws onclose() ', evt);
}

const clickToSend = () => {
  console.log(iptVal.value);
  ws.send(iptVal.value);
}

const clickToSendBlob = () => {
  const blob = new Blob();
  console.log(blob);
  ws.send(blob);
}

</script>

<template>
  <input type="text" v-model="iptVal" placeholder="input something to send" />
  <button @click="clickToSend">clickToSend</button>

  <button @click="clickToSendBlob">clickToSendBlob</button>
  <a :href="downloadLink">download</a>
</template>

<style scoped></style>