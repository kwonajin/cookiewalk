import React, { useEffect, useState } from 'react';
import './activity_save.css'
import { Link } from "react-router-dom";

export default function Activity_save() {
    return(
        <div className="activity_save_container">
            <span className="e289_15">활동저장</span>
            <span className="e289_20">삭제</span>

            <div><img className="e298_23" src="./images/image 229_4174.png"/></div>
            {/* 저장경로 이미지 뜨는 곳 */}

            <span className="e298_25">기록</span>
            <span className="e298_30">활동 거리</span>
            <span className="e298_27">0.00km</span>
            <div className="e298_33"></div>
            <span className="e298_31">활동 시간</span>
            <span className="e298_28">0h 0m</span>
            <div className="e298_34"></div>
            <span className="e298_37">제목</span>
            <span className="e289_22">오늘은 어떤 그림을 그리셨나요?</span>
            <div className="e298_38"></div>
            <span className="e299_44">위치</span>
            <div><img className="e299_42" src="./icon/map_pin_icon.svg" alt="" /></div>
            <span className="e299_41">부산 남구 대연동</span>
            {/* <div className="e299_39"></div>
            <span className="e299_40">경로 저장하기</span> */}
            <button className="SaveRoute_button">경로 저장하기</button>
        </div>

    )
}