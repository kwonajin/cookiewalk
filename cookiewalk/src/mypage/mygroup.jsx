import React, { useEffect,useState }  from 'react';
import './mygroup.css';
import { Link } from "react-router-dom";
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext';
import MyGroup_List from './my_group_list';


export default function MyGroup() {

  const userInfo = useToken();
  const userID = userInfo.user;
  
  const [groupMember, setGroupMember]=useState([])
  const [group ,setGroup]=useState([])
  const [drawPath, setDrawPath]=useState([])
  const [center, setCenter]=useState([])

  useEffect(()=>{
    console.log(groupMember)
  },[groupMember])
  useEffect(()=>{
    console.log(group)
  },[group])
  useEffect(()=>{
    console.log(drawPath)
    if(drawPath){
      setCenter(calculateCenter(drawPath))
    }
  },[drawPath])
  useEffect(()=>{
    console.log(center)
  },[center])

  const calculateCenter=(drawPath) =>{
    return drawPath.map((pathGroup)=>{
      const total=pathGroup.length;
      const sum=pathGroup.reduce((acc, coord)=>({
        latitude: acc.latitude + coord.latitude,
        longitude: acc.longitude + coord.longitude
      }), {latitude: 0, longitude:0})
      
      return{
        latitude: sum.latitude/total,
        longitude: sum.longitude/total
      }
    })
  }


  async function findGroup(){
    const {data:findGroupData , error:findGroupError}= await supabase
      .from('group_member')
      .select('group_id')
      .eq('user_id', userID)

    if(findGroupError){
      console.error(findGroupError)
    }
    if (findGroupData.length === 0) {
      console.log('No groups found for this user.');
      return;
    }
    console.log(findGroupData)

    for( const group of findGroupData){
      const groupID = group.group_id
      const {data, error}=await supabase
        .from('group_member')
        .select('*')
        .eq('group_id', groupID)
        if (error) {
          console.error(error);
          return;
        }
        // console.log(`${groupID}_member: ${count}`)
        setGroupMember(prevGroupCount => [...prevGroupCount, data])

      const {data: groupTableData ,error:groupTableError}= await supabase
        .from('group')
        .select('*')
        .eq('group_id', groupID)

        if(groupTableError){
          console.error(groupTableError)
        }
        // console.log('그룹테이블',groupTableData)
        setGroup(prevGroup => [...prevGroup, groupTableData])
      const {data: locationData, error:locationError}=await supabase
        .from('group_draw_map_location')
        .select('*')
        .eq('group_id',groupID)
      if(locationError){
        console.error(locationError)
      }
      // console.log('좌표테이블:',locationData)
      setDrawPath(prevDrawPath =>[...prevDrawPath , locationData])
    }
  }

  useEffect(()=>{
    if(userID){
      findGroup()
    }
  },[userID])

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="mg_background">
      <div className='mgnav'>
        <Link to="/mypage"><div className="mg_back"><img className="mg_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>
        <span className="mg_title">내가 가입한 그룹</span>
        <div className="mg_line"></div>
      </div>
      {group.map((groupList, index) => (
      <Link to="/mygroup_detail" key={groupList[0].group_id} 
        state={{
                group_id:groupList[0].group_id,
                pathColor:groupList[0].color, 
                level:groupList[0].level, 
                limit_member:groupList[0].limit_member,
                location: groupList[0].location,
                title:groupList[0].title,
                total_distance:groupList[0].total_distance,
                distance: groupList[0].distance,
                drawPath:drawPath[index],
                groupMember: groupMember[index],
                center: center[index]
              }} >
        <div className="mg_group1">
          <img className="mg_group1_img" src="./images/group1.png" alt="" />
          <div className="mg_person_box"></div>
          <div className="mg_person"><img className="mg_person_icon" src="./icon/person.svg" alt="" /></div>
          <span className="mg_person_current">4</span>
          <span className="mg_slash">/</span>
          <span className="mg_person_total">5</span>
          <div className="mg_dday_box"></div>
          <span className="mg_dday">D - 14</span>
          <span className="mg_group1_name">{groupList[0].title}</span>
          <div className="mg_place"><img className='mg_place_icon' src="./icon/place.svg" alt="" /></div>
          <span className="mg_place_text">부산 남구 대연동</span>
          <div className="mg_distance"><img className="mg_distance_icon" src="./icon/running.svg" alt="" /></div>
          <span className="mg_distance_text">2.5km</span>
          <div className="mg_hashtag1_box"></div>
          <span className="mg_hashtag1">#부산</span>
          <div className="mg_hashtag2_box"></div>
          <span className="mg_hashtag2">#대연동</span>
          <div className="mg_hashtag3_box"></div>
          <span className="mg_hashtag3">#자전거</span>
      </div>
      </Link>
      ))}

      <div className='mygroup_list_container'>
  <Link className='mygroup_to_detail_link' to="/mygroup_detail">
    <MyGroup_List />
  </Link>
  <Link className='mygroup_to_detail_link' to="/mygroup_detail">
    <MyGroup_List />
  </Link>
  <Link className='mygroup_to_detail_link' to="/mygroup_detail">
    <MyGroup_List />
  </Link>
</div>
    </div>
  );
}

