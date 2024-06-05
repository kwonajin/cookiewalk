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

export default function MyGroup_List({ groupList, drawPath, groupMember, center }) {
    const [groupDrawPath, setGroupDrawPath] = useState([]);
    const [bounds, setBounds] = useState(null);

    useEffect(() => {
        console.log(groupList);
    }, [groupList]);

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

    return (
        <div className="mg_group1">
            <MapDiv className="mg_group1_img">
                <MyMap groupDrawPath={groupDrawPath} color={groupList.color} bounds={bounds} />
            </MapDiv>
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
    );
}
