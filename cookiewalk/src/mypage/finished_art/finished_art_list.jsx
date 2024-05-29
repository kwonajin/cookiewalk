import { Link } from "react-router-dom";
import React, { useEffect, useState } from 'react';
import { supabase } from "../../supabaseClient";
import {Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline} from 'react-naver-maps'

function MyMap({path, center}) {
    const navermaps = useNavermaps();

    return (
        <NaverMap
            defaultCenter={center ? new navermaps.LatLng(center.latitude, center.longitude) : new navermaps.LatLng(37.3595704, 127.105399)} 
            defaultZoom={15} 
            scaleControl={false}
            mapDataControl={false}
            >
            {path.length > 1 && (
                <Polyline
                    path={path.map(p => new navermaps.LatLng(p.latitude, p.longitude))}
                    strokeColor='blue'
                    strokeWeight={4}
                    strokeOpacity={0.8}
                    strokeStyle="solid"
                />
            )}
        </NaverMap>
    );
}

export default function Finished_List({drawId, location, title, distance, time, pathcoord, centercoord}){
    const [path, setPath]= useState([]);
    const [center, setCenter]=useState([])
    useEffect(()=>{
        if(pathcoord && centercoord){
            setPath(pathcoord)
            setCenter(centercoord.coordinate)
        }
    },[pathcoord, centercoord])

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
    };

    return(
    
        <Link to='/finished_art_detail'>
            <div className="finished_list1">
            
            {/* 경로 사진 */}
            <MapDiv className='finished_list1_picture'><MyMap path={path} center={center}/></MapDiv>
    
    
            <span className="finished_list1_location">제목{title}</span>
            
            <div><img className='finished_list1_distance_icon' src="./icon/run.svg"/></div>
            <div className="finished_list1_distance_value">{distance}km</div>
    
            <div><img className='finished_list1_time_icon' src="./icon/place.svg"/></div>
            <div className="finished_list1_time_value">{formatTime(time)}</div>
            <div><img className='finished_list1_rate_icon' src="./icon/round-star.svg"/></div>
            <div className="finished_list1_rate_value">{location}</div>
            </div>
        </Link>
    )
}