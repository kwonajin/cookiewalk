import React, { useState } from 'react';
import './map_search.css'
import { Link } from "react-router-dom";

export default function MapSearch(){
    // expanded_content의 상태를 관리하는 state
    const [isExpanded, setIsExpanded] = useState(true);
    const [selectedLocation, setSelectedLocation] = useState('내 위치'); // 위치 드롭다운 선택 상태
    const [selectedDistance, setSelectedDistance] = useState('거리순'); // 거리 드롭다운 선택 상태
    const [selectedDifficulty, setSelectedDifficulty] = useState('난이도순'); // 난이도 드롭다운 선택 상태

    // icon3 클릭 시 실행되는 함수
    const toggleExpand = () => {
    setIsExpanded(!isExpanded); // 상태 반전
    };

    // 위치 드롭다운 선택 핸들러
    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };
    // 거리 드롭다운 선택 핸들러
    const handleDistanceChange = (event) => {
        setSelectedDistance(event.target.value);
    };
    // 난이도 드롭다운 선택 핸들러
    const handleDifficultyChange = (event) => {
        setSelectedDifficulty(event.target.value);
    };

  //아이콘 경로 조건부 설정
    const icon3Path = isExpanded ? "./icon/mdi--arrow-down-drop.svg" : "./icon/mdi--arrow-drop-up.svg";

    return(
    <div className="map_search_container">
        {/* 지도 */}
        <img className='e118_252' src="./images/image 229_4174.png" alt="" />

        {/* search bar */}
        <div className="map_searchbar_box"></div>
        <div><img  className="map_search_icon" src="./icon/search.svg" alt="" /></div>
        
        {/* gps */}
        <div className="e118_259"></div>
        <div className="e118_260"></div>

        {/* 아이콘3과 expanded_content의 위치와 표시 방식을 변경합니다. */}
        <div className={`expanded_content ${isExpanded ? 'map_expanded' : 'map_collapsed'}`}>
        <img className={`map_icon3 ${isExpanded ? 'map_icon3-expanded' : 'map_icon3-collapsed'}`} src={icon3Path} alt="Icon 3" onClick={toggleExpand} />

        {/* 내용이 표시되는 부분 */}
        {isExpanded && (
            <>

            {/* 위치 드롭다운 메뉴 구현 */}
            <select className='map_location_dropdown' value={selectedLocation} onChange={handleLocationChange}>
                <option value="최초값_위치">내 위치</option>
                <option value="경기">경기</option>
                <option value="대구">대구</option>
                <option value="부산">부산</option>
                <option value="서울">서울</option>
            </select>

            {/* 거리 드롭다운 메뉴 구현 */}
            <select className='map_distance_dropdown' value={selectedDistance} onChange={handleDistanceChange}>
                <option value="최초값_거리">거리순</option>
                <option value="단거리">5Km 이하</option>
                <option value="중단거리">10Km 이하</option>
                <option value="중거리">15Km 이하</option>
                <option value="장거리">15Km 이상</option>
            </select>

            {/* 난이도 드롭다운 메뉴 구현 */}
            <select className='map_difficulty_dropdown' value={selectedDifficulty} onChange={handleDifficultyChange}>
                <option value="최초값_난이도">난이도순</option>
                <option value="상">상</option>
                <option value="중">중</option>
                <option value="하">하</option>
            </select>

            <div className="e118_274"></div>
            
            {/* 맵_리스트 1 */}
            <div className="map_list1">
                <div className="map_list1_box"></div>
                <div className="map_list1_location">부산 수영구 광안동</div>
                <div><img className="map_list1_picture" src="./images/group1.png" alt="" /></div>

                <div><img className='map_list1_distance_icon' src="./icon/run.svg"/></div>
                <div className="map_list1_distance_value">4.0km</div>

                <div><img className='map_list1_time_icon' src="./icon/clock.svg"/></div>
                <div className="map_list1_time_value">1h 0m</div>
                
                <div><img className='map_list1_rate_icon' src="./icon/sand-timer.svg"/></div>
                <div className="map_list1_rate_value">중</div>
            </div>
            </>
        )}
        </div>

        <div className="navbar">
        <Link to="/home"><div className="home"><img className="map_home_icon" src="./icon/home.svg" alt="" /></div></Link>
        <Link to="/map"><div className="map"><img className="map_map_icon" src="./icon/map.svg" alt="" /></div></Link>
        <Link to="/BeforeStart"><div className="run"><img className="map_run_icon" src="./icon/record.svg" alt="" /></div></Link>
        <Link to="/group"><div className="group"><img className="map_group_icon" src="./icon/group.svg" alt="" /></div></Link>
        <Link to="/mypage"><div className="my"><img className="map_my_icon" src="./icon/my.svg" alt="" /></div></Link>
        </div>
    </div>  
);
}