import React, { useEffect, useState } from 'react';
import { Container as MapDiv, NaverMap, Marker, Polyline, useNavermaps } from 'react-naver-maps';
import './draw_group.css';
import customIcon from '../../public/images/logo.png';  // 이미지 경로를 불러옵니다.
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

function MyMap({ drawing, setPath, path, start, end, setEndPoint, redMarkerClicked, setRedMarkerClicked, setPathAfterRedMarker, colors, sectionIndex }) {
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
      console.log('newPoint:')
      setPath(currentPath => {
        const newPath = [...currentPath];
        newPath[sectionIndex] = [...(newPath[sectionIndex] || []), newPoint];
        if (newPath[sectionIndex].length === 1 && sectionIndex === 0) {
          start(newPoint);  // 첫 클릭에서 출발지로 설정하고 빨간색으로 표시
        }
        return newPath;
      });
      setEndPoint(newPoint);  // 마지막 클릭을 항상 업데이트
    }
  };

  const handleRedMarkerClick = () => {
    if (drawing && !redMarkerClicked) {
      setRedMarkerClicked(true);
      setPath(currentPath => {
        const newPath = [...currentPath];
        newPath[sectionIndex] = [...(newPath[sectionIndex] || []), currentPath[0][0]];
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
    size: new navermaps.Size(30, 40),  // 이미지 크기를 설정합니다.
    scaledSize: new navermaps.Size(30, 40),
    anchor: new navermaps.Point(15, 25)
  });

  return (
    <NaverMap
      center={center}
      defaultZoom={15}
      onClick={handleMapClick}
    >
      {position && <Marker position={position} icon={customIconFactory()} />}  // 사용자의 현재 위치를 로고 이미지로 표시
      {path.map((sectionPath, index) => (
        sectionPath.length > 0 && <Polyline key={index} path={sectionPath} strokeColor={colors[index]} strokeWeight={5} />
      ))}
      {path[0] && path[0].length > 0 && (
        <Marker
          position={path[0][0]}
          icon={iconFactory(redMarkerClicked ? 'blue' : 'red')}  // 첫 클릭을 빨간색으로 표시, 클릭하면 파란색으로 변경
          onClick={handleRedMarkerClick}  // 빨간색 점 클릭 이벤트 핸들러
        />
      )}
      {path[sectionIndex] && path[sectionIndex].length > 1 && !redMarkerClicked && (
        <Marker position={path[sectionIndex][path[sectionIndex].length - 1]} icon={iconFactory('green')} />  // 마지막 클릭을 초록색으로 표시
      )}
    </NaverMap>
  );
}

export default function DrawGroupMap() {
  const [drawing, setDrawing] = useState(false);
  const [path, setPath] = useState([]);
  const [pathAfterRedMarker, setPathAfterRedMarker] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [redMarkerClicked, setRedMarkerClicked] = useState(false);
  const [selectedGroupSize, setSelectedGroupSize] = useState(2); // 기본 인원 설정
  const [sectionIndex, setSectionIndex] = useState(0);
  const navigate = useNavigate();
  const userInfo = useToken();
  const userID = userInfo.user;
  const [address, setAddress] = useState('');

  const colors = ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF']; // 빨간색, 주황색, 노란색, 초록색, 파란색

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
      setSectionIndex(0); // 섹션 인덱스 초기화
    }
  };

  const undoLastDrawing = () => {
    setPath(currentPath => {
      const newPath = currentPath.slice();
      if (newPath[sectionIndex]) {
        newPath[sectionIndex] = newPath[sectionIndex].slice(0, -1);
      }
      if (newPath[sectionIndex].length === 0) {
        setStartPoint(null);
        setRedMarkerClicked(false);
      }
      setEndPoint(newPath[sectionIndex].length > 0 ? newPath[sectionIndex][newPath[sectionIndex].length - 1] : null);
      return newPath;
    });
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

  const handleGroupSizeChange = (e) => {
    setSelectedGroupSize(e.target.value);
  };

  const handleSectionChange = () => {
    setSectionIndex(prevIndex => {
      const newIndex = (prevIndex + 1) % selectedGroupSize;
      if (path[prevIndex] && path[prevIndex].length > 0) {
        setPath(currentPath => {
          const newPath = [...currentPath];
          newPath[newIndex] = [currentPath[prevIndex][currentPath[prevIndex].length - 1]];
          return newPath;
        });
      }
      return newIndex;
    });
  };

  async function getReverseGeocode(latitude, longitude) {
    const url = `http://localhost:3000/reverse_geocoding?latitude=${latitude}&longitude=${longitude}`;
    try {
      const response = await axios.get(url, { latitude, longitude });
      console.log(response.data.results[1].region)
      const area1 = response.data.results[1].region.area1.name;
      const area2 = response.data.results[1].region.area2.name;
      const area3 = response.data.results[1].region.area3.name;
      const area = `${area1} ${area2} ${area3}`;
      setAddress(area);
      console.log(area);
      return area;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  async function submitRoute() {
    if (path.flat().length > 2) {
      const created_time = new Date();

      const { data: countData, error: countError, count } = await supabase
        .from('draw_map_collection')
        .select('*', { count: 'exact' });
      if (countError) {
        console.error(countError);
      }
      console.log(count);

      const { data: insertCollection, error: insertCollectionError } = await supabase
        .from('draw_map_collection')
        .insert([
          {
            draw_m_c_id: `draw_${count + 1}`,
            created_at: created_time,
            user_id: userID,
            location: address,
            color: colors.slice(0, selectedGroupSize).join(',')
          }
        ]);
      if (insertCollectionError) {
        console.error(insertCollectionError);
      }
      for (const [sectionIndex, sectionPath] of path.entries()) {
        for (const [index, location] of sectionPath.entries()) {
          const { data: insertLocation, insertLocationError } = await supabase
            .from('draw_map_c_location')
            .insert([
              {
                draw_m_c_id: `draw_${count + 1}`,
                mark_order: `${sectionIndex + 1}-${index + 1}`,
                latitude: location._lat,
                longitude: location._lng
              }
            ]);
          if (insertLocationError) {
            console.error(insertLocationError);
          }
        }
      }
      navigate('/home');
    }
  }

  useEffect(()=>{
    console.log(path)
  },[path])
  return (
    <div className='group_draw_map_container'>
      <button className='group_draw_start' onClick={toggleDrawing} style={{ position: 'absolute', zIndex: 1000 }}>
        {drawing ? '그림 그리기 종료' : '그리기 시작'}
      </button>
      {drawing && (
        <>
          <button className='group_draw_line_back' onClick={undoLastDrawing} style={{ position: 'absolute', zIndex: 1000, left: '80px' }}>
            되돌리기
          </button>
          <button className='group_draw_reset' onClick={clearAllDrawings} style={{ position: 'absolute', zIndex: 1000, left: '160px' }}>
            초기화
          </button>
          <button className='group_section_change' onClick={handleSectionChange} style={{ position: 'absolute', zIndex: 1000, left: '240px' }}>
            구역 전환
          </button>
        </>
      )}
      
      <Link to="/map">
        <div className="write_back">
          <img className='write_back_icon' src="./icon/arrow.svg" alt="Back" />
        </div>
      </Link>
      <div className='draw_title'>경로 그리기</div>
      
      <div className='draw_save' onClick={submitRoute} >경로 저장</div>
      
      <MapDiv className='mapimg' style={{ width: '100%', height: '450px' }}>
        <MyMap drawing={drawing} setPath={setPath} path={path} start={setStartPoint} setEndPoint={setEndPoint} redMarkerClicked={redMarkerClicked} setRedMarkerClicked={setRedMarkerClicked} setPathAfterRedMarker={setPathAfterRedMarker} colors={colors} sectionIndex={sectionIndex} />
      </MapDiv>

      <div className='draw_name'>제목</div>
      <input className='draw_name_text' type="text" placeholder='그린 경로의 제목을 입력하세요' />
      <div className='draw_distance'>거리</div>
      <div className='draw_distance_content'>자동으로 거리 계산</div>
      <div className='draw_line1'></div>
      <div className='draw_place'>장소</div>
      <div className='draw_place_content'>처음 점을 위치로 가져옴</div>
      <div className='draw_line2'></div>

      <div className='draw_rate'>난이도</div>
      <div className='draw_rate_dropdown'>드롭다운 상중하</div>
      <div className='color_select_text'>선 색상 선택하기</div>

      <div className='group_select_text'>인원 선택하기</div>
      <select className='group_select' value={selectedGroupSize} onChange={handleGroupSizeChange} style={{ position: 'absolute', zIndex: 1000, left: '370px' }}>
        <option value={2}>2명</option>
        <option value={3}>3명</option>
        <option value={4}>4명</option>
        <option value={5}>5명</option>
      </select>
    </div>
  );
}
