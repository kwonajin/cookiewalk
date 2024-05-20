import React, { useEffect, useState } from 'react';
import { Container as MapDiv, NaverMap, Marker, Polyline, useNavermaps } from 'react-naver-maps';
import './draw_map.css';
import customIcon from '../../public/images/logo.png';  // 이미지 경로를 불러옵니다.
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext';
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import html2canvas from 'html2canvas'

function MyMap({ drawing, setPath, path, start, end, setEndPoint, redMarkerClicked, setRedMarkerClicked, setPathAfterRedMarker, selectedColor }) {
  const navermaps = useNavermaps();
  const [position, setPosition] = useState(null);
  const [center, setCenter] = useState(new navermaps.LatLng(37.3595704, 127.105399));

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      function(position) {
        const { latitude, longitude } = position.coords;
        const newPos = new navermaps.LatLng(latitude, longitude);
        setPosition(newPos);
        setCenter(newPos);
      },
      function(error) {
        console.error("Geolocation 정보를 가져오는 데 실패했습니다:", error);
      }
    );
  }, [navermaps]);

  const handleMapClick = (e) => {
    if (drawing && !redMarkerClicked) {
      const newPoint = e.coord;
      setPath(currentPath => {
        if (currentPath.length === 0) {
          start(newPoint);  // 첫 클릭에서 출발지로 설정하고 빨간색으로 표시
          return [newPoint];
        } else {
          return [...currentPath, newPoint];
        }
      });
      setEndPoint(newPoint);  // 마지막 클릭을 항상 업데이트
    }
  };

  const handleRedMarkerClick = () => {
    if (drawing && !redMarkerClicked) {
      setRedMarkerClicked(true);
      setPath(currentPath => {
        const newPath = [...currentPath, currentPath[0]];
        setPathAfterRedMarker(newPath);
        return newPath;
      });
    }
  };

  const iconFactory = (color) => ({
    content: `<div style='width: 15px; height: 15px; border-radius: 50%; background-color: ${color};'></div>`,
    size: new navermaps.Size(15, 15),
    anchor: new navermaps.Point(7.5, 7.5)
  });

  const customIconFactory = () => ({
    url: customIcon,
    size: new navermaps.Size(30,40 ),  // 이미지 크기를 설정합니다.
    scaledSize: new navermaps.Size(30, 40),
    anchor: new navermaps.Point(15, 25)
  });

  return (

    <div className='map2'>
      <NaverMap
        center={center}
        defaultZoom={15}
        onClick={handleMapClick}
      >
        {position && <Marker position={position} icon={customIconFactory()} />}  
        {/* // 사용자의 현재 위치를 로고 이미지로 표시 */}
        {path.length > 0 && <Polyline className='polyline' path={path} strokeColor={selectedColor} strokeWeight={5} />}
        {path.length > 0 && (
          <Marker
            position={path[0]}
            icon={iconFactory(redMarkerClicked ? 'blue' : 'red')}  // 첫 클릭을 빨간색으로 표시, 클릭하면 파란색으로 변경
            onClick={handleRedMarkerClick}  // 빨간색 점 클릭 이벤트 핸들러
          />
        )}
        {path.length > 1 && !redMarkerClicked && (
          <Marker position={path[path.length - 1]} icon={iconFactory('green')} />  // 마지막 클릭을 초록색으로 표시
        )}
      </NaverMap>
    </div>
  );
}

