import React, { useState, useEffect, useRef} from 'react';
import './Start.css'
import {Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline} from 'react-naver-maps'
import { Link ,useLocation, useNavigate} from "react-router-dom";

function MyMap({path ,center}){

    const navermaps = useNavermaps(); //네이버 지도API 객체 가져오기
    return(
    //기본값 또는 현재위치로 중심좌표 설정
    <NaverMap 
        defaultCenter={center ? new navermaps.LatLng(center.lat, center.lng): new  navermaps.LatLng((37.3595704, 127.105399))}  defaultZoom={15}
        center={center ? new navermaps.LatLng(center.lat, center.lng) : new navermaps.LatLng(37.3595704, 127.105399)}>
        {center &&(
        <Marker position={new navermaps.LatLng(center.lat , center.lng)}/>)}
        {path.length > 1 && (
            <Polyline
            path={path.map(p => new navermaps.LatLng(p.lat,p.lng))}
            strokeColor='blue' // 선색깔
            strokeWeight={2} //선두께
            strokeOpacity={0.8} //투명도
            strokeStyle="solid"
            />
        )}
    </NaverMap>
    )
}

export default function Start() {
    const location = useLocation();
    // console.log(location.state)

    // expanded_content의 상태를 관리하는 state
    const [isExpanded, setIsExpanded] = useState(true);
    // 'pause' 버튼의 상태를 관리하는 state 추가
    const [isPaused, setIsPaused] = useState(false);

    const [currentPosition, setCurrentPosition] =useState(location.state.currentPosition)
    const [tracking, setTracking]=useState(false);
    const watchIdRef = useRef(null);
    const [path, setPath]= useState([currentPosition])

    const [totalDistance, setTotalDistance]=useState(0);  //총 걸은 거리
    const [time, setTime]=useState(0);  // 총 시간(초)
    const timerRef = useRef(null);


    // 'pause' 버튼 클릭 시 실행되는 함수
    const togglePause = () => {
        setIsPaused(!isPaused); // 상태 반전
        stopTracking(); //위치추적 중지
    };
    // 재시작 버튼 클릭 시 실행되는 함수
    const restart = () => {
        setIsPaused(false); // 일시정지 상태를 해제하여 일시정지 버튼을 다시 보이게 함
    // 여기에 위치 추적을 재시작하는 로직을 추가할 수 있습니다!
        startTracking() //위치추적 재시작
    };

    // 경로 추적 시작
    const startTracking = () =>{
        if(navigator.geolocation){
            setTracking(true);
            watchIdRef.current=navigator.geolocation.watchPosition(
                (position)=>{
                    const {latitude,longitude, speed} = position.coords;
                    const newPosition = {lat : latitude , lng: longitude};
                    setCurrentPosition({lat:latitude, lng:longitude});
                    setPath((prevPath)=>{
                        const newPath = [...prevPath, newPosition];
                        const lastPosition = prevPath[prevPath.length -1];

                        if(lastPosition){
                            const distance = calculateDistance(lastPosition, newPosition);
                            setTotalDistance((prevDistance) => prevDistance + distance)
                        }
                    return newPath;
                    })
                },                
                (error) => {
                    console.error('위치추적 실패', error);
                },
                {
                    enableHighAccuracy:true,
                    timeout:20000,
                }
            );
        }else{
            console.error('브라우저에서 지리적 위치 API 지원하지 않음')
        }
    }

    //경로 추적 중지
    const stopTracking = () =>{
        if(watchIdRef.current !== null){
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setTracking(false);
        // stopTimer();
    }
    useEffect(()=>{
        console.log(currentPosition)
    },[currentPosition])


    //연습 함수
    const example = () =>{
        // setTimeout(function(){
        //     const newPosition = {lat :35.132757 , lng: 129.106966};
        //     setCurrentPosition(newPosition);
        //     setPath((prevPath)=>{
        //         const newPath = [...prevPath, newPosition];
        //         const lastPosition = prevPath[prevPath.length -1];

        //         if(lastPosition){
        //             const distance = calculateDistance(lastPosition, newPosition);
        //             setTotalDistance((prevDistance) => prevDistance + distance)
        //         }
        //         return newPath
        //     });
        // },2000)
        // setTimeout(function(){
        //     const newPosition = {lat:35.142465, lng:129.107140};
        //     setCurrentPosition(newPosition);
        //     setPath((prevPath)=>{
        //         const newPath = [...prevPath, newPosition];
        //         const lastPosition = prevPath[prevPath.length -1];

        //         if(lastPosition){
        //             const distance = calculateDistance(lastPosition, newPosition);
        //             setTotalDistance((prevDistance) => prevDistance + distance)
        //         }
        //         return newPath
        //     });
        // },4000)
        // setTimeout(function(){
        //     const newPosition = {lat:35.131721, lng:129.106824};
        //     setCurrentPosition(newPosition);
        //     setPath((prevPath)=>{
        //         const newPath = [...prevPath, newPosition];
        //         const lastPosition = prevPath[prevPath.length -1];

        //         if(lastPosition){
        //             const distance = calculateDistance(lastPosition, newPosition);
        //             setTotalDistance((prevDistance) => prevDistance + distance)
        //         }
        //         return newPath
        //     });
        // },6000)
        // setTimeout(function(){
        //     const newPosition = {lat:35.131706, lng:129.106410};
        //     setCurrentPosition(newPosition);
        //     setPath((prevPath)=>{
        //         const newPath = [...prevPath, newPosition];
        //         const lastPosition = prevPath[prevPath.length -1];

        //         if(lastPosition){
        //             const distance = calculateDistance(lastPosition, newPosition);
        //             setTotalDistance((prevDistance) => prevDistance + distance)
        //         }
        //         return newPath
        //     });
        // },8000)
        const coord1 = { lat:35.131721, lng:129.106824}; // New York City
        const coord2 = { lat:35.131706, lng:129.106410 }; // Los Angeles 
        const distance = calculateDistance(coord1, coord2);
        console.log(distance)
    }

    useEffect(()=>{
        if (isPaused) {
            stopTimer();
            stopTracking();
        } else {
            startTimer();
            startTracking();
            // example()
        }
        console.log(isPaused)
    },[isPaused])

    const startTimer = () => {
        if (timerRef.current === null) {
            timerRef.current = setInterval(()=>{
                setTime((prevTime)=>(prevTime+1))
            }, 1000)
    }   
    }
    const stopTimer = () => {
        console.log('시간중지')
        clearInterval(timerRef.current)
        timerRef.current = null;
    }
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds /3600);
        const minutes = Math.floor((seconds % 3600) /60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2,'0')}:${String(minutes).padStart(2,'0')}: ${String(secs).padStart(2,'0')}`;
    };

    //거리 계산 함수 Haversine 공식으로 두 좌표 간 거리 계산
    const calculateDistance = (coord1, coord2) =>{
        const toRad = (x) => (x * Math.PI / 180 );
        const R = 6371; //지구 반지름 (Km)
        const dLat = toRad(coord2.lat - coord1.lat);
        const dLng = toRad(coord2.lng - coord1.lng);
        const a= Math.sin(dLat / 2)*Math.sin(dLat / 2) + Math.cos(toRad(coord1.lat))* Math.cos(toRad(coord2.lat))*Math.sin(dLng / 2)*Math.sin(dLng / 2);
        const c = 2*Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return R * c; // Km단위 거리 반환
    };


    // icon3 클릭 시 실행되는 함수
    const toggleExpand = () => {
    setIsExpanded(!isExpanded); // 상태 반전
    };
    //아이콘 경로 조건부 설정
    const icon3Path = isExpanded ? "./icon/mdi--arrow-down-drop.svg" : "./icon/mdi--arrow-drop-up.svg";
    


    return (
        <div className="Start_container">
            {/* 'isPaused' 상태에 따라 'close' 버튼을 조건부 렌더링 */}
            {isPaused && <div className="close-button">CLOSE</div>}

            {/* 지도 넣을 곳 */}
            {/* <img className="e118_443" src="./images/image 229_4174.png" alt="Icon 2" /> */}

            <MapDiv className='e118_443'><MyMap path={path} center={currentPosition}/></MapDiv>
            {/* <MapDiv style={{width: '100%', height: '600px'}}><MyMapStart/></MapDiv> */}

            
            {/* 아이콘3과 expanded_content의 위치와 표시 방식을 변경합니다. */}
            <div className={`start_expanded_content ${isExpanded ? 's_expanded' : 's_collapsed'}`}>
            <img className={`s_icon3 ${isExpanded ? 's_icon3-expanded' : 's_icon3-collapsed'}`} src={icon3Path} alt="Icon 3" onClick={toggleExpand} />

            {isExpanded && (
            <>
                <div className="start_label_distance">Km</div>
                <div className="start_value_distance">{totalDistance.toFixed(2)}</div>
                <div className="start_label_time">시간</div>
                <div className="start_value_time">{formatTime(time)}</div>

            {/* 조건부 렌더링을 사용하여  'pause' 버튼 또는 '종료'와 '재시작' 버튼을 렌더링 */}
            {!isPaused ? (
                <div className="pause_button" onClick={togglePause}>
                    <div className="button_circle"></div>
                    <div className="button_bar1"></div>
                    <div className="button_bar2"></div>
                </div>
            ) : (
                <div className="button-container">
                    <Link className="start_button1" to='/Activity_Save'>
                        <div>
                            <div className="button-label-end">종료</div>
                        </div>
                    </Link>
                    <div className="start_button2" onClick={restart}>
                        <div className="button-label-restart">재시작</div>
                    </div>
                </div>
            )}
            </>
        )}
        </div>

    </div>
    );
}
