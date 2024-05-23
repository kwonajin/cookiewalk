import React, { useEffect, useState } from 'react';
import './map_detail.css'
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Map_detail(){
  const  navigate = useNavigate();
  const mapList = useLocation();
  console.log(mapList.state)

  const drawId= mapList.state.drawID
  const distance=mapList.state.distance;
  const level=mapList.state.level;
  const time=mapList.state.time;
  const location=mapList.state.location
  const followRoute = ()=>{
    navigate('/BeforeStart', {state:{drawID:drawId}})
  }


  return(
  <div className="MapDetail_container">
    <Link to='/map'><div><img className="MapDetail_backArrow" src="./icon/arrow.svg"/></div></Link>
    <span className="MapDetail_title">맵</span>
    <div className="MapDetail_title_line"></div>

    <div><img className="e300_47" src="./images/group1.png"/></div>
    {/* 경로 이미지 들어가는 곳 */}

    <span className="MapDetail_location">{location}</span>
    
    <div className="MapDetail_Detail_line_s"></div>

    {/* 여기에 위치 정보 넣는란도 추가 희망 */}
    <div><img className="MapDetail_distance_icon" src="./icon/run.svg"/></div>
    <span className="MapDetail_distance_value">{distance}km</span>
    
    <div><img className="MapDetail_time_icon" src="./icon/place.svg"/></div>
    <span className="MapDetail_time_value">장소 넣기 (시/동)</span>
    
    <div><img className="MapDetail_difficulty_icon" src="./icon/round-star.svg"/></div>
    <span className="MapDetail_difficulty_value">{level}</span>

    <div className="MapDetail_Detail_line_e"></div>

    <span className="mapDetail_button" onClick={followRoute}>경로 따라가기</span>
  </div>

    )
}