import React, { useEffect, useState } from 'react';
import './mygroup.css';
import { Link } from "react-router-dom";
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext';
import MyGroup_List from './my_group_list';

export default function MyGroup() {
  const userInfo = useToken();
  const userID = userInfo.user;
  
  const [groupMember, setGroupMember] = useState([]);
  const [group, setGroup] = useState([]);
  const [drawPath, setDrawPath] = useState([]);
  const [center, setCenter] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log(groupMember);
  }, [groupMember]);
  
  useEffect(() => {
    console.log(group);
  }, [group]);
  
  useEffect(() => {
    console.log(drawPath);
    if (drawPath) {
      setCenter(calculateCenter(drawPath));
    }
  }, [drawPath]);
  
  useEffect(() => {
    console.log(center);
  }, [center]);

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

  async function findGroup() {
    const { data: findGroupData, error: findGroupError } = await supabase
      .from('group_member')
      .select('group_id')
      .eq('user_id', userID);

    if (findGroupError) {
      console.error(findGroupError);
    }
    if (findGroupData.length === 0) {
      console.log('No groups found for this user.');
      return;
    }
    console.log(findGroupData);

    for (const group of findGroupData) {
      const groupID = group.group_id;
      const { data, error } = await supabase
        .from('group_member')
        .select('*')
        .eq('group_id', groupID);
      if (error) {
        console.error(error);
        return;
      }
      setGroupMember(prevGroupCount => [...prevGroupCount, data]);

      const { data: groupTableData, error: groupTableError } = await supabase
        .from('group')
        .select('*')
        .eq('group_id', groupID);

      if (groupTableError) {
        console.error(groupTableError);
      }
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

  useEffect(() => {
    if (userID) {
      findGroup();
    }
  }, [userID]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="BeforeStart_container">
        <img className='map_loadimg' src="./images/logo.png" alt="" />
        <div className='map_loadmessage'>나의 그룹 정보를 <br/> 가져오는 중입니다...</div>
      </div>
    );
  }

  return (
    <div className="mg_background">
      <div className='mgnav'>
        <Link to="/mypage"><div className="mg_back"><img className="mg_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>
        <span className="mg_title">내가 가입한 그룹</span>
        <div className="mg_line"></div>
      </div>

      <div className='mygroup_list_container'>
        {group.map((groupList, index) => (
          <Link className='mygroup_to_detail_link' to="/mygroup_detail"
            state={{
              group_id: groupList[0].group_id,
              pathColor: groupList[0].color, 
              level: groupList[0].level, 
              limit_member: groupList[0].limit_member,
              location: groupList[0].location,
              title: groupList[0].title,
              total_distance: groupList[0].total_distance,
              distance: groupList[0].distance,
              drawPath: drawPath[index],
              groupMember: groupMember[index],
              center: center[index]
            }}>
            <MyGroup_List
              key={groupList[0].group_id}
              groupList={groupList[0]}
              drawPath={drawPath[index]}
              groupMember={groupMember[index].length}
              center={center[index]}
            />
          </Link>
        ))}
      </div>
    </div>
  );
}
