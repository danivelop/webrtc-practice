'use strict'

const startButton = document.getElementById('startButton')
const callButton = document.getElementById('callButton')
const hangupButton = document.getElementById('hangupButton')
callButton.disabled = true
hangupButton.disabled = true
startButton.addEventListener('click', start)
// callButton.addEventListener('click', call)
// hangupButton.addEventListener('click', hangup)

let startTime
const localVideo = document.getElementById('localVideo')
const remoteVideo = document.getElementById('remoteVideo')

let localStream
let pc1
let pc2

async function start() {
  startButton.disabled = true

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: true })
    localVideo.srcObject = stream
    localStream = stream
    callButton.disabled = false
  } catch(error) {
    console.log(error)
  }
}