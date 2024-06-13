// src/textToSpeech.js
export const textToSpeech = (text) => {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR'; // 한국어 설정
    synth.speak(utterance);
  };
  
  