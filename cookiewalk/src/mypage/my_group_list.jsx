import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";

export default function MyGroup_List(){
    return(
        <div className="mg_group1">
            <img className="mg_group1_img" src="./images/group1.png" alt="" />
            <div className="mg_person_box"></div>
            <div className="mg_person"><img className="mg_person_icon" src="./icon/person.svg" alt="" /></div>
            <span className="mg_person_current">4</span>
            <span className="mg_slash">/</span>
            <span className="mg_person_total">5</span>
            <div className="mg_dday_box"></div>
            <span className="mg_dday">D - 14</span>
            <span className="mg_group1_name">자전거 그리실 분</span>
            <div className="mg_place"><img className='mg_place_icon' src="./icon/place.svg" alt="" /></div>
            <span className="mg_place_text">부산 남구 대연동</span>
            <div className="mg_distance"><img className="mg_distance_icon" src="./icon/running.svg" alt="" /></div>
            <span className="mg_distance_text">2.5km</span>
        </div>
    )
}