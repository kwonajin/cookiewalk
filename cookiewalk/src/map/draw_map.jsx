import React, { useEffect, useState } from 'react';
import { Container as MapDiv, NaverMap, Marker, Polyline, useNavermaps } from 'react-naver-maps';
import './draw_map.css';
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext';
import axios from 'axios'
import { Link, useNavigate } from "react-router-dom";
import  {calculateDistance} from '../utils/CalculateDistance'
import fetchAvatar from '../utils/getAvatar/getUserAvatar';

function MyMap({ drawing, setPath, path, start, end, setEndPoint, redMarkerClicked, setRedMarkerClicked, setPathAfterRedMarker, selectedColor, avatarUrl }) {
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
      const newPoint = {lat: e.coord._lat, lng: e.coord._lng}; 
      console.log(newPoint)
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
      setRedMarkerClicked(false);
    }
  };

  const iconFactory = (color) => ({
    content: `<div style='width: 15px; height: 15px; border-radius: 50%; background-color: ${color};'></div>`,
    size: new navermaps.Size(15, 15),
    anchor: new navermaps.Point(7.5, 7.5)
  });

  const customIconFactory = (url) => ({
    url: url,
    size: new navermaps.Size(30,40 ),  // 이미지 크기를 설정합니다.
    scaledSize: new navermaps.Size(30, 40),
    anchor: new navermaps.Point(15, 25)
  });

  return (
    <NaverMap
      center={center}
      defaultZoom={15}
      onClick={handleMapClick}
    >
      {position && <Marker position={position} icon={customIconFactory(avatarUrl)} />}  // 사용자의 현재 위치를 로고 이미지로 표시
      {path.length > 0 && <Polyline path={path} strokeColor={selectedColor} strokeWeight={7} />}
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
  const [totalDistance, setTotalDistance]=useState(0)

  const navigate = useNavigate();

  const userInfo = useToken();
  const userID = userInfo.user;
  const [address, setAddress] = useState('');
  const [title, setTitle] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('/images/logo.png'); // 아바타 URL 상태 추가

  const [selectedDifficulty, setSelectedDifficulty] = useState('하');  // 난이도 상태 추가

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
    setAddress('');
    setTotalDistance(0);
    if (!drawing) {
      setDrawing(true);  // 초기화 후에도 그림 그리기 모드 유지
    }
  };

  const handleColorChange = (e) => {
    setSelectedColor(e.target.value);
  };

  //경로 위치정보 가져오는 함수
  async function getReverseGeocode(latitude, longitude){
    const url =`https://blonde-bobolink-smartbusan-a2d9f8e5.koyeb.app/reverse_geocoding?latitude=${latitude}&longitude=${longitude}`;
    try{
        const response = await axios.get(url, {latitude, longitude});
        console.log(response.data)
        const area1=response.data.results[0].region.area1.name
        const area2=response.data.results[0].region.area2.name
        const area3=response.data.results[0].region.area3.name
        const area= `${area1} ${area2} ${area3}`
        setAddress(area)
        console.log(area)
        return area;
    }catch (error){
        console.error(error)
        throw error;
    }
};
  useEffect(()=>{
    console.log(path)
    if(path.length===1){
      getReverseGeocode(path[0].lat, path[0].lng)
    }else if(path.length>=2){
      const distance = calculateDistance(path[path.length-2],path[path.length-1])
      setTotalDistance((prevDistance)=> prevDistance + distance)
    }
  },[path])

  //경로 저장 함수 
  async function submitRoute(){
    if(path.length >2 && title !== ''){
      const created_time=new Date();
      const {data: countData, error: countError, count}= await supabase
        .from('draw_map_collection')
        .select('*', {count: 'exact'});
      if(countError){
        console.error(countError)
      }
      console.log(count)
      const {data: insertCollection, error: insertCollectionError}= await supabase 
        .from('draw_map_collection')
        .insert([
          {
            draw_m_c_id: `draw_${count+1}`,
            created_at: created_time,
            user_id: userID,
            location: address,
            color:selectedColor,
            level:selectedDifficulty,
            distance:totalDistance.toFixed(2),
            title: title
          }
        ])
      if(insertCollectionError){
        console.error(insertCollectionError)
      }
      for (const [index, location] of path.entries()){
        const {data: insertLocation, insertLocationError}= await supabase
          .from('draw_map_c_location')
          .insert([
            {
              draw_m_c_id: `draw_${count+1}`,
              mark_order:index+1,
              latitude: location.lat,
              longitude: location.lng
            }
          ])
        if(insertLocationError){
          console.error(insertLocationError)
        }
      }
      navigate('/home')
    }else{
      window.alert('필수값이 입력되지 않았습니다.')
    }
  }

  useEffect(() => {
    const fetchAvatarUrl = async () => {
        const url = await fetchAvatar(userID); // 아바타 URL 가져오기
        if (url) {
            setAvatarUrl(url); // 아바타 URL 설정
        }
    };
    fetchAvatarUrl();
  }, [userID]);

  return (
    <div className='draw_map_container'>
      
      <button className='draw_start' onClick={toggleDrawing} style={{ position: 'absolute', zIndex: 1000 }}>
        {drawing ? '그림 그리기 종료' : '그리기 시작'}
      </button>
      {drawing && (
        <>
          <button className='draw_line_back' onClick={undoLastDrawing} style={{ position: 'absolute', zIndex: 1000, left: '80px' }}>
            되돌리기
          </button>
          <button className='draw_reset' onClick={clearAllDrawings} style={{ position: 'absolute', zIndex: 1000, left: '160px' }}>
            초기화
          </button>
        </>
      )}
      <input className='color_select'
        type="color" 
        value={selectedColor} 
        onChange={handleColorChange} 
        style={{ position: 'absolute', zIndex: 1000, left: '240px' }} 
      />
      
      <Link to="/map">
        <div className="write_back">
          <img className='write_back_icon' src="./icon/arrow.svg" alt="Back" />
        </div>
      </Link>
      <div className='draw_title'>경로 그리기</div>
      
      {/* 임의로 만든 저장버튼 */}
      <div className='draw_save' onClick={submitRoute} >경로 저장</div>
      
      <MapDiv className='mapimg' style={{ width: '100%', height: '450px' }}>
        <MyMap drawing={drawing} setPath={setPath} path={path} start={setStartPoint} setEndPoint={setEndPoint} redMarkerClicked={redMarkerClicked} setRedMarkerClicked={setRedMarkerClicked} setPathAfterRedMarker={setPathAfterRedMarker} selectedColor={selectedColor} avatarUrl={avatarUrl} />
      </MapDiv>

      <div className='draw_name'>제목</div>
      <input className='draw_name_text' type="text" placeholder='그린 경로의 제목을 입력하세요' value={title} onChange={(e)=> setTitle(e.target.value)}/>
      <div className='draw_distance'>거리</div>
      <div className='draw_distance_content'>{totalDistance.toFixed(2)} Km</div>
      <div className='draw_line1'></div>
      <div className='draw_place'>장소</div>
      <div className='draw_place_content'>{address}</div>
      <div className='draw_line2'></div>

      <div className='draw_rate'>난이도</div>
      <select className='draw_rate_dropdown' value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
          <option value="하">하</option>
          <option value="중">중</option>
          <option value="상">상</option>
      </select>
      <div className='color_select_text'>선 색상 선택하기</div>
    </div>
  );
}
