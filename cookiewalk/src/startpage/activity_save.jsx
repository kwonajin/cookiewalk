import React, { useEffect, useState } from 'react';
import './activity_save.css'
import { Link, useNavigate } from "react-router-dom";

export default function Activity_save() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const navigate = useNavigate();
    // 경로 삭제 함수
    const removeActivity = () => {
        const isConfirmed = window.confirm("경로를 저장하지 않고 삭제하시겠습니까?");
       // 사용자가 '확인'을 클릭한 경우
        if (isConfirmed) {
        navigate('/home');
    }
    };
    return(
        <div className="activity_save_container">
            <span className="activity_save_title">활동저장</span>
            <button className="activity_save_remove_button" onClick={removeActivity}>삭제</button>

            <div><img className="e298_23" src="./images/image 229_4174.png"/></div>
            {/* 저장경로 이미지 뜨는 곳 */}

            <span className="activity_save_record_title">기록</span>
            <span className="activity_save_distance_label">활동 거리</span>
            <span className="activity_save_distance_value">0.00km</span>
            <div className="activiity_save_label_divide_line"></div>
            <span className="activity_save_time_label">활동 시간</span>
            <span className="activity_save_time_value">0h 0m</span>
            <div className="activity_save_line1"></div>
            <span className="activity_save_route_title">제목</span>
            <input type="text" className='activity_save_route_title_contents' placeholder={"오늘은 어떤 그림을 그리셨나요?"}/>
            <div className="activity_save_line2"></div>
            <span className="acitivity_save_location_label">위치</span>
            <div><img className="acitivity_save_location_icon" src="./icon/map_pin_icon.svg" alt="" /></div>
            <span className="acitivity_save_location">부산 남구 대연동</span>

            <button className="Unfinished_SaveRoute_button">미완성 경로 저장하기</button>
            <button className="Finished_SaveRoute_button">완성한 그림 저장하기</button>
        </div>

    )
}