import React, { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline } from 'react-naver-maps';

function MyMap({ groupDrawPath, color, bounds }) {
    const navermaps = useNavermaps();

    return (
        <NaverMap
            bounds={bounds ? new navermaps.LatLngBounds(
                new navermaps.LatLng(bounds.south, bounds.west),
                new navermaps.LatLng(bounds.north, bounds.east)
            ) : null}
            defaultZoom={15}
            scaleControl={false}
            mapDataControl={false}
        >
            {groupDrawPath && Object.keys(groupDrawPath).map((region, index) => (
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

export default function Group_List({ groupList, drawPath, groupMember, center,count }){
    const [groupDrawPath, setGroupDrawPath] = useState([]);
    const [bounds, setBounds] = useState(null);


    useEffect(() => {
        console.log(groupList);
    }, [groupList]);
    useEffect(() => {
        console.log(groupMember);
        if(groupMember){
        }
    }, [groupMember]);

    useEffect(() => {
        console.log(drawPath);
        if (drawPath) {
            const groupedPaths = groupPathsByRegion(drawPath);
            setGroupDrawPath(groupedPaths);
            const bounds = calculateBounds(drawPath);
            setBounds(bounds);
        }
    }, [drawPath]);

    function groupPathsByRegion(drawPath) {
        return drawPath.reduce((acc, path) => {
            if (!acc[path.region_number]) {
                acc[path.region_number] = [];
            }
            acc[path.region_number].push(path);
            return acc;
        }, {});
    }

    function calculateBounds(paths) {
        if (!paths || paths.length === 0) return null;
        let south = paths[0].latitude, north = paths[0].latitude;
        let west = paths[0].longitude, east = paths[0].longitude;

        paths.forEach(path => {
            if (path.latitude < south) south = path.latitude;
            if (path.latitude > north) north = path.latitude;
            if (path.longitude < west) west = path.longitude;
            if (path.longitude > east) east = path.longitude;
        });

        return { south, west, north, east };
    }

    return(
        <div className='GroupList'>
            {/* <img className="group_img" src="./images/group1.png" alt="" /> */}
            <MapDiv className="group_img">
                <MyMap groupDrawPath={groupDrawPath} color={groupList.color} bounds={bounds} />
            </MapDiv>
            <div className="person_box"></div>
            <div className="person"><div><img className="person_icon" src="./icon/person.svg" alt="" /></div></div>
            <div className="current_people">{count}</div>
            <div className="g_division">/</div>
            <div className="total_people">{groupList.limit_member}</div>
            <div className="dday_box"></div>
            <div className="dday">D - 14</div>
            <div className="group_name">{groupList.title}</div>
            <div className="place"><img className='place_icon' src="./icon/place.svg" alt="" /></div>
            <div className="place_name">{groupList.location}</div>
            <div className="distance"><img className='distance_icon' src="./icon/run.svg" alt="" /></div>
            <div className="distance_num">{groupList.total_distance} km</div>
        </div>
    )
}