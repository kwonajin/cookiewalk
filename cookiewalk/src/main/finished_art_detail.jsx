import React,{ useEffect, useState } from 'react';
import './finished_art_detail.css';
import { Link ,useLocation, useNavigate } from "react-router-dom";
import { Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline } from 'react-naver-maps';

function MyMap({ path, center , color}) {
  const navermaps = useNavermaps();
  return (
    <NaverMap
      bounds={center ? new navermaps.LatLngBounds(
      new navermaps.LatLng(center.south, center.west),
      new navermaps.LatLng(center.north, center.east)
      ) : null}
      defaultZoom={15}
      scaleControl={false}
      mapDataControl={false}
    >
      {path.length > 1 && (
        <Polyline
          path={path.map(p => new navermaps.LatLng(p.latitude, p.longitude))}
          strokeColor={color}
          strokeWeight={4}
          strokeOpacity={0.8}
          strokeStyle="solid"
        />
      )}
    </NaverMap>
  );
}


export default function FinishedArtDetail() {
  const navigate = useNavigate;
  const recordItem = useLocation()

  const recordId = recordItem.state.drawId;
  const distance = recordItem.state.distance;
  // const level = mapList.state.level;
  const time = recordItem.state.time;
  const location= recordItem.state.location;
  const title = recordItem.state.title;
  const path = recordItem.state.pathcoord.coordinate;
  const center = recordItem.state.center.coordinate;
  // const nickName = mapList.state.nickName
  const color= recordItem.state.color
  const level= recordItem.state.level

  console.log(recordItem)


  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
};
  return (
    <div className="fad_container">
      <Link to='/finished_art'><div><img className="fad_backArrow" src="./icon/arrow.svg" alt="Back Arrow" /></div></Link>
      <span className="fad_title">완성한 그림</span>
      <div className="fad_title_line"></div>

      <span className="fad_location">{title}</span>

      <div className="fad_Detail_line_s"></div>
      {/* <div className='fad_map_img'></div> */}
      <MapDiv className='fad_map_img'><MyMap path={path} center={center} color={color}/></MapDiv>

      {/* 여기에 위치 정보 넣는란도 추가 희망 */}
      <div><img className="fad_distance_icon" src="./icon/run.svg" alt="Distance Icon" /></div>
      <span className="fad_distance_value">{distance} km</span>

      <div><img className="fad_location_icon" src="./icon/place.svg" alt="Location Icon" /></div>
      <span className="fad_location_value">{location}</span>

      <div><img className="fad_difficulty_icon" src="./icon/round-star.svg" alt="Difficulty Icon" /></div>
      <span className="fad_difficulty_value">{level}</span>

      <div><img className="fad_time_icon" src="./icon/clock.svg" alt="Difficulty Icon" /></div>
      <span className="fad_time_value">{formatTime(time)}</span>

      <div className="fad_Detail_line_e"></div>

      <Link to='/write_map' state={{recordId:recordId, path:path, center:center, color:color, location: location}}><span className="fad_button">게시물 작성하기</span></Link>
    </div>
  );
}
