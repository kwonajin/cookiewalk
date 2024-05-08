import React, { useState } from 'react';
import './pause.css'
import { Link } from "react-router-dom";

export default function pause(){
  
  // expanded_content의 상태를 관리하는 state
  const [isExpanded, setIsExpanded] = useState(true);

  // icon3 클릭 시 실행되는 함수
  const toggleExpand = () => {
    setIsExpanded(!isExpanded); // 상태 반전
  };

  //아이콘 경로 조건부 설정
  const icon3Path = isExpanded ? "./icon/mdi--arrow-down-drop.svg" : "./icon/mdi--arrow-drop-up.svg";

  return (
    <div className='pause-page'>
      <div className="pause-container">
        <Link to="/home"><div className="close-button">CLOSE</div></Link>
        <img className="icon1" src="./icon/setting.svg" alt="Icon 1" />
        <img className="icon2" src="./images/image 229_4174.png" alt="Icon 2" />
        
        {/* 아이콘3과 expanded_content의 위치와 표시 방식을 변경합니다. */}
        <div className={`expanded_content ${isExpanded ? 'expanded' : 'collapsed'}`}>
        <img className={`icon3 ${isExpanded ? 'icon3-expanded' : 'icon3-collapsed'}`} src={icon3Path} alt="Icon 3" onClick={toggleExpand} />

          {/* 내용이 표시되는 부분 */}
          {isExpanded && (
            <>
              <div className="label1">Km</div>
              <div className="value1">0.00</div>
              <div className="label2">시간</div>
              <div className="value2">00:00:00</div>

              <div className="button-container">
                <div className="button1">
                  <div className="button-label-end">종료</div>
                </div>
                <Link to='/Start' className='restart_link'>
                  <div className="button2">
                    <div className="button-label-restart">재시작</div>
                  </div>
                </Link>
              </div>
            </>
          )}
        </div>
        
      </div>
    </div>
  );
}

