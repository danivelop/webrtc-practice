'use strict'

const startButton = document.getElementById('startButton')
const callButton = document.getElementById('callButton')
const hangupButton = document.getElementById('hangupButton')
callButton.disabled = true
hangupButton.disabled = true
startButton.addEventListener('click', start)
callButton.addEventListener('click', call)
hangupButton.addEventListener('click', hangup)

let startTime
const localVideo = document.getElementById('localVideo')
const remoteVideo = document.getElementById('remoteVideo')

let localStream
let pc1
let pc2

const offerOptions = {
  offerToReceiveAudio: 1,
  offerToReceiveVideo: 1,
}

localVideo.addEventListener('loadedmetadata', function() {
  console.log(`local video ${this.videoWidth}, ${this.videoHeight}`)
})

async function start() {
  startButton.disabled = true

  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true })
    localVideo.srcObject = stream
    localStream = stream
    callButton.disabled = false
  } catch(error) {
    console.log(error)
  }
}

function getSelectedSdpSemantics() {
  const sdpSemanticsSelect = document.querySelector('#sdpSemantics')
  const option = sdpSemanticsSelect.options[sdpSemanticsSelect.selectedIndex]
  return option.value === '' ? {} : { sdpSemantics: option.value }
}

async function call() {
  callButton.disabled = true
  hangupButton.disabled = false
  startTime = window.performance.now()

  const configuration = getSelectedSdpSemantics()

  pc1 = new RTCPeerConnection(configuration)
  pc1.addEventListener('icecandidate', e => onIceCandidate(pc1, e))

  pc2 = new RTCPeerConnection(configuration)
  pc2.addEventListener('icecandidate', e => onIceCandidate(pc2, e))
  pc2.addEventListener('track', gotRemoteStream)
  
  localStream.getTracks().forEach(track => pc1.addTrack(track, localStream))

  try {
    console.log('pc1 createOffer start')
    const offer = await pc1.createOffer(offerOptions)
    await onCreateOfferSuccess(offer)
  } catch (error) {
    console.log(error)
  }
}

async function onCreateOfferSuccess(desc) {
  console.log('pc1 setLocalDescription start')
  try {
    await pc1.setLocalDescription(desc)
    console.log(`${getName(pc1)} setLocalDescription complete`)
  } catch(error) {
    console.log(error)
  }

  console.log('pc2 setRemoteDescription start')
  try {
    await pc2.setRemoteDescription(desc)
    console.log(`${getName(pc2)} setRemoteDescription complete`)
  } catch(error) {
    console.log(error)
  }

  console.log('pc2 createAnswer start')
  try {
    const answer = await pc2.createAnswer()
    await onCreateAnswerSuccess(answer)
  } catch(error) {
    console.log(error)
  }
}

async function onCreateAnswerSuccess(desc) {
  console.log('pc2 setLocalDescription start')
  try {
    await pc2.setLocalDescription(desc)
    console.log(`${getName(pc2)} setLocalDescription complete`)
  } catch(error) {
    console.log(error)
  }

  console.log('pc1 setRemoteDescription start')
  try {
    await pc1.setRemoteDescription(desc)
    console.log(`${getName(pc1)} setRemoteDescription complete`)
  } catch(error) {
    console.log(error)
  }
}

function gotRemoteStream(e) {
  if (remoteVideo.srcObject !== e.streams[0]) {
    remoteVideo.srcObject = e.streams[0]
    console.log('pc2 received remote stream')
  }
}

function getOtherPc(pc) {
  return (pc === pc1) ? pc2 : pc1
}

function getName(pc) {
  return (pc === pc1) ? 'pc1' : 'pc2'
}

async function onIceCandidate(pc, event) {
  try {
    console.log(`${getName(pc)} addIceCandidate success`)
    await (getOtherPc(pc).addIceCandidate(event.candidate))
    console.log(`${getName(pc)} addIceCandidate success`)
  } catch(error) {
    console.log(error)
  }
}

function hangup() {
  console.log('Ending call')
  pc1.close()
  pc2.close()
  pc1 = null
  pc2 = null
  hangupButton.disabled = true
  callButton.disabled = false
}
