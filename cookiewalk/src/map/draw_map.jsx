import React, { useEffect, useState } from 'react';
import { Container as MapDiv, NaverMap, Marker, Polyline, useNavermaps } from 'react-naver-maps';
import './draw_map.css';

function MyMap({ toggleDrawing, drawing, setPath, path }) {
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
    if (drawing) {
      const newPoint = e.coord; // 클릭한 위치
      setPath(currentPath => [...currentPath, newPoint]); // 경로에 새로운 포인트 추가
    }
  };

  const blackDotIcon = {
    content: '<div style="width: 10px; height: 10px; border-radius: 50%; background-color: black;"></div>',
    size: new navermaps.Size(10, 10),
    anchor: new navermaps.Point(5, 5),
  };

  return (
    <NaverMap
      center={center}
      defaultZoom={15}
      onClick={handleMapClick}
    >
      {position && <Marker position={position} icon={blackDotIcon} />}
      {path.length > 0 && <Polyline path={path} map={navermaps} />}
    </NaverMap>
  );
}

export default function DrawMap() {
  const [drawing, setDrawing] = useState(false);
  const [path, setPath] = useState([]);

  const toggleDrawing = () => {
    setDrawing(!drawing);
    if (!drawing) {
      setPath([]); // 그리기를 시작할 때 경로를 초기화
    }
  };

  return (
    <div className='draw_map_container'>
      <button onClick={toggleDrawing} style={{ position: 'absolute', zIndex: 1000 }}>
        {drawing ? '그리기 중지' : '그림 그리기 '}시작
      </button>
      <MapDiv style={{ width: '100%', height: '500px' }}>
        <MyMap toggleDrawing={toggleDrawing} drawing={drawing} setPath={setPath} path={path} />
      </MapDiv>
    </div>
  );
}
