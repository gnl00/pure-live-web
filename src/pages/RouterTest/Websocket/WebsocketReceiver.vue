<script setup>
import { onMounted, ref } from 'vue';
import Hls from "hls.js";

let downloadLink = ref(null)

let chunks = []
let videoContentGlobal = null;
let hls = null;

const ws = new WebSocket('ws://localhost:8080/ws/test/1');

ws.onmessage = message => {
  console.log(message);
	let data = null
	if (message && (data = message.data)) {

		if (Hls.isSupported()) {
			if (!hls) {
				hls = new Hls();
      }

			hls.loadSource(data)
			hls.attachMedia(videoContentGlobal)
    }

  }

  if (message && message.data instanceof Blob) {

    const resp = message.data
    chunks.push(resp)

    const blob = new Blob([resp], {type: 'video/webm'});

    // base64 读取 blob
    // const reader = new FileReader();
    // reader.onload = () => {
    //   const base64Data = reader.result
    // videoContentGlobal.src = base64Data

    // }
    // reader.readAsDataURL(blob);

    // URL.createObjectURL() 读取 blob
    const objectURL = URL.createObjectURL(blob);

    // save video to local
    const download = document.createElement('a');
	  download.href = objectURL
	  download.click()

    // load video data from url
    // videoContentGlobal.src = latestObjectURL

    // load video data from local
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

	// console.log(Hls.isSupported())
})

const generateVideo = () => {
  console.log(chunks);
  const blob = new Blob(chunks, {type: 'video/webm'});
}

</script>

<template>
  <div id="receiver">
    <button @click="generateVideo">generateVideo</button>
    <video id="videoContent" autoplay muted controls />
    <a :href="downloadLink">download</a>
  </div>
  <div>
    <img id="imgN" src="http://localhost:8888/image/test.png"  alt="test.png"/>
    <video id="m3u8Player" width="500" height="300" autoplay muted controls preload="auto" />
    <a href="http://localhost:8888/video/test.mp4">download from nginx</a>
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

#imgN {
  max-width: 200px;
  max-height: 200px;
}
</style>