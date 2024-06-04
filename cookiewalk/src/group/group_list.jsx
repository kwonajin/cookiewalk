import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

export default function Group_List(){
    return(
        <div className='GroupList'>
            <img className="group_img" src="./images/group1.png" alt="" />
            <div className="person_box"></div>
            <div className="person"><div><img className="person_icon" src="./icon/person.svg" alt="" /></div></div>
            <div className="current_people">4</div>
            <div className="g_division">/</div>
            <div className="total_people">5</div>
            <div className="dday_box"></div>
            <div className="dday">D - 14</div>
            <div className="group_name">같이 그리실 분??</div>
            <div className="place"><img className='place_icon' src="./icon/place.svg" alt="" /></div>
            <div className="place_name">부산 남구 대연동</div>
            <div className="distance"><img className='distance_icon' src="./icon/run.svg" alt="" /></div>
            <div className="distance_num">2.5km</div>
        </div>
    )
}