export default function DrawMap() {
  
  const [drawing, setDrawing] = useState(false);
  const [path, setPath] = useState([]);
  const [pathAfterRedMarker, setPathAfterRedMarker] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [redMarkerClicked, setRedMarkerClicked] = useState(false);
  const [selectedColor, setSelectedColor] = useState('#000000'); // 기본 색상 설정
  
  const  navigate = useNavigate();

  const userInfo=useToken();
  const userID = userInfo.user;
  const [address, setAddress]=useState('')


  const toggleDrawing = () => {
    setDrawing(prevDrawing => !prevDrawing);
    if (drawing) { // 그리기 종료 시
      setPath(currentPath => [...currentPath]);  // 경로 유지
    } else { // 그리기 시작 시 모든 상태를 초기화
      setPath([]);
      setPathAfterRedMarker([]);
      setStartPoint(null);
      setEndPoint(null);
      setRedMarkerClicked(false);
    }
  };

  const undoLastDrawing = () => {
    setPath(currentPath => {
      const newPath = currentPath.slice(0, -1);
      if (newPath.length === 0) {
        setStartPoint(null);
        setRedMarkerClicked(false);
      }
      setEndPoint(newPath.length > 0 ? newPath[newPath.length - 1] : null);
      return newPath;
    });
    if (redMarkerClicked) {
      setPath(pathAfterRedMarker.slice(0, -1));
      setRedMarkerClicked(false);
    }
  };

  const clearAllDrawings = () => {
    setPath([]);
    setPathAfterRedMarker([]);
    setStartPoint(null);
    setEndPoint(null);
    setRedMarkerClicked(false);
    if (!drawing) {
      setDrawing(true);  // 초기화 후에도 그림 그리기 모드 유지
    }
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  //경로 위치정보 가져오는 함수
  async function getReverseGeocode(latitude, longitude){
    const url =`http://localhost:3000/reverse_geocoding?latitude=${latitude}&longitude=${longitude}`;
    try{
        const response = await axios.get(url, {latitude, longitude});
        console.log(response.data.results[1].region)
        const area1=response.data.results[1].region.area1.name
        const area2=response.data.results[1].region.area2.name
        const area3=response.data.results[1].region.area3.name
        const area= `${area1} ${area2} ${area3}`
        setAddress(area)
        console.log(area)
        return area;
    }catch (error){
        console.error(error)
        throw error;
    }
};
  // 지도 캡쳐 및 업로드
  const dataURItoBlob = (dataURI) => {
    const byteString = atob(dataURI.split(',')[1]);
    const mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
    const ab = new ArrayBuffer(byteString.length)
    const ia = new Uint8Array(ab);
    for(let i =0; i< byteString.length; i++){
      ia[i]= byteString.charCodeAt(i);
    }
    return new Blob([ab], {type:mimeString})
  }

  //경로 저장 함수 
  async function submitRoute(){
    if(path.length >2){
      const created_time=new Date();

      const {data: countData, error: countError, count}= await supabase
        .from('draw_map_collection')
        .select('*', {count: 'exact'});
      if(countError){
        console.error(countError)
      }
      console.log(count)
      //getReverseGeocode(path[0]._lat, path[0]._lng)
      const {data: insertCollection, error: insertCollectionError}= await supabase 
        .from('draw_map_collection')
        .insert([
          {
            draw_m_c_id: `draw_${count+1}`,
            created_at: created_time,
            user_id: userID,
            location: address,
            color:selectedColor,
            level: '상',
            distance: 3.34,
            time: 600


          }
        ])
      if(insertCollectionError){
        console.error(insertCollectionError)
      }
      for (const [index, location] of path.entries()){
        // console.log(location)
        const {data: insertLocation, insertLocationError}= await supabase
          .from('draw_map_c_location')
          .insert([
            {
              draw_m_c_id: `draw_${count+1}`,
              mark_order:index+1,
              latitude: location._lat,
              longitude: location._lng
            }
          ])
        if(insertLocationError){
          console.error(insertLocationError)
        }
      }
      // 지도 캡처 부분
      await new Promise(resolve => setTimeout(resolve, 2000));
      const mapElement = document.querySelector('.map2')
      try{
        const canvas = await html2canvas(mapElement, {
          useCORS: true,
          allowTaint: false
        });
        const imgDataUrl = await canvas.toDataURL('image/png');

        const fileName= `draw_${count+1}.png`;

        const {data: uploadImage, error: uploadImgError}= await supabase.storage
          .from('image')
          .upload(`Map/${fileName}`, dataURItoBlob(imgDataUrl),{
            cacheControl: '3600',
            upsert:false
          });
          if (uploadImgError){
            console.error(uploadImgError)
          }
      }catch(error){
      console.error(error)
      }
    navigate('/home')
    }
  }

  return (
    <div className='draw_map_container'>
      <button onClick={toggleDrawing} style={{ position: 'absolute', zIndex: 1000 }}>
        {drawing ? '그림 그리기 종료' : '그림 그리기 시작'}
      </button>
      {drawing && (
        <>
          <button onClick={undoLastDrawing} style={{ position: 'absolute', zIndex: 1000, left: '80px' }}>
            되돌리기
          </button>
          <button onClick={clearAllDrawings} style={{ position: 'absolute', zIndex: 1000, left: '160px' }}>
            초기화
          </button>
        </>
      )}
      <input 
        type="color" 
        value={selectedColor} 
        onChange={handleColorChange} 
        style={{ position: 'absolute', zIndex: 1000, left: '240px' }} 
      />
        <div className='navermap'>
          <MapDiv  style={{width: '100%', height: '500px' }}>
            <MyMap className='navermap2' drawing={drawing} setPath={setPath} path={path} start={setStartPoint} setEndPoint={setEndPoint} redMarkerClicked={redMarkerClicked} setRedMarkerClicked={setRedMarkerClicked} setPathAfterRedMarker={setPathAfterRedMarker} selectedColor={selectedColor} />
          </MapDiv>
        </div>
      {/* 임의로 만든 저장버튼 */}
      <button onClick={submitRoute} >경로 저장</button>

    </div>
  );
}
