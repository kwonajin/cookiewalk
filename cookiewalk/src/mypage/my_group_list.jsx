import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline } from 'react-naver-maps';

function MyMap({ groupDrawPath, color ,center}) {
    const navermaps = useNavermaps();

    return (
    <NaverMap
        defaultCenter={center ? new navermaps.LatLng(center.latitude, center.longitude) : new navermaps.LatLng(37.3595704, 127.105399)} 
        defaultZoom={15} 
        scaleControl={false}
        mapDataControl={false}
    >
        { groupDrawPath && Object.keys(groupDrawPath).map((region, index) => (
        <Polyline
            key={region}
            path={groupDrawPath[region].map(p => new navermaps.LatLng(p.latitude, p.longitude))}
            strokeColor={color[index]} // 색상은 props로 받아 사용
            strokeWeight={8}
            strokeOpacity={0.8}
            strokeStyle="solid"
        />
    ))}
    </NaverMap>
    );
}



export default function MyGroup_List({groupList, drawPath, groupMember, center}){
    const [groupDrawPath, setGroupDrawPath]=useState([]);
    console.log(center)
    useEffect(()=>{
        console.log(groupList)
    },[groupList])
    
    useEffect(()=>{
        console.log(drawPath)
        if(drawPath){
            const groupedPaths = groupPathsByRegion(drawPath)
            setGroupDrawPath(groupedPaths)
        }
    },[drawPath])

    function groupPathsByRegion(drawPath) {
        return drawPath.reduce((acc, path) => {
        if (!acc[path.region_number]) {
            acc[path.region_number] = [];
        }
        acc[path.region_number].push(path);
        return acc;
        }, {});
    }

    return(
        <div className="mg_group1">
            <MapDiv className="mg_group1_img"><MyMap groupDrawPath={groupDrawPath} color={groupList.color} center={center}/></MapDiv>
            <div className="mg_person_box"></div>
            <div className="mg_person"><img className="mg_person_icon" src="./icon/person.svg" alt="" /></div>
            <span className="mg_person_current">{groupMember}</span>
            <span className="mg_slash">/</span>
            <span className="mg_person_total">{groupList.limit_member}</span>
            <div className="mg_dday_box"></div>
            <span className="mg_dday">D - 14</span>
            <span className="mg_group1_name">{groupList.title}</span>
            <div className="mg_place"><img className='mg_place_icon' src="./icon/place.svg" alt="" /></div>
            <span className="mg_place_text">{groupList.location}</span>
            <div className="mg_distance"><img className="mg_distance_icon" src="./icon/running.svg" alt="" /></div>
            <span className="mg_distance_text">{groupList.total_distance} km</span>
        </div>
    )
}