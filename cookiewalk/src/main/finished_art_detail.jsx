import React from 'react';
import './finished_art_detail.css';
import { Link } from "react-router-dom";

export default function FinishedArtDetail() {

  return (
    <div className="fad_container">
      <Link to='/finished_art'><div><img className="fad_backArrow" src="./icon/arrow.svg" alt="Back Arrow" /></div></Link>
      <span className="fad_title">완성한 그림</span>
      <div className="fad_title_line"></div>


      <span className="fad_location">title</span>

      <div className="fad_Detail_line_s"></div>
      <div className='fad_map_img'></div>

      {/* 여기에 위치 정보 넣는란도 추가 희망 */}
      <div><img className="fad_distance_icon" src="./icon/run.svg" alt="Distance Icon" /></div>
      <span className="fad_distance_value">distance</span>

      <div><img className="fad_location_icon" src="./icon/place.svg" alt="Location Icon" /></div>
      <span className="fad_location_value">location</span>

      <div><img className="fad_difficulty_icon" src="./icon/round-star.svg" alt="Difficulty Icon" /></div>
      <span className="fad_difficulty_value">level</span>

      <div><img className="fad_time_icon" src="./icon/clock.svg" alt="Difficulty Icon" /></div>
      <span className="fad_time_value">time</span>

      <div className="fad_Detail_line_e"></div>

      <Link to='/write_map'><span className="fad_button">게시물 작성하기</span></Link>
    </div>
  );
}
