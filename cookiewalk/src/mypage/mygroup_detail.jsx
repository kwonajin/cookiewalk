import React, { useEffect, useState } from 'react';
import './mygroup_detail.css';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline } from 'react-naver-maps';
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext';

function getBrightness(hexColor) {
  const rgb = parseInt(hexColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

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
        <React.Fragment key={region}>
          <Polyline
            path={groupDrawPath[region].map(p => new navermaps.LatLng(p.latitude, p.longitude))}
            strokeColor={color[region - 1]} // 인덱스 조정
            strokeWeight={8}
            strokeOpacity={0.8}
            strokeStyle="solid"
          />
          <Marker
            position={new navermaps.LatLng(groupDrawPath[region][0].latitude, groupDrawPath[region][0].longitude)}
            title={`경로 ${index + 1}`}
            icon={{
              content: `<div style="color: black; background-color: rgba(255, 255, 255, 0.7); border: 2px solid ${color[region - 1]}; border-radius: 50%; padding: 5px; font-size: 14px;">${region}</div>`,
              anchor: new navermaps.Point(12, 12),
            }}
          />
        </React.Fragment>
      ))}
    </NaverMap>
  );
}

export default function MyGroupDetail() {
  const navigate = useNavigate();
  const userInfo = useToken();
  const userID = userInfo.user;

  const groupList = useLocation();
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
  const [groupDrawPath, setGroupDrawPath] = useState([]);
  const [selected, setSelected] = useState([]);
  const [bounds, setBounds] = useState(null);
  const [selectedPath, setSelectedPath] = useState(null);
  const [userRegionNumber, setUserRegionNumber] = useState(null);
  const [otherUserRegionNumbers, setOtherUserRegionNumbers] = useState([]);

  useEffect(() => {
    if (drawPath) {
      const groupedPaths = groupPathsByRegion(drawPath);
      setGroupDrawPath(groupedPaths);
      const bounds = calculateBounds(drawPath);
      setBounds(bounds);
    }
  }, [drawPath]);

  useEffect(() => {
    setSelected(new Array(distance.length).fill(false));
  }, [distance]);

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserRegionNumber();
    fetchOtherUserRegionNumbers();

    const subscription = supabase
      .channel('public:group_member')
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'group_member' }, payload => {
        fetchOtherUserRegionNumbers();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, []);

  const fetchUserRegionNumber = async () => {
    const { data, error } = await supabase
      .from('group_member')
      .select('region_number')
      .eq('user_id', userID)
      .eq('group_id', groupID)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    if (data && data.region_number !== null) {
      setUserRegionNumber(data.region_number);
      const updatedSelected = new Array(distance.length).fill(false);
      if (data.region_number !== 0) {
        updatedSelected[data.region_number - 1] = true;
        setSelected(updatedSelected);
        setSelectedPath(data.region_number);
      }
    }
  };

  const fetchOtherUserRegionNumbers = async () => {
    const { data, error } = await supabase
      .from('group_member')
      .select('region_number')
      .eq('group_id', groupID)
      .neq('user_id', userID);

    if (error) {
      console.error(error);
      return;
    }

    if (data) {
      const regionNumbers = data.map(item => item.region_number);
      setOtherUserRegionNumbers(regionNumbers);
    }
  };

  const handleSelectClick = async (index) => {
    if (userRegionNumber === index + 1) {
      // 선택 해제
      setSelected(new Array(distance.length).fill(false));
      setSelectedPath(null);
      await saveUserRegionNumber(0);
    } else {
      // 선택 또는 변경
      const updatedSelected = new Array(distance.length).fill(false);
      updatedSelected[index] = true;
      setSelected(updatedSelected);
      setSelectedPath(index + 1);

      const { data, error } = await supabase
        .from('group_member')
        .select('region_number')
        .eq('group_id', groupID)
        .neq('user_id', userID)
        .neq('region_number', 0);

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        const selectedRegions = data.map(item => item.region_number);
        if (selectedRegions.includes(index + 1)) {
          alert('이미 다른 사용자가 선택한 경로입니다.');
          fetchOtherUserRegionNumbers(); // 최신 상태로 업데이트
          return;
        } else {
          await saveUserRegionNumber(index + 1, new Date().toISOString());
          fetchOtherUserRegionNumbers(); // 다른 사용자 경로 업데이트
        }
      }
    }
  };

  const saveUserRegionNumber = async (regionNumber, selectionTime = null) => {
    const { error } = await supabase
      .from('group_member')
      .update({ region_number: regionNumber, selection_time: selectionTime })
      .eq('user_id', userID)
      .eq('group_id', groupID);

    if (error) {
      console.error(error);
    } else {
      setUserRegionNumber(regionNumber);
    }
  };

  const goBefore = async () => {
    if (selectedPath !== null) {
      // 중복 선택 방지 로직 추가
      const { data, error } = await supabase
        .from('group_member')
        .select('region_number, selection_time')
        .eq('group_id', groupID)
        .neq('user_id', userID)
        .neq('region_number', 0);

      if (error) {
        console.error(error);
        return;
      }

      if (data) {
        const selectedRegions = data.map(item => item.region_number);
        const userSelectionTime = (await supabase
          .from('group_member')
          .select('selection_time')
          .eq('user_id', userID)
          .eq('group_id', groupID)
          .single()).data.selection_time;

        const conflictingSelection = data.find(item => item.region_number === selectedPath && new Date(item.selection_time) < new Date(userSelectionTime));

        if (selectedRegions.includes(selectedPath) && conflictingSelection) {
          alert('이미 다른 사용자가 선택한 경로입니다.');
          fetchOtherUserRegionNumbers(); // 최신 상태로 업데이트
          return;
        } else {
          await saveUserRegionNumber(selectedPath, new Date().toISOString());
          navigate('/BeforeStart', {
            state: {
              drawPath: groupDrawPath[selectedPath],
              path: [],
              groupDraw: true,
              regionNumber: selectedPath,
              groupId: groupID,
              color: color[selectedPath - 1] // 인덱스 조정
            }
          });
        }
      }
    } else {
      alert('경로를 선택해주세요');
    }
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
    <div className="gd_background">
      <Link to="/mygroup">
        <div className="gd_back">
          <img className='gd_back_icon' src="./icon/arrow.svg" alt="뒤로가기 아이콘" />
        </div>
      </Link>
      <div className="mgd_title">내가 가입한 그룹</div>
      <div className="gd_line"></div>

      <MapDiv className='gd_img'><MyMap groupDrawPath={groupDrawPath} color={color} bounds={bounds} /></MapDiv>

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
          const isDisabled = otherUserRegionNumbers.includes(index + 1);
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
                  className={`gd_select_btn ${selected[index] ? 'selected' : isDisabled ? 'disabled' : 'unselected'}`}
                  onClick={() => handleSelectClick(index)}
                  disabled={isDisabled}>
                  {selected[index] ? '선택함' : isDisabled ? '선택 불가' : '선택하기'}
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
