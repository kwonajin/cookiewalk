import React, { useEffect, useState } from 'react';
import './map_search.css'
import { Link } from "react-router-dom";
import MapList from './map_List/map_list';

export default function MapSearch() {
    const [selectedLocation, setSelectedLocation] = useState('내 위치');
    const [selectedDistance, setSelectedDistance] = useState('거리순');
    const [selectedDifficulty, setSelectedDifficulty] = useState('난이도순');
    const [minHeight, setMinHeight] = useState(800); // 여기로 상태를 옮겼습니다.
    const [mapLists, setMapLists] = useState([{}, {}, {}, {}, {},{}, {}, {}, {}, {}]); // MapList 컴포넌트를 나타내는 객체들의 배열
    // 위치, 거리, 난이도 드롭다운 선택 핸들러
    const handleLocationChange = (event) => {
        setSelectedLocation(event.target.value);
    };
    const handleDistanceChange = (event) => {
        setSelectedDistance(event.target.value);
    };
    const handleDifficultyChange = (event) => {
        setSelectedDifficulty(event.target.value);
    };

    const handleFocus = (event) => {
        event.target.placeholder = '';
    };
    
    const handleBlur = (event, placeholderText) => {
        event.target.placeholder = placeholderText;
    };


    useEffect(() => {
        // MapList 컴포넌트의 개수를 기반으로 min-height를 조정합니다.
        const newMinHeight = 800 + (mapLists.length * 150); // 각 MapList 당 150px를 추가합니다.
        setMinHeight(newMinHeight);
    }, [mapLists.length]); // mapLists 배열의 길이가 변경될 때 useEffect를 재실행합니다.

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return(
    <div className="map_search_container">
        <span className="map_title">맵</span>
        <div className="e118_274"></div>
        
        <input
            className="map_searchbar"
            type="text"
            placeholder="참여할 지역을 찾아보세요!"
            onFocus={handleFocus}
            onBlur={(event) => handleBlur(event, '참여할 지역을 찾아보세요!')}
        />
        <div className="map_search"><img className='map_search_icon' src="./icon/search.svg" alt="" /></div>
        

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

        
            <div className="map-list-container" style={{ minHeight: `${minHeight}px` }}>
                {mapLists.map((_, index) => (
                    <MapList key={index}></MapList>
                ))}
            </div>
            
            <div className="fixed-button">
                <img className='fixed_button_icon' src="/icon/write.svg"/>
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