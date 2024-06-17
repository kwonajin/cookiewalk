// src/textToSpeech.js
// export const textToSpeech = (text) => {
//     const synth = window.speechSynthesis;
//     const utterance = new SpeechSynthesisUtterance(text);
//     utterance.lang = 'ko-KR'; // 한국어 설정
//     synth.speak(utterance);
//   };
  
import axios from 'axios'

const apiKey = import.meta.env.VITE_GOOGLE_CLOUD_API_KEY

export const textToSpeech = async (text) =>{
  const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

  const data = {
    input: {text},
    voice: {languageCode: 'ko-KR', ssmlGender: 'FEMALE'},
    audioConfig: {audioEncoding: 'MP3'},
  };

  try {
    const response = await axios.post(url, data, {
      headers:{
        'Content-Type': 'application/json',
      },
    });
    const audioContent = response.data.audioContent;
    const audioBlob = new Blob([new Uint8Array(atob(audioContent).split('').map((char)=>char.charCodeAt(0)))],{type: 'audio/mp3'});
    const audioUrl =URL.createObjectURL(audioBlob);
    const audio = new Audio(audioUrl);
    audio.play();
  }catch(error){
    console.error(error)
  }

};
