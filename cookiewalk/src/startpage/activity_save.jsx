import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './activity_save.css'
import { Link } from "react-router-dom";
import {useToken} from '../context/tokenContext'
import { supabase } from '../supabaseClient';
import {Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline} from 'react-naver-maps'
// import { getReverseGeocode } from '../getReverseGeocode';
import axios from 'axios';

function MyMap({path}){
    const navermaps = useNavermaps();
    return(
        <NaverMap defaultCenter={new navermaps.LatLng(path[0].lat ,path[0].lng)}>
            <Polyline
            path={path.map(p => new navermaps.LatLng(p.lat,p.lng))}
            strokeColor='blue' // 선색깔
            strokeWeight={4} //선두께
            strokeOpacity={0.8} //투명도
            strokeStyle="solid"
            />
        </NaverMap>
    )
}

export default function Activity_save() {
    const {state} = useLocation()
    const userInfo=useToken();
    const userID= userInfo.user
    const [address, setAddress]= useState('')
    const navigate = useNavigate();

    console.log(state)
    console.log(state.path[0])
    console.log(`path: ${state.path[0]}, time: ${state.time}, distance: ${state.distance}`);

    const [title ,setTitle]=useState('')
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds /3600);
        const minutes = Math.floor((seconds % 3600) /60);
        const secs = seconds % 60;
        return `${String(hours).padStart(1,'0')}h ${String(minutes).padStart(2,'0')}m ${String(secs).padStart(2,'0')}s`;
    };


    //미완성 경로 저장함수 
    async function nonCompleteWalk(){
        const {data: walkingData , error: walkingError, count} =await supabase
            .from('walking_record')
            .select('*',{count: 'exact'});
        if(walkingError){
            console.error(walkingError)
        }
        console.log(count)
        const {data: insertWalkData, error:insertWalkError}= await supabase
            .from('walking_record')
            .insert([
                {
                    walking_record_id: `record_${count+1}`,
                    start_time: state.startTime,
                    end_time: state.endTime,
                    distance: state.distance,
                    state: 'N',
                    user_id: userID,
                    title: title,
                    location: address
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
                    latitude: location.lat,
                    longitude: location.lng
                }
            ])
            if(insertLocationError){
                console.log(insertLocationError)
            }
        }
    
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
        const {data: insertWalkData, error:insertWalkError}= await supabase
            .from('walking_record')
            .insert([
                {
                    walking_record_id: `record_${count+1}`,
                    start_time: state.startTime,
                    end_time: state.endTime,
                    distance: state.distance,
                    state: 'Y',
                    user_id: userID,
                    title: title,
                    location: address
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
                    latitude: location.lat,
                    longitude: location.lng
                }
            ])
            if(insertLocationError){
                console.log(insertLocationError)
            }
        }
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
            const data=getReverseGeocode(state.path[0].lat, state.path[0].lng)
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
    return(
        <div className="activity_save_container">
            <span className="activity_save_title">활동저장</span>
            <button className="activity_save_remove_button" onClick={removeActivity}>삭제</button>

            <MapDiv className="e298_23"><MyMap path={state.path}/></MapDiv>
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