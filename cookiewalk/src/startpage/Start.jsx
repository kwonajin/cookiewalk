import React, { useState } from 'react';
import './Start.css'
import { Link } from "react-router-dom";

export default function Start() {
    // expanded_content의 상태를 관리하는 state
    const [isExpanded, setIsExpanded] = useState(true);

    // icon3 클릭 시 실행되는 함수
    const toggleExpand = () => {
    setIsExpanded(!isExpanded); // 상태 반전
};

    //아이콘 경로 조건부 설정
    const icon3Path = isExpanded ? "./icon/mdi--arrow-down-drop.svg" : "./icon/mdi--arrow-drop-up.svg";
    
    return (
        <div className="Start_container">


            <div className="close-button">CLOSE</div>
            <div><img className='e118_456' src="./icon/setting.svg"/></div>

            {/* 지도 넣을 곳 */}
            <img className="e118_443" src="./images/image 229_4174.png" alt="Icon 2" />

            
            {/* 아이콘3과 expanded_content의 위치와 표시 방식을 변경합니다. */}
            <div className={`expanded_content ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <img className={`icon3 ${isExpanded ? 'icon3-expanded' : 'icon3-collapsed'}`} src={icon3Path} alt="Icon 3" onClick={toggleExpand} />

            {isExpanded && (
            <>
                <div className="start_label_distance">Km</div>
                <div className="start_value_distance">0.00</div>
                <div className="start_label_time">시간</div>
                <div className="start_value_time">00:00:00</div>


                <Link to='/Pause'>
                    <div className="pause_button">
                        <div className="button_circle"></div>
                        <div className="button_bar1"></div>
                        <div className="button_bar2"></div>
                    </div>
                </Link>
            </>
        )}
        </div>
    
    </div>
    );
}
