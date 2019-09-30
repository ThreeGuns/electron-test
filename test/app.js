// import {desktopCapturer, ipcRenderer, remote} from 'electron';
const {desktopCapturer, ipcRenderer, remote} = require('electron')
const fs = require('fs')

let recordedChunks = []
let numRecordedChunks = 0
let localStream
let includeMic = false
let microAudioStream
let recorder

document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('#start-record-desktop').addEventListener('click', startRecordDesktop)
    document.querySelector('#stop-record-desktop').addEventListener('click', stopRecordDesktop)
    document.querySelector('#play').addEventListener('click', play)
    document.querySelector('#save').addEventListener('click', saveFile)
    // document.querySelector('#record-stop').addEventListener('click', stopRecording)
    // document.querySelector('#play-button').addEventListener('click', play)
    // document.querySelector('#download-button').addEventListener('click', download)
});

const startRecordDesktop = () => {
    cleanRecord()

    desktopCapturer.getSources({
        types: ['window', 'screen']
    }).then(async sources => {
        let id = sources[0].id;
        if(!id){
            console.log('access rejected')
            return
        }
        console.log('window id: ', id)
        try{
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: id,
                        maxWidth: window.screen.width,
                        maxHeight: window.screen.height
                        // maxWidth: 200,
                        // maxHeight: 200
                    }
                }
            });
            console.log(`1`)
            localStream = stream
            let video = document.querySelector('#video')
            try{
                video.srcObject = stream
            }catch(e){
                video.src = URL.createObjectURL(stream)
            }
            //录屏同步播放
            video.onloadedmetadata = (e) => {
                video.play()
            }

            stream.onended = () => {
                console.log('media stream ended')
            }
            let videoTracks = localStream.getVideoTracks()
            if(includeMic){
                console.log('add audio track')
                let audioTracks = microAudioStream.getAudioTracks()
                localStream.addTrack(audioTracks[0])
            }
            try{
                console.log('start recording stream')
                recorder = new MediaRecorder(stream)
            }catch(e){
                console.error('exception while recording MediaRecorder: ' + e)
                return
            }
            recorder.ondataavailable = (event) => {
                if(event.data && event.data.size > 0){
                    console.log(`event.data.size ${event.data.size}`);
                    recordedChunks.push(event.data)
                    numRecordedChunks += event.data.byteLength
                }
            }
            recorder.onstop = () => {
                console.log('recorder onstop fired')
            }
            recorder.start()
            console.log('recorder start')
        }catch(e){
            console.error(e)
        }

    });
}

const stopRecordDesktop = () => {
    recorder.stop()
    localStream.getVideoTracks()[0].stop()
}

const play = () => {
    let video = document.querySelector('#video')
    video.controls = true
    video.muted = false
    let blob = new Blob(recordedChunks, {type: 'video/webm'})
    video.srcObject = null;
    video.src = window.URL.createObjectURL(blob)
    video.onloadedmetadata = (e) => {
        video.play()
    }
}

const cleanRecord = () => {
    let video = document.querySelector('#video');
    video.controls = false;
    recordedChunks = []
    numRecordedChunks = 0
}

const saveFile = () => {
    let path = '/Users/bqj/Downloads/b.webm';
    let reader = new FileReader();
    reader.onload = () => {
        let buffer = new Buffer(reader.result)
        if(fs.existsSync(path)){
            fs.unlinkSync(path)
        }
        fs.writeFile(path, buffer, {}, err => {
            if(err){
                console.error(err);
            }
        })
    }
    let blob = new Blob(recordedChunks, {type: 'video/webm'})
    reader.readAsArrayBuffer(blob)
};

const saveBlobToFile = () => {
    //let reader = new FileReader();

}
