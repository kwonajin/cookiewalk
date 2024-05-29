import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';

export default function Saved_list(){
    return(
        <div className="saved_map_list1">
            <div className="saved_map_list1_box"></div>
            <div className="saved_map_list1_title">제목</div>
            {/* <MapDiv className='saved_map_list1_picture'><MyMap path={path} center={center}/></MapDiv> */}
            {/* <div><img className="saved_map_list1_picture" src={imageUrl} alt="Map" /></div> */}
            <div>
                <img className="saved_ml_delete" src="/icon/trash.svg" alt="Delete Icon" />
            </div>
            
            {/* 여기에 위치 정보 넣는란도 추가 희망 */}
            <div>
                <img className="saved_map_list1_distance_icon" src="/icon/run.svg" alt="Distance Icon" />
            </div>
            <div className="saved_map_list1_distance_value">km</div>
            
            <div>
                <img className="saved_map_list1_time_icon" src="/icon/place.svg" alt="Time Icon" />
            </div>
            <div className="saved_map_list1_time_value">위치</div>
            
            <div>
                <img className="saved_map_list1_rate_icon" src="/icon/round-star.svg" alt="Rate Icon" />
            </div>
            <div className="saved_map_list1_rate_value">난이도</div>
        </div>
    )
}