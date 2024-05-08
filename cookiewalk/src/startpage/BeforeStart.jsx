import react, {useEffect ,useState, useRef} from 'react';
import {Container as MapDiv, NaverMap, Marker, useNavermaps} from 'react-naver-maps'
import './BeforeStart.css'
import { Link, useNavigate } from "react-router-dom";

function MyMap({center}){

    const navermaps = useNavermaps(); //네이버 지도API 객체 가져오기
    return(
    //기본값 또는 현재위치로 중심좌표 설정
    <NaverMap defaultCenter={center ? new navermaps.LatLng(center.lat, center.lng): new  navermaps.LatLng((37.3595704, 127.105399))}  defaultZoom={15}>
        {center &&(<Marker defaultPosition={new navermaps.LatLng(center.lat , center.lng)}/>)}
    </NaverMap>
    )
}

export default function BeforeStart(){
    
    const  navigate = useNavigate();

    //현재 위치 저장 state
    const [currentPosition, setCurrentPosition]=useState(null);
    const [loading, setLoading]=useState(true); // 로딩 상태 추가

    // const mapRef = useRef(null);

    //패시브 이벤트 리스너 추가 함수
    // const addPassiveEventListener = (type, element) =>{
    //     element.addEventListener(type, function() {}, {passive:true});
    // }

    const fetchCurrentPosition=()=>{
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position)=>{
                    const {latitude, longitude} = position.coords;
                    setCurrentPosition({lat:latitude, lng:longitude});
                    setLoading(false)
                },
                (error)=>{
                    console.error('위치정보 가져오기 실패:',error)
                    setCurrentPosition({ lat: 37.5665, lng: 126.9780 });
                    setLoading(false);
                },
                {
                enableHighAccuracy: true, //높은 정확도로 위치정보 가져오기
                timeout:10000,            //위치가져오기 제한시간 설정
                maximumAge:0              //캐시된 위치 정보 사용 x
                }
            );
        }else{
            console.error('브라우저에서 지리적 위치 API를 지원하지 않을 경우',error)
            setCurrentPosition({lat: 37.5665, lng: 126.9780})
            setLoading(false);
        }
    }
    
    useEffect(() => {
        window.scrollTo(0, 0);

        // if(mapRef.current){
        //     addPassiveEventListener('mousewheel',mapRef.current);
        //     addPassiveEventListener('touchstart',mapRef.current);
        //     addPassiveEventListener('touchmove',mapRef.current);
        // }
        fetchCurrentPosition(); // 현재 위치 가져오기
    }, []);

    if(loading){
        return (
            <div className="BeforeStart_container">
                <div>현재 위치 정보를 가져오는 중입니다....</div>
            </div>
        )
    }

    function startPage(e){
        e.preventDefault();
        navigate('/start', {state: {currentPosition}})
    }

    return(
        <div className="BeforeStart_container">
            <div><img className='e118_437' src="./icon/arrow.svg"/></div>
            <div><img className='e118_439' src="./icon/setting.svg"/></div>
            
            <MapDiv className='MapStyle'><MyMap center={currentPosition} /></MapDiv>
            {/* 지도 넣는 곳 */}
            {/* <div><img className="e118_427" src="./images/image 229_4174.png" alt="map" /></div> */}

            <Link to="/map">
            <div><img className="route" src="./icon/route.svg"/></div>
            <span className="e118_432">루트</span>
            </Link>

            {/* 중간막대 */}
            <div className="e118_431"></div>
            
            <Link to="/Unfinished_route">
                <div><img className="uncomplted_route" src="./images/puzzle.png"/></div>
                <span className="e118_434">미완성 경로</span>
            </Link>
            
            <div className='startpage_link' onClick={startPage}>
                <span className="start_button_label">시작</span>
                <div><img className='start_logo' src="./images/cookie-run-white.png"/></div>
                <div className="start_button_circle"></div>
            </div>
        </div>
    );
}