import React, { useEffect, useState, Suspense } from 'react';
import { Container as MapDiv, NaverMap, Marker, Polyline, useNavermaps, NavermapsProvider } from 'react-naver-maps';
import './draw_group.css';
import customIcon from '../../public/images/logo.png';
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext';
import axios from 'axios';
import { Link, useNavigate } from "react-router-dom";

const initialColors = ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF'];

function MyMap({ drawing, setPath, path, start, setEndPoint, redMarkerClicked, setRedMarkerClicked, colors, sectionIndex, onPolylineClick }) {
  const navermaps = useNavermaps();
  const [position, setPosition] = useState(null);
  const [center, setCenter] = useState(new navermaps.LatLng(37.3595704, 127.105399));

  useEffect(() => {
    const fetchPosition = async () => {
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
    };
    fetchPosition();
  }, [navermaps]);

  const handleMapClick = (e) => {
    if (drawing && !redMarkerClicked) {
      const newPoint = { lat: e.coord._lat, lng: e.coord._lng };
      setPath(currentPath => {
        const newPath = [...currentPath];
        newPath[sectionIndex] = [...(newPath[sectionIndex] || []), newPoint];
        if (newPath[sectionIndex].length === 1 && sectionIndex === 0) {
          start(newPoint);
        }
        return newPath;
      });
      setEndPoint(newPoint);
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

  const customIconFactory = () => ({
    content: `<div class='animated-cookie' style='width: 30px; height: 40px;'><img src="${customIcon}" style="width: 100%; height: 100%;" /></div>`,
    size: new navermaps.Size(30, 40),
    anchor: new navermaps.Point(15, 25)
  });

  return (
    <NaverMap
      center={center}
      defaultZoom={15}
      onClick={handleMapClick}
    >
      {position && <Marker position={position} icon={customIconFactory()} />}
      {path.map((sectionPath, index) => (
        sectionPath && sectionPath.length > 0 && (
          <React.Fragment key={index}>
            <Polyline
              path={sectionPath}
              strokeColor={colors[index]}
              strokeWeight={5}
              onClick={() => onPolylineClick(index)}
              clickable={true}
            />
            <Marker
              position={sectionPath[0]}
              icon={iconFactory(redMarkerClicked ? 'blue' : `${colors[index]}`)}
              onClick={handleRedMarkerClick}
            />
            {sectionPath.length > 1 && (
              <Marker
                position={sectionPath[sectionPath.length - 1]}
                icon={iconFactory('black')}
              />
            )}
          </React.Fragment>
        )
      ))}
    </NaverMap>
  );
}

function DrawGroupMapComponent() {
  const navermaps = useNavermaps();
  const [drawing, setDrawing] = useState(false);
  const [path, setPath] = useState([]);
  const [pathHistory, setPathHistory] = useState([]);
  const [startPoint, setStartPoint] = useState(null);
  const [endPoint, setEndPoint] = useState(null);
  const [redMarkerClicked, setRedMarkerClicked] = useState(false);
  const [selectedGroupSize, setSelectedGroupSize] = useState(2);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [sectionChangeCount, setSectionChangeCount] = useState(0);
  const [position, setPosition] = useState(null);
  const [center, setCenter] = useState(new navermaps.LatLng(37.3595704, 127.105399));
  const navigate = useNavigate();
  const userInfo = useToken();
  const userID = userInfo.user;
  const [address, setAddress] = useState('');

  const [title, setTitle] = useState('');
  const [totalDistance, setTotalDistance] = useState('');
  const [selectedDifficulty, setSelectedDifficulty] = useState('하');
  const [colorPickerVisible, setColorPickerVisible] = useState(false);
  const [selectedColors, setSelectedColors] = useState(initialColors);
  const [currentPolylineIndex, setCurrentPolylineIndex] = useState(null);

  const toggleDrawing = () => {
    if (drawing) {
      const allSectionsCompleted = path.every(section => section && section.length > 1);
      const requiredSections = selectedGroupSize;
      const drawnSections = path.filter(section => section && section.length > 1).length;

      if (!allSectionsCompleted || drawnSections < requiredSections) {
        alert('경로를 모두 그려주세요');
        return;
      }
      setColorPickerVisible(true);
    } else {
      setSelectedColors(initialColors);
    }
    setDrawing(prevDrawing => !prevDrawing);
    setCurrentPolylineIndex(null);
    if (!drawing) {
      clearAllDrawings();
    }
  };

  const undoLastDrawing = () => {
    setPath(currentPath => {
      const newPath = currentPath.slice();
      if (newPath[sectionIndex] && newPath[sectionIndex].length > 0) {
        newPath[sectionIndex] = newPath[sectionIndex].slice(0, -1);
      } else if (sectionIndex > 0) {
        let lastSectionIndex = sectionIndex;
        while (lastSectionIndex > 0 && (!newPath[lastSectionIndex] || newPath[lastSectionIndex].length === 0)) {
          lastSectionIndex--;
        }
        if (lastSectionIndex >= 0 && newPath[lastSectionIndex] && newPath[lastSectionIndex].length > 0) {
          newPath[lastSectionIndex] = newPath[lastSectionIndex].slice(0, -1);
          setSectionIndex(lastSectionIndex);
          setSectionChangeCount(sectionChangeCount - 1);
        }
      }
      return newPath;
    });
  };

  const clearAllDrawings = () => {
    setPath([]);
    setStartPoint(null);
    setEndPoint(null);
    setRedMarkerClicked(false);
    setSectionIndex(0);
    setSectionChangeCount(0);
    setPathHistory([]);
    setColorPickerVisible(false);
    setCurrentPolylineIndex(null);
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
  };

  const handleGroupSizeChange = (e) => {
    setSelectedGroupSize(e.target.value);
  };

  const handleSectionChange = () => {
    if (path[sectionIndex] && path[sectionIndex].length < 2) {
      alert('경로를 설정해주세요');
      return;
    }
    if (sectionChangeCount >= selectedGroupSize - 1) {
      alert('선택 인원을 초과하였습니다');
      return;
    }
    if (window.confirm(`구역을 전환하시겠습니까? (${sectionChangeCount + 1}/${selectedGroupSize})`)) {
      setPathHistory(prevHistory => [
        ...prevHistory,
        {
          path: [...path],
          sectionIndex,
          sectionChangeCount,
          startPoint,
          endPoint,
          redMarkerClicked,
        },
      ]);
      setSectionChangeCount(prevCount => prevCount + 1);
      setSectionIndex(prevIndex => {
        const newIndex = (prevIndex + 1) % selectedGroupSize;
        if (path[prevIndex] && path[prevIndex].length > 0) {
          setPath(currentPath => {
            const newPath = [...currentPath];
            newPath[newIndex] = [];
            return newPath;
          });
        }
        return newIndex;
      });
    }
  };

  const handlePolylineClick = (index) => {
    if (!drawing) {
      setCurrentPolylineIndex(index);
      setColorPickerVisible(true);
    }
  };

  const handleColorChange = (e) => {
    const color = e.target.value;
    setSelectedColors(prevColors => {
      const newColors = [...prevColors];
      newColors[currentPolylineIndex] = color;
      return newColors;
    });
  };

  async function getReverseGeocode(latitude, longitude) {
    const url = `http://localhost:3000/reverse_geocoding?latitude=${latitude}&longitude=${longitude}`;
    try {
      const response = await axios.get(url, { latitude, longitude });
      console.log(response.data.results[1].region);
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

      //group 테이블 삽입
      const { data: countData, error: countError, count } = await supabase
        .from('group')
        .select('*', { count: 'exact' });
      if (countError) {
        console.error(countError);
      }
      console.log(count);
      //group 테이블 삽입
      const { data: insertCollection, error: insertCollectionError } = await supabase
        .from('group')
        .insert([
          {
            group_id: `group_${count + 1}`,   //그룹 아이디
            created_at: created_time,         //만든시간
            user_id: userID,                  //만든사람 아이디
            location: address,                //위치
            level: '',                        //난이도
            title: '',                        //제목
            limit_member: '',                 //제한 인원
            distance: '',                     //각각 구역 길이 배열로
            total_distance: '',               //전체 길이
          }
        ]);
      if (insertCollectionError) {
        console.error(insertCollectionError);
      }
      //group_member 테이블 삽입 처음 만들때는 그룹장만 삽입됨(region_number은 일단 자동으로 1)
      const {data : insertMember, error: insertMemberError }= await supabase
        .from('group_member')
        .insert([
          {
            group_id:`group_${count + 1}`,        //그룹 아이디
            user_id: userID,                      //그룹장 아이디 
            region_number:1                       //그룹장 구역은 일단 1로 지정 
          }
        ])
      if( insertMemberError){
        console.error(insertMemberError)
      }
      //group_draw_map_location 테이블 삽입
      for (const [sectionIndex, sectionPath] of path.entries()) {
        for (const [index, location] of sectionPath.entries()) {
          const { data: insertLocation, insertLocationError } = await supabase
            .from('group_draw_map_location')
            .insert([
              {
                draw_m_c_id: `group_${count + 1}`,
                reegion_number: '',                             //각 구역 넘버
                mark_order: `${sectionIndex + 1}-${index + 1}`, 
                latitude: location.latitude,
                longitude: location.longitude,
                color: selectedColors.slice(0, selectedGroupSize).join(',')
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

  useEffect(() => {
    console.log(path);
  }, [path]);

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

      {colorPickerVisible && currentPolylineIndex !== null && !drawing && (
        <input
          type="color"
          className='color_picker'
          value={selectedColors[currentPolylineIndex]}
          onChange={handleColorChange}
          style={{ position: 'absolute', zIndex: 1000, left: '200px', top: '690px'}}
        />
      )}

      <Link to="/map">
        <div className="write_back">
          <img className='write_back_icon' src="./icon/arrow.svg" alt="Back" />
        </div>
      </Link>
      <div className='draw_title'>경로 그리기</div>

      <div className='draw_save' onClick={submitRoute}>경로 저장</div>

      <MapDiv className='mapimg' style={{ width: '100%', height: '450px' }}>
        <MyMap drawing={drawing} setPath={setPath} path={path} start={setStartPoint} setEndPoint={setEndPoint} redMarkerClicked={redMarkerClicked} setRedMarkerClicked={setRedMarkerClicked} colors={selectedColors} sectionIndex={sectionIndex} onPolylineClick={handlePolylineClick} />
      </MapDiv>

      <div className='draw_name'>제목</div>
      <input className='draw_name_text' type="text" placeholder='그린 경로의 제목을 입력하세요' value={title} onChange={(e) => setTitle(e.target.value)} />
      <div className='draw_distance'>거리</div>
      <div className='draw_distance_content'>자동으로 거리 계산</div>
      <div className='draw_line1'></div>
      <div className='draw_place'>장소</div>
      <div className='draw_place_content'>처음 점을 위치로 가져옴</div>
      <div className='draw_line2'></div>

      <div className='draw_rate'>난이도</div>
      <select className='draw_rate_dropdown' value={selectedDifficulty} onChange={(e) => setSelectedDifficulty(e.target.value)}>
        <option value="하">하</option>
        <option value="중">중</option>
        <option value="상">상</option>
      </select>
      <div className='color_select_text'>선 색상 선택하기</div>

      <div className='group_select_text'>인원 선택하기</div>
      <select className='group_select' value={selectedGroupSize} onChange={handleGroupSizeChange} style={{ position: 'absolute', zIndex: 1000, left: '370px' }} disabled={drawing}>
        <option value={2}>2명</option>
        <option value={3}>3명</option>
        <option value={4}>4명</option>
        <option value={5}>5명</option>
      </select>
    </div>
  );
}

export default function DrawGroupMap() {
  return (
    <NavermapsProvider ncpClientId={import.meta.env.VITE_NAVER_CLIENT_ID}>
      <Suspense fallback={<div>Loading...</div>}>
        <DrawGroupMapComponent />
      </Suspense>
    </NavermapsProvider>
  );
}
