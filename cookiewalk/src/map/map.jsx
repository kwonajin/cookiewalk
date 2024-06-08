import React, { useEffect, useState } from 'react';
import './map_search.css'
import { Link, useNavigate,useLocation } from "react-router-dom";
import MapList from './map_List/map_list';
import { supabase } from '../supabaseClient';
import axios from 'axios';
import { calculateBounds } from '../utils/calculateBounds';


export default function MapSearch() {
    const  navigate = useNavigate();
    const searchCon = useLocation();
    const [selectedLocation, setSelectedLocation] = useState('');
    const [selectedDistance, setSelectedDistance] = useState(0);
    const [selectedDifficulty, setSelectedDifficulty] = useState('');
    const [searchInput, setSearchInput]= useState('');
    const [minHeight, setMinHeight] = useState(800); // 여기로 상태를 옮겼습니다.
    const [mapLists, setMapLists] = useState([]); // MapList 컴포넌트를 나타내는 객체들의 배열
    const [path,setpath]= useState([])
    const [center,setcenter]=useState([])
    let pathArray = [];
    let centerArray=[];
    
    //현재 위치 좌표 
    const [currentPosition, setCurrentPosition]=useState(null);
    const [loading, setLoading]=useState(true); // 로딩 상태 추가
    const [address, setAddress]= useState('')

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
    const handleSearchInputChange = (event)=>{
        setSearchInput(event.target.value)
    }

    const handleFocus = (event) => {
        event.target.placeholder = '';
    };
    
    const handleBlur = (event, placeholderText) => {
        event.target.placeholder = placeholderText;
    };

    //현재 위치 불러오는 함수
    const fetchCurrentPosition=()=>{
        if (navigator.geolocation){
            navigator.geolocation.getCurrentPosition(
                (position)=>{
                    const {latitude, longitude} = position.coords;
                    // console.log(position.coords)
                    setCurrentPosition({lat:latitude, lng:longitude});
                    // console.log(currentPosition)
                },
                (error)=>{
                    console.error('위치정보 가져오기 실패:',error)
                    setCurrentPosition({ lat: 37.5665, lng: 126.9780 });
                    setLoading(false)
                },
                {
                enableHighAccuracy: true, //높은 정확도로 위치정보 가져오기
                timeout:20000,            //위치가져오기 제한시간 설정
                maximumAge:0              //캐시된 위치 정보 사용 x
                }
            );
        }else{
            console.error('브라우저에서 지리적 위치 API를 지원하지 않을 경우',error)
            setCurrentPosition({lat: 37.5665, lng: 126.9780})
            setLoading(false);
        }
    }
    useEffect(()=>{
        if(!currentPosition){
            fetchCurrentPosition()
        }
        if(currentPosition){
            getReverseGeocode(currentPosition.lat, currentPosition.lng)
        }
    }, [currentPosition])
    async function getReverseGeocode(latitude, longitude){
        const url =`https://blonde-bobolink-smartbusan-a2d9f8e5.koyeb.app/reverse_geocoding?latitude=${latitude}&longitude=${longitude}`;
        try{
            const response = await axios.get(url, {latitude, longitude});
            console.log(response.data)
            const area1=response.data.results[0].region.area1.alias
            setAddress(area1)
            return area1;
        }catch (error){
            console.error(error)
            throw error;
        }
    };
    useEffect(()=>{
        if(address){
            if(searchCon.state){
                mapSearchInfo()
            }
            else{
                console.log(address)
                mapInfo()
            }
        }
    },[address, searchCon])
    
    // const calculateCenter=(path) =>{
    //     const total = path.length; //배열의 총 개수
    //     //좌표 배열 순회하며 각 죄표의 위도 경도의 합을 구함
    //     const sum =path.reduce((acc, coord) => ({
    //         lat: acc.lat + coord.latitude,  //누적된 위도 합에 현재 좌표 위도 합 더하기
    //         lng: acc.lng + coord.longitude	//누적된 경도 합에 현재 좌표 경도 합 더하기
    //     }), {lat:0, lng:0})  //초기값 {lat:0, lng:0}
    //     return {
    //         latitude: sum.lat / total,
    //         longitude: sum.lng / total,
    //     };
    // }

    //검색전 list 조회함수
    async function mapInfo(){
        const {data, error}= await supabase
            .from('draw_map_collection')
            .select('*, user (nick_name)')
            .like('location', `%${address}%`)
            .limit(10);
        console.log(data)
        if(error){
            console.error(error)
        }
        setMapLists(data)
        for(let index in data){
            // console.log(data[index].draw_m_c_id)
            async function drawPath(){
                const {data: drawPathData,error:drawPathError}=await supabase
                    .from('draw_map_c_location')
                    .select('latitude, longitude')
                    .eq('draw_m_c_id',data[index].draw_m_c_id)
                // console.log(drawPathData)
                if(drawPathData.length >0){
                    pathArray.push({
                        draw_id:data[index].draw_m_c_id,
                        coordinate : drawPathData,
                    });
                    centerArray.push({
                        draw_id:data[index].draw_m_c_id,
                        coordinate: await calculateBounds(drawPathData)
                    })
                }
            }
            await drawPath()
        }
        setpath(pathArray)
        setcenter(centerArray)
        setLoading(false)
    }

    //검색후 list 조회함수
    async function mapSearchInfo(){
        setLoading(true)
        if(selectedDistance >15){
            const {data: searchData, error: searchError}= await supabase
            .from('draw_map_collection')
            .select('* , user (nick_name)')
            .or(`location.ilike.%${searchInput}%, title.ilike.%${searchInput}%`)
            .like('location', `%${selectedLocation}%`)
            .like('level',`%${selectedDifficulty}%`)
            .gt('distance', `${selectedDistance}`)
            .limit(10)
            if(searchError){
                console.error(searchError)
            }
            // console.log(searchData)
            setMapLists(searchData)
        }else{
            const {data: searchData, error: searchError}= await supabase
            .from('draw_map_collection')
            .select('* , user (nick_name)')
            .or(`location.ilike.%${searchInput}%, title.ilike.%${searchInput}%`)
            .like('location', `%${selectedLocation}%`)
            .like('level',`%${selectedDifficulty}%`)
            .gte('distance', `${selectedDistance-5}`).lte('distance', `${selectedDistance}`)
            .limit(10)
            if(searchError){
                console.error(searchError)
            }
            // console.log(searchData)
            setMapLists(searchData)
        }
        for(let index in mapLists){
            // console.log(data[index].draw_m_c_id)
            async function drawPath(){
                const {data: drawPathData,error:drawPathError}=await supabase
                    .from('draw_map_c_location')
                    .select('latitude, longitude')
                    .eq('draw_m_c_id',mapLists[index].draw_m_c_id)
                // console.log(drawPathData)
                if(drawPathData.length >0){
                    pathArray.push({
                        draw_id:mapLists[index].draw_m_c_id,
                        coordinate : drawPathData,
                    });
                    centerArray.push({
                        draw_id:mapLists[index].draw_m_c_id,
                        coordinate: await calculateCenter(drawPathData)
                    })
                }
            }
            await drawPath()
        }
        setpath(pathArray)
        setcenter(centerArray)
        setLoading(false)
    }

    // console.log(selectedLocation)
    const HandleSearch = (e)=>{
        navigate('/map',{state:{selLocation:selectedLocation, selDistance:selectedDistance, selDifficulty:selectedDifficulty, search:searchInput}} )
    }
    
    useEffect(() => {
        // MapList 컴포넌트의 개수를 기반으로 min-height를 조정합니다.
        const newMinHeight = 800 + (mapLists.length * 150); // 각 MapList 당 150px를 추가합니다.
        setMinHeight(newMinHeight);
    }, [mapLists.length]); // mapLists 배열의 길이가 변경될 때 useEffect를 재실행합니다.
    useEffect(() => {
        window.scrollTo(0, 0);
        // console.log(mapLists)
    });

    if(loading){
        return (
            <div className="BeforeStart_container">
                <img className='map_loadimg' src="./images/logo.png" alt="" />
                <div className='map_loadmessage'>현재 위치 정보를 <br/> 가져오는 중입니다...</div>
            </div>
        )
    }

    return(
    <div className="map_search_container">
        <span className="map_title">맵</span>
        <div className="e118_274"></div>
        
        <input
            className="map_searchbar"
            type="text"
            placeholder="참여할 지역을 찾아보세요!"
            value={searchInput}
            onChange={handleSearchInputChange}
            onFocus={handleFocus}
            onBlur={(event) => handleBlur(event, '참여할 지역을 찾아보세요!')}
        />
        <div className="map_search" onClick={HandleSearch}><img className='map_search_icon' src="./icon/search.svg" alt="" /></div>
        

            {/* 위치 드롭다운 메뉴 구현 */}
            <select className='map_location_dropdown' value={selectedLocation} onChange={handleLocationChange}>
                <option value="">위치</option>
                <option value="경기">경기</option>
                <option value="대구">대구</option>
                <option value="부산">부산</option>
                <option value="서울">서울</option>
            </select>

            {/* 거리 드롭다운 메뉴 구현 */}
            <select className='map_distance_dropdown' value={selectedDistance} onChange={handleDistanceChange}>
                <option value={0}>거리순</option>
                <option value={5}>5Km 이하</option>
                <option value={10}>10Km 이하</option>
                <option value={15}>15Km 이하</option>
                <option value={16}>15Km 이상</option>
            </select>

            {/* 난이도 드롭다운 메뉴 구현 */}
            <select className='map_difficulty_dropdown' value={selectedDifficulty} onChange={handleDifficultyChange}>
                <option value="">난이도순</option>
                <option value="상">상</option>
                <option value="중">중</option>
                <option value="하">하</option>
            </select>

        
            <div className="map-list-container" style={{ minHeight: `${minHeight}px` }}>
                {mapLists.map((mapItem, index) => (
                    <Link className='map_list_link' to={`/mapDetail`} state={{drawID:mapItem.draw_m_c_id, location:mapItem.location, distance:mapItem.distance, level:mapItem.level, time:mapItem.time, pathcoord:path[index], centercoord:center[index], title:mapItem.title, drawUserId:mapItem.user_id, nickName: mapItem.user.nick_name, color: mapItem.color}} key={mapItem.draw_m_c_id}>
                        <MapList
                            key={mapItem.draw_m_c_id}
                            drawId={mapItem.draw_m_c_id}
                            location={mapItem.location}
                            distance={mapItem.distance}
                            level={mapItem.level}
                            time={mapItem.time}
                            pathcoord={path[index]}
                            centercoord={center[index]}
                            title={mapItem.title}
                            nickName={mapItem.user.nick_name}
                            color={mapItem.color}
                        ></MapList>
                    </Link>
                ))}
            </div>
            
            {/* <Link to={`/mapDetail${map.id}`} key={index}></Link> 나중에 맵 아이디 같은 식별자 나오면 쓰기*/}
        

        <div className="navbar">
        <Link to="/home"><div className="home"><img className="map_home_icon" src="./icon/home.svg" alt="" /></div></Link>
        <Link to="/map"><div className="map"><img className="map_map_icon" src="./icon/map.svg" alt="" /></div></Link>
        <Link to="/BeforeStart"><div className="run"><img className="map_run_icon" src="./icon/record.svg" alt="" /></div></Link>
        <Link to="/group"><div className="group"><img className="map_group_icon" src="./icon/group.svg" alt="" /></div></Link>
        <Link to="/mypage"><div className="my"><img className="map_my_icon" src="./icon/my.svg" alt="" /></div></Link>
         {/* 추가된 + 버튼 */}
        <Link to="/drawmap" className="floating-add-button">
            <img className='floating-add-button-icon' src="./icon/write.svg" alt="Add Map" />
        </Link>
        </div>

    </div>  
);
}