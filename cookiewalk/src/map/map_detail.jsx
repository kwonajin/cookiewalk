import React, { useEffect, useState } from 'react';
import './map_detail.css';
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline } from 'react-naver-maps';

function MyMap({ path, center }) {
  const navermaps = useNavermaps();
  return (
    <NaverMap
      defaultCenter={center ? new navermaps.LatLng(center.latitude, center.longitude) : new navermaps.LatLng(37.3595704, 127.105399)} 
      defaultZoom={15} 
      scaleControl={false}
      mapDataControl={false}
    >
      {path.length > 1 && (
        <Polyline
          path={path.map(p => new navermaps.LatLng(p.latitude, p.longitude))}
          strokeColor='blue'
          strokeWeight={4}
          strokeOpacity={0.8}
          strokeStyle="solid"
        />
      )}
    </NaverMap>
  );
}

export default function Map_detail() {
  const navigate = useNavigate();
  const mapList = useLocation();
  console.log(mapList.state);

  const drawId = mapList.state.drawID;
  const distance = mapList.state.distance;
  const level = mapList.state.level;
  const time = mapList.state.time;
  const location = mapList.state.location;
  const title = mapList.state.title;
  const drawPath = mapList.state.pathcoord.coordinate;
  const center = mapList.state.centercoord.coordinate;
  const nickName = mapList.state.nickName
  // const drawUserId=mapList.state.drawUserId

  console.log(drawPath);
  console.log(center);

  const followRoute = () => {
    navigate('/BeforeStart', { state: { drawPath: drawPath , drawId:drawId , path:[]} });
  };

  // Scroll to top on component mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="MapDetail_container">
      <Link to='/map'><div><img className="MapDetail_backArrow" src="./icon/arrow.svg" alt="Back Arrow" /></div></Link>
      <span className="MapDetail_title">맵</span>
      <div className="MapDetail_title_line"></div>

      <MapDiv className='e300_47'><MyMap path={drawPath} center={center} /></MapDiv>
      {/* <div><img className="e300_47" src="./images/group1.png"/></div> */}
      {/* 경로 이미지 들어가는 곳 */}

      <span className="MapDetail_location">{title}</span>

      <div className="MapDetail_Detail_line_s"></div>

      {/* 여기에 위치 정보 넣는란도 추가 희망 */}
      <div><img className="MapDetail_distance_icon" src="./icon/run.svg" alt="Distance Icon" /></div>
      <span className="MapDetail_distance_value">{distance}km</span>

      <div><img className="MapDetail_time_icon" src="./icon/place.svg" alt="Location Icon" /></div>
      <span className="MapDetail_time_value">{location}</span>

      <div><img className="MapDetail_difficulty_icon" src="./icon/round-star.svg" alt="Difficulty Icon" /></div>
      <span className="MapDetail_difficulty_value">{level} </span>
      {/* 제작자:{nickName} */}
      <div className="MapDetail_Detail_line_e"></div>

      <span className="mapDetail_button" onClick={followRoute}>경로 따라가기</span>
    </div>
  );
}
