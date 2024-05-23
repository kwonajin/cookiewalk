import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";
// import naverStaticMap from "../../naverStaticMap";
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

export default function MapList({drawId,location, title, distance, level, time, pathcoord, centercoord}) {
    const [path, setPath]= useState([]);
    const [center, setCenter]=useState([])
    // console.log(pathcoord)

    useEffect(()=>{
        if(pathcoord){
            setPath(pathcoord.coordinate)
        }
    },[pathcoord])
    useEffect(()=>{
        if(centercoord){
            setCenter(centercoord.coordinate)
        }
    },[centercoord])

return(
    <div className="map_list1">
    <div className="map_list1_box"></div>
    <div className="map_list1_location">{location}</div>
    <MapDiv className='map_list1_picture'><MyMap path={path} center={center}/></MapDiv>
    {/* <div><img className="map_list1_picture" src={imageUrl} alt="" /></div> */}

    {/* 여기에 위치 정보 넣는란도 추가 희망 */}
    <div><img className='map_list1_distance_icon' src="./icon/run.svg"/></div>
    <div className="map_list1_distance_value">{distance}km</div>
    
    <div><img className='map_list1_time_icon' src="./icon/place.svg"/></div>
    <div className="map_list1_time_value">장소 넣기 (시/동)</div>

    <div><img className='map_list1_rate_icon' src="./icon/round-star.svg"/></div>
    <div className="map_list1_rate_value">{level}</div>
    </div>
    )
}