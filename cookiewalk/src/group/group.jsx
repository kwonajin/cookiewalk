import React, { useEffect, useState } from 'react';
import './group.css'; // 필요한 CSS 파일
import { Link, useNavigate, useLocation } from "react-router-dom";
import Group_List from './group_list'; // Group_List 컴포넌트
import { useToken } from '../context/tokenContext'; // 사용자 토큰 컨텍스트
import { supabase } from '../supabaseClient'; // Supabase 클라이언트
import axios from 'axios';

export default function Group() {
  // 여기에 필요한 상태와 변수들 선언
  const navigate = useNavigate();
  const searchCon = useLocation();
  const userInfo = useToken();
  const userID = userInfo.user;
  const [address, setAddress] = useState('');
  const [currentPosition, setCurrentPosition] = useState(null);
  const [findGroupData, setfindGroupData] = useState([]);
  const [groupMember, setGroupMember] = useState([]);
  const [group, setGroup] = useState([]);
  const [drawPath, setDrawPath] = useState([]);
  const [center, setCenter] = useState([]);
  const [loading, setLoading] = useState(true);
  const [count, setCount] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDistance, setSelectedDistance] = useState(5);
  const [searchInput, setSearchInput] = useState('');

  // 이벤트 핸들러들
  const handleLocationChange = (event) => {
    setSelectedLocation(event.target.value);
  };

  const handleDistanceChange = (event) => {
    setSelectedDistance(event.target.value);
  };

  const handleSearchInputChange = (event) => {
    setSearchInput(event.target.value);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFocus = (event) => {
    event.target.placeholder = '';
  };

  const handleBlur = (event, placeholderText) => {
    event.target.placeholder = placeholderText;
  };

  const calculateCenter = (drawPath) => {
    return drawPath.map((pathGroup) => {
      const total = pathGroup.length;
      const sum = pathGroup.reduce((acc, coord) => ({
        latitude: acc.latitude + coord.latitude,
        longitude: acc.longitude + coord.longitude
      }), { latitude: 0, longitude: 0 });

      return {
        latitude: sum.latitude / total,
        longitude: sum.longitude / total
      };
    });
  };

  const fetchCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentPosition({ lat: latitude, lng: longitude });
        },
        (error) => {
          console.error('위치정보 가져오기 실패:', error);
          setCurrentPosition({ lat: 37.5665, lng: 126.9780 });
          setLoading(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 20000,
          maximumAge: 0
        }
      );
    } else {
      console.error('브라우저에서 지리적 위치 API를 지원하지 않을 경우');
      setCurrentPosition({ lat: 37.5665, lng: 126.9780 });
      setLoading(false);
    }
  };

  async function getReverseGeocode(latitude, longitude) {
    const url = `https://blonde-bobolink-smartbusan-a2d9f8e5.koyeb.app/reverse_geocoding?latitude=${latitude}&longitude=${longitude}`;
    try {
      const response = await axios.get(url, { latitude, longitude });
      const area1 = response.data.results[0].region.area1.alias;
      setAddress(area1);
      return area1;
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  // 사용자가 가입한 그룹 아이디 조회
  async function findGroup() {
    const { data: findUserGroup, error: findUserGroupError } = await supabase
      .from('group_member')
      .select('group_id')
      .eq('user_id', userID)
    if(findUserGroupError){
      console.error(findUserGroupError)
    }
    console.log(findUserGroup)
    //없으면 그냥 그룹들 조회
    if(findUserGroup.length === 0){
      console.log(address)
      const {data: findOtherGroup, error: findOtherGroupError}=await supabase
        .from('group')
        .select('*')
        .ilike('location', `%${address}%`)
      if(findOtherGroupError){
        console.log(findOtherGroupError)
      }
      console.log(findOtherGroup)
      setfindGroupData(findOtherGroup)
    }
    //있으면 본인 그룹 제외하고 조회
    if(findUserGroup.length >= 1 ){
      console.log(findUserGroup)
      const excludedGroups =await findUserGroup.map(group => `${group.group_id}`).join(',');
      // console.log(excludedGroups)
      const {data: findOtherGroup, error: findOtherGroupError}=await supabase
        .from('group')
        .select('*')
        .not('group_id', 'in', `(${excludedGroups})`) 
        .ilike('location', `%${address}%`)
      if(findOtherGroupError){
        console.log(findOtherGroupError)
      }
      console.log(findOtherGroup)
      setfindGroupData(findOtherGroup)
    }
  }

  async function findGroup_2() {
    for (const group of findGroupData) {
      const groupID = group.group_id;
      console.log(groupID)
      //그룹 맴버 수 조회
      const { data, error, count } = await supabase
        .from('group_member')
        .select('*', { count: 'exact' })
        .eq('group_id', groupID);
      if (error) {
        console.error(error);
        return;
      }
      setCount(prevCount => [...prevCount, count]);
      setGroupMember(prevGroupCount => [...prevGroupCount, data]);
      //조회한 
      const { data: groupTableData, error: groupTableError } = await supabase
        .from('group')
        .select('*')
        .eq('group_id', groupID);
      if (groupTableError) {
        console.error(groupTableError);
      }
      console.log(groupTableData)
      setGroup(prevGroup => [...prevGroup, groupTableData]);

      const { data: locationData, error: locationError } = await supabase
        .from('group_draw_map_location')
        .select('*')
        .eq('group_id', groupID);
      if (locationError) {
        console.error(locationError);
      }
      setDrawPath(prevDrawPath => [...prevDrawPath, locationData]);
      }
      setLoading(false);
  }

  async function findSeacrhGroup() {
    setLoading(true);
    const { data: findUserGroup, error: findUserGroupError } = await supabase
      .from('group_member')
      .select('group_id')
      .eq('user_id', userID);
    if (findUserGroupError) {
      console.error(findUserGroupError);
    } else if (findUserGroup.length >= 1) {
      const excludedGroups = await findUserGroup.map(group => group.group_id);
      console.log(excludedGroups)
      if (selectedDistance > 15) {
        const { data: findOtherGroup, error: findOtherGroupError } = await supabase
          .from('group')
          .select('*')
          .not('group_id', 'in',  excludedGroups.length ? `(${excludedGroups.join(',')})` : '(-1)')
          .or(`location.ilike.%${searchInput}%, title.ilike.%${searchInput}%`)
          .like('location', `%${selectedLocation}%`)
          .gt('total_distance', selectedDistance - 1);
        if (findOtherGroupError) {
          console.log(findOtherGroupError);
        }
        setfindGroupData(findOtherGroup);
      } else {
        const { data: findOtherGroup, error: findOtherGroupError } = await supabase
          .from('group')
          .select('*')
          .not('group_id', 'in', excludedGroups.length ? `(${excludedGroups.join(',')})` : '(-1)')
          .or(`location.ilike.%${searchInput}%, title.ilike.%${searchInput}%`)
          .like('location', `%${selectedLocation}%`)
          .gte('total_distance', selectedDistance - 5).lte('total_distance', selectedDistance);
        if (findOtherGroupError) {
          console.log(findOtherGroupError);
        }
        setfindGroupData(findOtherGroup);
      }
    }
  }

  useEffect(()=>{
    if(userID && address){
      if(searchCon.state){
        findSeacrhGroup()
      }else{
        findGroup()
        console.log(2)
      }
    }
  }, [userID, address, searchCon]);

  useEffect(() => {
    if (!currentPosition) {
      fetchCurrentPosition();
    }
    if (currentPosition) {
      getReverseGeocode(currentPosition.lat, currentPosition.lng);
    }
  }, [currentPosition]);

  useEffect(() => {
    if (findGroupData) {
      findGroup_2();
    }
  }, [findGroupData]);

  useEffect(() => {
    console.log(group)
  }, [group]);
  useEffect(() => {
    console.log(count)
  }, [count]);

  useEffect(() => {
    console.log(drawPath)
    if (drawPath) {
      setCenter(calculateCenter(drawPath));
    }
  }, [drawPath]);

  if (loading) {
    return (
      <div className="BeforeStart_container">
        <img className='map_loadimg' src="./images/logo.png" alt="" />
        <div className='map_loadmessage'>그룹 정보를 <br /> 가져오는 중입니다...</div>
      </div>
    );
  }

  const HandleSearch = (e) => {
    navigate('/group', { state: { selLocation: selectedLocation, selDistance: selectedDistance, search: searchInput } });
  };

  return (
    <>
      <div className="group_background">
        <div className='groupnav'>
          <div className="group_title">그룹</div>
          <div className="group_line"></div>
        </div>
        <input
          className="searchbar"
          type="text"
          placeholder="참여할 그룹을 찾아보세요!"
          onFocus={handleFocus}
          onBlur={(event) => handleBlur(event, '참여할 그룹을 찾아보세요!')}
          value={searchInput}
          onChange={handleSearchInputChange}
        />
        <div className="search" onClick={HandleSearch}><img className='search_icon' src="./icon/search.svg" alt="" /></div>

        <select className='region_select_box' value={selectedLocation} onChange={handleLocationChange}>
          <option value="">위치</option>
          <option value="경기">경기</option>
          <option value="대구">대구</option>
          <option value="부산">부산</option>
          <option value="서울">서울</option>
        </select>
        <select className='sort_box' value={selectedDistance} onChange={handleDistanceChange}>
          <option value={0}>거리순</option>
          <option value={5}>5Km 이하</option>
          <option value={10}>10Km 이하</option>
          <option value={15}>15Km 이하</option>
          <option value={16}>15Km 이상</option>
        </select>

        <div className='GroupList_container'>
          {findGroupData.map((groupList, index) => {
            const groupCapacityReached = count[index] && groupList.limit_member <= count[index];
            if (groupCapacityReached) {
              return null; // 최대 인원이 찬 그룹은 표시하지 않음
            }
            return (
              <Link className='group_to_part_link' to="/group_detail" key={groupList.group_id}
                state={{
                  group_id: groupList.group_id,
                  pathColor: groupList.color,
                  level: groupList.level,
                  limit_member: groupList.limit_member,
                  location: groupList.location,
                  title: groupList.title,
                  total_distance: groupList.total_distance,
                  distance: groupList.distance,
                  drawPath: drawPath[index],
                  groupMember: groupMember[index],
                  center: center[index],
                  count: count[index]
                }}
              >
                <Group_List
                  key={groupList.group_id}
                  groupList={groupList}
                  drawPath={drawPath[index]}
                  groupMember={groupMember[index]}
                  center={center[index]}
                  count={count[index]}
                />
              </Link>
            );
          })}
        </div>
      </div>

      <div className="navbar">
        <Link to="/home"><div className="home"><img className="group_home_icon" src="./icon/home.svg" alt="" /></div></Link>
        <Link to="/map"><div className="map"><img className="group_map_icon" src="./icon/map.svg" alt="" /></div></Link>
        <Link to="/BeforeStart"><div className="run"><img className="group_run_icon" src="./icon/record.svg" alt="" /></div></Link>
        <Link to="/group"><div className="group"><img className="group_group_icon" src="./icon/group.svg" alt="" /></div></Link>
        <Link to="/mypage"><div className="my"><img className="group_my_icon" src="./icon/my.svg" alt="" /></div></Link>
        <Link to="/draw_group_map" className="group_floating-add-button">
          <img className='group_floating-add-button-icon' src="./icon/write.svg" alt="Add Map" />
        </Link>
      </div>
    </>
  );
}
