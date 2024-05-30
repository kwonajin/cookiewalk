import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './activity_save.css'
import { Link } from "react-router-dom";
import {useToken} from '../context/tokenContext'
import { supabase } from '../supabaseClient';
import {Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline} from 'react-naver-maps'
import axios from 'axios';

function MyMap({ path=[], drawPath=[], center , passPath=[], walkMode=true}) {
    // console.log(path[path.length-1].latitude)
    const navermaps = useNavermaps();
    const markerIcon = {
        content: '<div><img src="/images/logo.png" alt="icon" class="icon_size"></div>',
        size: new navermaps.Size(24, 24),
        anchor: new navermaps.Point(12, 12)
    };
    return (
        <NaverMap
            defaultCenter={center ? new navermaps.LatLng(center.latitude, center.longitude) : new navermaps.LatLng(37.3595704, 127.105399)}
            defaultZoom={15}
        >
            {path.length >=1 && (
                <Marker icon={markerIcon} position={new navermaps.LatLng(path[path.length-1].latitude, path[path.length-1].longitude)} />
            )}
            {(walkMode && path.length > 1) && (
                <Polyline
                    path={path.map(p => new navermaps.LatLng(p.latitude, p.longitude))}
                    strokeColor='#2E9AFE'
                    strokeWeight={8}
                    strokeOpacity={0.8}
                    strokeStyle="solid"
                />
            )}

            {passPath.length >= 1 && (
                <Polyline
                    path={passPath.map(p => new navermaps.LatLng(p.latitude, p.longitude))}
                    strokeColor='#2E9AFE'
                    strokeWeight={8}
                    strokeOpacity={0.8}
                    strokeStyle="solid"
                />
                
            )}
            {/* {(walkMode && path.length > 1) && (
                <Polyline
                    path={drawPath.map(p => new navermaps.LatLng(p.latitude, p.longitude))}
                    strokeColor='red'
                    strokeWeight={8}
                    strokeOpacity={0.8}
                    strokeStyle="solid"
                />
            )} */}
            {drawPath.length > 1 && drawPath.map((p, index)=> {
                const isPassed = passPath.some(pp => pp.latitude === p.latitude && pp.longitude === p.longitude);
            return (
                <Marker
                    key={index}
                    position={new navermaps.LatLng(p.latitude, p.longitude)}
                    title={`Marker${index+1}`}
                    clickable={true}
                    icon={{
                        content: `<div style="background: ${isPassed ? '#2E9AFE' : '#B45F04'}; width: 10px; height: 10px; border-radius: 50%;"></div>`,
                        size: new navermaps.Size(10, 10),
                        anchor: new navermaps.Point(5, 5)
                    }}
                />
            )})}

        </NaverMap>
    );
}
export default function Activity_save() {
    const {state} = useLocation()
    const userInfo=useToken();
    const userID= userInfo.user
    const [address, setAddress]= useState('')
    const navigate = useNavigate();

    console.log(state)
    const [path, setPath] = useState([]);
    const [passPath, setPassPath]=useState([])
    const [drawId, setDrawId]=useState('');
    const [drawPath, setDrawPath] = useState([]);
    const [currentPosition, setCurrentPosition]=useState([])
    const [walkMode, setWalkMode]=useState(true);//true 백지걷기 //false 경로따라걷기

    const [pathLoading, setPathLoading]=useState(true)

    useEffect(()=>{
        if(path.length >=1){
            setPathLoading(false)
        }
    },[path])

    const [title ,setTitle]=useState('')
    useEffect(()=>{
        setPath(state.path)
        setPassPath(state.passPath)
        setDrawId(state.drawId)
        setDrawPath(state.drawPath)
        setCurrentPosition(state.currentPosition)
        setWalkMode(state.walkMode)//true 백지걷기 //false 경로따라걷기
    },[state])



    const formatTime = (seconds) => {
        const hours = Math.floor(seconds /3600);
        const minutes = Math.floor((seconds % 3600) /60);
        const secs = seconds % 60;
        return `${String(hours).padStart(1,'0')}h ${String(minutes).padStart(2,'0')}m ${String(secs).padStart(2,'0')}s`;
    };


    //미완성 경로 저장함수 
    async function nonCompleteWalk(){
        const {data: walkingData , error: walkingError, count} =await supabase
            .from('walking_record_N')
            .select('*',{count: 'exact'});
        if(walkingError){
            console.error(walkingError)
        }
        console.log(count)
        if(walkMode){   //경로 그림 없이 백지 상태일때 미완성 경로 저장
            const {data: insertWalkData, error:insertWalkError}= await supabase
            .from('walking_record_N')
            .insert([
                {
                    walking_record_id: `record_N_${count+1}`,
                    start_time: state.startTime,
                    end_time: state.endTime,
                    color:'#2E9AFE',
                    distance: state.distance,
                    user_id: userID,
                    walking_time:state.time,
                    title: title,
                    location: address,
                    draw_id: `record_N_${count+1}`
                }
            ])
            if(insertWalkError){
                console.error(insertWalkError)
            }
            console.log('Inserted into walking_record_N:', insertWalkData);
            for (const [index, location] of state.path.entries() ){
                const {data: insertLocationData, error: insertLocationError}= await supabase
                .from('walking_record_N_location')
                .insert([
                    {
                    walking_record_id:`record_N_${count+1}`,
                    mark_order: index+1,
                    latitude: location.latitude,
                    longitude: location.longitude
                    }
                ])
                if(insertLocationError){
                    console.log(insertLocationError)
                }
            }
        }else{ //경로 그림 있을시 미완성 그림 경로 저장
            const {data: insertWalkData, error:insertWalkError}= await supabase
            .from('walking_record_N')
            .insert([
                {
                    walking_record_id: `record_N_${count+1}`,
                    start_time: state.startTime,
                    end_time: state.endTime,
                    color:'#2E9AFE',
                    distance: state.distance,
                    user_id: userID,
                    walking_time:state.time,
                    title: title,
                    location: address,
                    draw_id: drawId
                }
            ])
            if(insertWalkError){
                console.error(insertWalkError)
            }
            console.log('Inserted into walking_record:', insertWalkData);
            for (const [index, location] of state.passPath.entries() ){
                const {data: insertLocationData, error: insertLocationError}= await supabase
                .from('walking_record_N_location')
                .insert([
                    {
                    walking_record_id:`record_N_${count+1}`,
                    mark_order: index+1,
                    latitude: location.latitude,
                    longitude: location.longitude
                    }
                ])
                if(insertLocationError){
                    console.log(insertLocationError)
                }
            }
        }
        navigate('/home')
    }

    //완성 경로 저장함수
    async function completeWalk(){
        const {data: walkingData , error: walkingError, count} =await supabase
            .from('walking_record')
            .select('*',{count: 'exact'});
        if(walkingError){
            console.error(walkingError)
        }
        console.log(count)
        if(walkMode){   //경로 그림 없이 백지 상태일때 완성 경로 저장
            const {data: insertWalkData, error:insertWalkError}= await supabase
            .from('walking_record')
            .insert([
                {
                    walking_record_id: `record_${count+1}`,
                    start_time: state.startTime,
                    end_time: state.endTime,
                    color:'#2E9AFE',
                    distance: state.distance,
                    user_id: userID,
                    walking_time:state.time,
                    title: title,
                    location: address,
                    draw_id: `record_${count+1}`
                }
            ])
            if(insertWalkError){
                console.error(insertWalkError)
            }
            for (const [index, location] of state.path.entries() ){
                const {data: insertLocationData, error: insertLocationError}= await supabase
                .from('walking_record_location')
                .insert([
                    {
                    walking_record_id:`record_${count+1}`,
                    mark_order: index+1,
                    latitude: location.latitude,
                    longitude: location.longitude
                    }
                ])
                if(insertLocationError){
                    console.log(insertLocationError)
                }
            }
        }else{  //경로 그림 있을시 완성 그림 경로 저장
            const {data: insertWalkData, error:insertWalkError}= await supabase
            .from('walking_record')
            .insert([
                {
                    walking_record_id: `record_${count+1}`,
                    start_time: state.startTime,
                    end_time: state.endTime,
                    color:'#2E9AFE',
                    distance: state.distance,
                    user_id: userID,
                    walking_time:state.time,
                    title: title,
                    location: address,
                    draw_id: drawId
                }
            ])
            if(insertWalkError){
                console.error(insertWalkError)
            }
            for (const [index, location] of state.passPath.entries() ){
                const {data: insertLocationData, error: insertLocationError}= await supabase
                .from('walking_record_location')
                .insert([
                    {
                        walking_record_id:`record_${count+1}`,
                        mark_order: index+1,
                        latitude: location.latitude,
                        longitude: location.longitude
                    }
                ])
                if(insertLocationError){
                    console.log(insertLocationError)
                }
            }
        }
        navigate('/home')
    }
    async function getReverseGeocode(latitude, longitude){
        const url =`https://blonde-bobolink-smartbusan-a2d9f8e5.koyeb.app/reverse_geocoding?latitude=${latitude}&longitude=${longitude}`;
        try{
            const response = await axios.get(url, {latitude, longitude});
            console.log(response.data.results[1].region)
            const area1=response.data.results[1].region.area1.name
            const area2=response.data.results[1].region.area2.name
            const area3=response.data.results[1].region.area3.name
            const area= `${area1} ${area2} ${area3}`
            setAddress(area)
            return area;
        }catch (error){
            console.error(error)
            throw error;
        }
    };
    useEffect(()=>{
        if(!address){
            const data=getReverseGeocode(state.path[0].latitude, state.path[0].longitude)
        }
    },[address])
    // 경로 삭제 함수
    const removeActivity = () => {
        const isConfirmed = window.confirm("경로를 저장하지 않고 삭제하시겠습니까?");
       // 사용자가 '확인'을 클릭한 경우
        if (isConfirmed) {
        navigate('/home');
    }
    };

    if(pathLoading){
        return (
            <div className="Start_container">
                <img className='loadimg' src="./images/logo.png" alt="" />
                <div className='loadmessage'>당신의 산책을 <br/> 시작하는 중...</div>
            </div>
        )
    }
    return(
        <div className="activity_save_container">
            <span className="activity_save_title">활동저장</span>
            <button className="activity_save_remove_button" onClick={removeActivity}>삭제</button>

            <MapDiv className="e298_23"><MyMap path={path} drawPath={drawPath} center={currentPosition} passPath={passPath} walkMode={walkMode}/></MapDiv>
            {/* 저장경로 이미지 뜨는 곳 */}

            <span className="activity_save_record_title">기록</span>
            <span className="activity_save_distance_label">활동 거리</span>
            <span className="activity_save_distance_value">{state.distance.toFixed(2)}km</span>
            <div className="activiity_save_label_divide_line"></div>
            <span className="activity_save_time_label">활동 시간</span>
            <span className="activity_save_time_value">{formatTime(state.time)}</span>
            <div className="activity_save_line1"></div>
            <span className="activity_save_route_title">제목</span>
            <input type="text" className='activity_save_route_title_contents' placeholder={"오늘은 어떤 그림을 그리셨나요?"} value={title} onChange={(e)=>setTitle(e.target.value)}/>
            <div className="activity_save_line2"></div>
            <span className="acitivity_save_location_label">위치</span>
            <div><img className="acitivity_save_location_icon" src="./icon/map_pin_icon.svg" alt="" /></div>
            <span className="acitivity_save_location">{address}</span>

            <button className="Unfinished_SaveRoute_button" onClick={nonCompleteWalk}>미완성 경로 저장하기</button>
            <button className="Finished_SaveRoute_button" onClick={completeWalk}>완성한 그림 저장하기</button>
        </div>

    )
}