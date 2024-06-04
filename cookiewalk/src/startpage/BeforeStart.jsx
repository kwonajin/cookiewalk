import react, {useEffect ,useState, useRef} from 'react';
import {Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline} from 'react-naver-maps'
import './BeforeStart.css'
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from '../supabaseClient';

function MyMap({path=[],center, drawPath=[] }){
    console.log(drawPath)
    const navermaps = useNavermaps(); //네이버 지도API 객체 가져오기
    const markerIcon = {
        content: '<div><img src="/images/logo.png" alt="icon" class="icon_size"></div>',
        size: new navermaps.Size(24,24),
        anchor: new navermaps.Point(12,12)
    }
    return(
    //기본값 또는 현재위치로 중심좌표 설정
    <NaverMap defaultCenter={center ? new navermaps.LatLng(center.latitude, center.longitude): new  navermaps.LatLng((37.3595704, 127.105399))}  defaultZoom={15}>
        {center &&(<Marker icon={markerIcon} defaultPosition={new navermaps.LatLng(center.latitude , center.longitude)}/>)}
        {path.length >1 &&(
            <Polyline
                path={path.map(p => new navermaps.LatLng(p.latitude,p.longitude))}
                strokeColor='#2E9AFE' // 선색깔
                strokeWeight={8} //선두께
                strokeOpacity={0.8} //투명도
                strokeStyle="solid"
            />
        )}
        {drawPath.length > 1 && drawPath.map((p, index) => (
                <Marker
                    key={index}
                    position={new navermaps.LatLng(p.latitude, p.longitude)}
                    title={`Marker ${index + 1}`}
                    clickable={true}
                    icon={{
                        content: `<div style="background: #B45F04; width: 10px; height: 10px; border-radius: 50%;"></div>`,
                        size: new navermaps.Size(10, 10),
                        anchor: new navermaps.Point(5, 5)
                    }}
                />
            ))}
    </NaverMap>
    )
}

export default function BeforeStart(){
    
    const [path,setPath]=useState([])
    const [drawId,setDrawId]=useState('')
    const [drawPath, setDrawPath]=useState([])
    const [groupDraw, setGroupDraw]=useState(false)
    const [regionNumber, setRegionNumber]=useState(0)
    const mapCollection = useLocation();
    console.log(mapCollection)
    useEffect(()=>{
        if(mapCollection.state !== null){
            // console.log(mapCollection.state.drawID)
            const maproute=mapCollection.state.path
            const drawID=mapCollection.state.drawId
            const drawPath=mapCollection.state.drawPath
            if(mapCollection.state.groupDraw){
                setGroupDraw(mapCollection.state.groupDraw)
                setRegionNumber(mapCollection.state.groupDraw)
            }
            console.log(groupDraw)
            setPath(maproute)
            setDrawId(drawID)
            setDrawPath(drawPath)
        }
    },[path])
    const  navigate = useNavigate();

    //현재 위치 저장 state
    const [currentPosition, setCurrentPosition]=useState(null);
    const [loading, setLoading]=useState(true); // 로딩 상태 추가

    // const mapRef = useRef(null);
    const fetchCurrentPosition=()=>{
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position)=>{
                    const {latitude, longitude} = position.coords;
                    // console.log(position.coords)
                    setCurrentPosition({latitude:latitude, longitude:longitude});
                    // console.log(currentPosition)
                    setLoading(false)
                },
                (error)=>{
                    console.error('위치정보 가져오기 실패:',error)
                    setCurrentPosition({ latitude: 37.5665, longitude: 126.9780 });
                    setLoading(false);
                },
                {
                enableHighAccuracy: true, //높은 정확도로 위치정보 가져오기
                timeout:20000,            //위치가져오기 제한시간 설정
                maximumAge:0              //캐시된 위치 정보 사용 x
                }
            );
        }else{
            console.error('브라우저에서 지리적 위치 API를 지원하지 않을 경우',error)
            setCurrentPosition({latitude: 37.5665, longitude: 126.9780})
            setLoading(false);
        }
    }
    
    useEffect(() => {
        window.scrollTo(0, 0);
        fetchCurrentPosition(); // 현재 위치 가져오기
    }, []);

    if(loading){
        return (
            <div className="BeforeStart_container">
                <img className='bs_loadimg' src="./images/logo.png" alt="" />
                <div className='bs_loadmessage'>현재 위치 정보를 가져오는 중입니다....</div>
            </div>
        )
    }

    function startPage(e){
        e.preventDefault();
        const startTime = new Date()
        navigate('/start', {state: {currentPosition:currentPosition, startTime: startTime, drawPath:drawPath,path:path, drawId: drawId, groupDraw: groupDraw, regionNumber:regionNumber}})
    }

    return(
        <div className="BeforeStart_container">
            <Link to='/home'><div><img className='Before_start_backarrow' src="./icon/arrow.svg"/></div></Link>
            
            <MapDiv className='MapStyle'><MyMap path={path} center={currentPosition} drawPath={drawPath}/></MapDiv>
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