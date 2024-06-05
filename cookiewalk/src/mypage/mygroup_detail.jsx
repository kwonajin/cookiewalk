import React, { useEffect, useState } from 'react';
import './mygroup_detail.css'; 
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline } from 'react-naver-maps';
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext';

// 색깔 밝기 계산 함수
function getBrightness(hexColor) {
  const rgb = parseInt(hexColor.slice(1), 16); // Remove '#' and convert to integer
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  // Calculate brightness (luminance)
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

// MyMap 컴포넌트
function MyMap({ groupDrawPath, color, center }) {
  const navermaps = useNavermaps();

  return (
    <NaverMap
      defaultCenter={center ? new navermaps.LatLng(center.latitude, center.longitude) : new navermaps.LatLng(37.3595704, 127.105399)} 
      defaultZoom={15} 
      scaleControl={false}
      mapDataControl={false}
    >
      {groupDrawPath && Object.keys(groupDrawPath).map((region, index) => (
        <React.Fragment key={region}>
          <Polyline
            path={groupDrawPath[region].map(p => new navermaps.LatLng(p.latitude, p.longitude))}
            strokeColor={color[index]} // 색상은 props로 받아 사용
            strokeWeight={8}
            strokeOpacity={0.8}
            strokeStyle="solid"
          />
          {/* 시작점에 숫자 표시 */}
          <Marker
            position={new navermaps.LatLng(groupDrawPath[region][0].latitude, groupDrawPath[region][0].longitude)}
            title={`경로 ${index + 1}`}
            icon={{
              content: `<div style="color: black; background-color: rgba(255, 255, 255, 0.7); border: 2px solid ${color[index]}; border-radius: 50%; padding: 5px; font-size: 14px;">${index + 1}</div>`,
              anchor: new navermaps.Point(12, 12),
            }}
          />
        </React.Fragment>
      ))}
    </NaverMap>
  );
}

// MyGroupDetail 컴포넌트
export default function MyGroupDetail() {
  const navigate = useNavigate();
  const userInfo = useToken();
  const userID = userInfo.user;

  const groupList = useLocation();
  console.log(groupList.state);

  const groupID = groupList.state.group_id;
  const [color, setColor] = useState(groupList.state.pathColor);
  const level = groupList.state.level;
  const limitMember = groupList.state.limit_member;
  const location = groupList.state.location;
  const title = groupList.state.title;
  const totalDistance = groupList.state.total_distance;
  const [distance, setDistance] = useState(groupList.state.distance);
  const [drawPath, setDrawPath] = useState(groupList.state.drawPath);
  const [groupMember, setGroupMember] = useState(groupList.state.groupMember);
  const [center, setCenter] = useState(groupList.state.center);
  const [groupDrawPath, setGroupDrawPath] = useState([]);
  const [selected, setSelected] = useState([]);

  useEffect(() => {
    console.log(drawPath);
    if (drawPath) {
      const groupedPaths = groupPathsByRegion(drawPath);
      setGroupDrawPath(groupedPaths);
    }
  }, [drawPath]);

  useEffect(() => {
    console.log(groupDrawPath);
  }, [groupDrawPath]);

  useEffect(() => {
    setSelected(new Array(distance.length).fill(false));
    console.log(selected);
  }, [distance]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelectClick = (index) => {
    const updatedSelected = [...selected];
    updatedSelected[index] = !updatedSelected[index];
    setSelected(updatedSelected);
    console.log(selected);
  };

  function groupPathsByRegion(drawPath) {
    return drawPath.reduce((acc, path) => {
      if (!acc[path.region_number]) {
        acc[path.region_number] = [];
      }
      acc[path.region_number].push(path);
      return acc;
    }, {});
  }

  async function goBefore() {
    const { data, error } = await supabase
      .from('group_member')
      .select('region_number')
      .eq('user_id', userID)
      .eq('group_id', groupID);

    if (error) {
      console.error(error);
    } else if (!data) {
      window.alert('구역을 선택해주세요');
    }
    console.log(data[0].region_number)
    const regionNum= data[0].region_number
    if(regionNum <= distance.length && regionNum >= 0 ){
      navigate('/BeforeStart', {state:{drawPath : groupDrawPath[regionNum] ,path:[], groupDraw: true , regionNumber: regionNum , groupId: groupID ,color:color[regionNum-1]}})
  }

  return (
    <div className="gd_background">
      <Link to="/mygroup">
        <div className="gd_back">
          <img className='gd_back_icon' src="./icon/arrow.svg" alt="뒤로가기 아이콘" />
        </div>
      </Link>
      <div className="mgd_title">내가 가입한 그룹</div>
      <div className="gd_line"></div>

      <MapDiv className='gd_img'><MyMap groupDrawPath={groupDrawPath} color={color} center={center} /></MapDiv>

      <div className="gd_name">{title}</div>
      <div className="gd_dday">
        <div className="gd_dday_box"></div>
        <div className="gd_dday_text">D - 14</div>
      </div>
      <div className="gd_line1"></div>

      <div className="gd_people">
        <img className='gd_people_icon' src="./icon/person.svg" alt="사람 아이콘" />
      </div>
      <div className="gd_person">
        <div className="gd_person_current">{groupMember.length}</div>
        <div className="gd_slash">/</div>
        <div className="gd_person_total">{limitMember}</div>
      </div>

      <div className="gd_place">
        <img className='gd_place_icon' src="./icon/place.svg" alt="장소 아이콘" />
      </div>
      <div className="gd_place_name">{location}</div>

      <div className="gd_distance">
        <img className='gd_distance_icon' src="./icon/running.svg" alt="거리 아이콘" />
      </div>
      <span className="gd_distance_num">{totalDistance} Km</span>
      <div className="gd_line2"></div>

      <div>
        {distance && distance.map((region, index) => {
          const bgColor = color[index];
          const textColor = getBrightness(bgColor) > 128 ? 'black' : 'white';
          return (
            <div key={index}>
              <div className="group_choice_box2">
                <div className="group_num_box2">
                  <div className="group_choice_num_box2" style={{ backgroundColor: bgColor }}>
                    <span className="group_choice_num2" style={{ color: textColor }}>{index + 1}</span>
                  </div>
                </div>
                <span className="group_choice_distance">{region} km</span>
                <button
                  className={`gd_select_btn ${selected[index] ? 'selected' : 'unselected'}`}
                  onClick={() => handleSelectClick(index)}>
                  {selected[index] ? '선택함' : '선택하기'}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      <div className="gd_join">
        <div className="gd_join_box"></div>
        <div className="gd_join_text" onClick={goBefore}>걷기 시작하기</div>
      </div>
    </div>
  );
}
