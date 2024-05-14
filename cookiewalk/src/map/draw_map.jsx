import React, { useEffect, useState } from 'react';
import { Container as MapDiv, NaverMap, Marker, Polyline, useNavermaps } from 'react-naver-maps';
import './draw_map.css';

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

  return (
    <NaverMap
      center={center}
      defaultZoom={15}
      onClick={handleMapClick}
    >
      {position && <Marker position={position} icon={iconFactory('black')} />}
      {path.length > 0 && <Polyline path={path} strokeColor={selectedColor} strokeWeight={5} />}
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
      <MapDiv style={{ width: '100%', height: '500px' }}>
        <MyMap drawing={drawing} setPath={setPath} path={path} start={setStartPoint} setEndPoint={setEndPoint} redMarkerClicked={redMarkerClicked} setRedMarkerClicked={setRedMarkerClicked} setPathAfterRedMarker={setPathAfterRedMarker} selectedColor={selectedColor} />
      </MapDiv>
    </div>
  );
}
