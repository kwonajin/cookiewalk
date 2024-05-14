import React, { useEffect, useState } from 'react';
import './map_detail.css'
import { Link } from "react-router-dom";

export default function Map_detail(){
    return(
  <div className="MapDetail_container">
    <Link to='/map'><div><img className="MapDetail_backArrow" src="./icon/arrow.svg"/></div></Link>
    <span className="MapDetail_title">맵</span>
    <div className="MapDetail_title_line"></div>

    <div><img className="e300_47" src="./images/group1.png"/></div>
    {/* 경로 이미지 들어가는 곳 */}

    <span className="MapDetail_location">부산 수영구 광안동</span>
    
    <div className="MapDetail_Detail_line_s"></div>

    <div><img className="MapDetail_distance_icon" src="./icon/run.svg"/></div>
    <span className="MapDetail_distance_value">4.0km</span>
    
    <div><img className="MapDetail_time_icon" src="./icon/clock.svg"/></div>
    <span className="MapDetail_time_value">1h 0m</span>
    
    <div><img className="MapDetail_difficulty_icon" src="./icon/round-star.svg"/></div>
    <span className="MapDetail_difficulty_value">중</span>

    <div className="MapDetail_Detail_line_e"></div>

    <span className="mapDetail_button">경로 따라가기</span>
  </div>

    )
}