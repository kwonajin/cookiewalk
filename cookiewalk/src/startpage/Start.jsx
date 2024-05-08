import React, { useState, useEffect, useRef} from 'react';
import './Start.css'
import {Container as MapDiv, NaverMap, Marker, useNavermaps} from 'react-naver-maps'
import { Link ,useLocation, useNavigate} from "react-router-dom";

function MyMap({path ,center}){

    const navermaps = useNavermaps(); //네이버 지도API 객체 가져오기
    return(
    //기본값 또는 현재위치로 중심좌표 설정
    <NaverMap defaultCenter={center ? new navermaps.LatLng(center.lat, center.lng): new  navermaps.LatLng((37.3595704, 127.105399))}  defaultZoom={15}>
        {center &&(<Marker defaultPosition={new navermaps.LatLng(center.lat , center.lng)}/>)}
    </NaverMap>
    )
}

export default function Start() {
    const location = useLocation();
    console.log(location.state)

    // expanded_content의 상태를 관리하는 state
    const [isExpanded, setIsExpanded] = useState(true);

    const [currentPosition, setCurrentPosition] =useState(location.state.currentPosition)
    const [tracking, setTracking]=useState(false);
    const watchIdRef = useRef(null);

    // 경로 추적 시작
    const startTracking = () =>{
        if(navigator.geolocation){
            setTracking(true);
            watchIdRef.current=navigator.geolocation.watchPosition(
                (position)=>{
                    const {latitude,longitude} = position.coords;
                    setCurrentPosition({lat:latitude, lng:longitude});
                },                
                (error) => {
                    console.error('위치추적 실패', error);
                },
                {
                    enableHighAccuracy:true,
                    timeout:10000,
                    maximumAge:0
                }
            );
        }else{
            console.error('브라우저에서 지리적 위치 API 지원하지 않음')
        }
    }




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
            {/* <img className="e118_443" src="./images/image 229_4174.png" alt="Icon 2" /> */}

            <MapDiv className='MapStyle_start'><MyMap path={[]} center={currentPosition}/></MapDiv>
            {/* <MapDiv style={{width: '100%', height: '600px'}}><MyMapStart/></MapDiv> */}

            
            {/* 아이콘3과 expanded_content의 위치와 표시 방식을 변경합니다. */}
            <div className={`expanded_content ${isExpanded ? 'expanded' : 'collapsed'}`}>
            <img className={`icon3 ${isExpanded ? 'icon3-expanded' : 'icon3-collapsed'}`} src={icon3Path} alt="Icon 3" onClick={toggleExpand} />

            {isExpanded && (
            <>
                <div className="start_label_distance">Km</div>
                <div className="start_value_distance">0.00</div>
                <div className="start_label_time">시간</div>
                <div className="start_value_time">00:00:00</div>

                <div className="pause_button">
                    <div className="button_circle"></div>
                    <div className="button_bar1"></div>
                    <div className="button_bar2"></div>
                </div>
            </>
        )}
        </div>

    </div>
    );
}
