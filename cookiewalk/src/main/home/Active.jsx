import { Link } from "react-router-dom"
import { supabase } from "../../supabaseClient"
import React, { useEffect, useState } from 'react';
import { useToken } from "../../context/tokenContext";


export default function Active({distance ,time ,count}) {

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds /3600);
    const minutes = Math.floor((seconds % 3600) /60);
    const secs = seconds % 60;
    return `${String(hours).padStart(1,'0')}h ${String(minutes).padStart(2,'0')}m ${String(secs).padStart(2,'0')}s`;
  };

  return(
    <div className="active">
      <div className="my_active">나의 이번주 활동</div>
      <Link to="/mypage" ><div className="detail">자세히보기</div></Link>
      <div className="art">완성한 그림 수</div>
      <div className="art_num">{count}개</div>
      <div className="home_line1"></div>
      <div className="active_distance">활동 거리</div>
      <div className="active_distance_num">{distance}km</div>
      <div className="home_line2"></div>
      <div className="active_time">활동 시간</div>
      <div className="active_time_num">{time}</div>
    </div>
    )
    
}