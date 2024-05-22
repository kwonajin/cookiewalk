import React from 'react'

const FullScreenCapture = async ()=> {
  //화면 캡처 시작함수
  const startCapture = async ()=>{
    let captureStream = null;
    try{
      // 사용자에게 화면 캡처 권한 요청, 성공시 스트림 반환
      captureStream = await navigator.mediaDevices.getDisplayMedia({video:true});
    }catch (err){
      console.error("Error: " +err);
    }
    return captureStream;
  }

//전체 화면 캡처하고, 캡처된 화면을 이미지로 변환
  const captureFullScreen = async () =>{
    //화면 캡처를 시작하여 스트림을 가져온다.
    const stream = await startCapture();
    //비디오 엘리먼트 생성, 캡처된 스트림을 소스로 설정
    const video = document.createElement('video');
    video.srcObject=stream;

    //비디오 메타데이터가 로드되었을 때 실행함수
    return new Promise((resolve)=>{
      video.onloadedmetadata= ()=>{
        //비디오 재생 시작
        video.play();
        //캔버스 엘리먼트 생성, 비디오의 크기에 맞게 설정
        const canvas = document.createElement('canvas');
        canvas.width= video.videoWidth;
        canvas.height = video.videoHeight;
        const context = canvas.getContext('2d');
    
  
      //비디오 프레임을 캔버스에 그림
      context.drawImage(video, 0,0,canvas.width, canvas.height)
  
      //비디오 스트림을 중지한다.
      stream.getTracks().forEach(track => track.stop());
  
      //캔버스를 이미지 데이터 URL로 변환한다.
      const imgDataUrl = canvas.toDataURL('image/png')
      resolve(imgDataUrl)
      };
    });
  };
  return await captureFullScreen();
};

export default FullScreenCapture