import React, { useEffect, useState } from 'react';
import './mygroup_detail.css';
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline } from 'react-naver-maps';
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext';
import { calculateDistance2 } from '../utils/CalculateDistance2';

function getBrightness(hexColor) {
  const rgb = parseInt(hexColor.slice(1), 16);
  const r = (rgb >> 16) & 0xff;
  const g = (rgb >> 8) & 0xff;
  const b = (rgb >> 0) & 0xff;
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function MyMap({ groupDrawPath, color, bounds, groupRecordPath }) {
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
            strokeOpacity={0.3}
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
      {groupRecordPath && Object.keys(groupRecordPath).map((region, index) => (
        <React.Fragment key={region}>
          <Polyline
            path={groupRecordPath[region].map(p => new navermaps.LatLng(p.latitude, p.longitude))}
            strokeColor={color[region - 1]} // 인덱스 조정
            strokeWeight={8}
            strokeOpacity={1}
            strokeStyle="solid"
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
  
  const [path, setPath]=useState([])
  const [groupRecordPath, setGroupRecordPath]= useState([])
  
  const distacneCount= groupList.state.distance.length
  const [recordDistance, setRecordDistance]=useState(Array(distacneCount).fill(0));
  const [recordDisSum, setRecrodDisSum]=useState([])
  const [recordPercent, setRecordPercent]=useState(Array(distacneCount).fill(0))
  console.log(distance)

  const [finished, setFinished]=useState(false)

  useEffect(() => {
    if (drawPath) {
      const groupedPaths = groupPathsByRegion(drawPath);
      setGroupDrawPath(groupedPaths);
      const bounds = calculateBounds(drawPath);
      setBounds(bounds);
      walkingRecord()
    }
  }, [drawPath]);

  useEffect(() => {
    console.log(distance)
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
          //완료시에 그리기 못하게 추가
          if(Number(recordPercent[selectedPath-1]) === 100){
            window.alert('선택하신 구역의 그리기를 완료하셨습니다.')
          }else{
            navigate('/BeforeStart', {
              state: {
                drawPath: groupDrawPath[selectedPath],
                path: !groupRecordPath[selectedPath] || Object.keys(groupRecordPath[selectedPath]).length === 0 ? [] : groupRecordPath[selectedPath],
                groupDraw: true,
                regionNumber: selectedPath,
                groupId: groupID,
                color: color[selectedPath - 1], // 인덱스 조정
                drawDistance: distance[selectedPath -1]
              }
            });
          }
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

  //여기부터 걸은 경로 불러오는 로직

  async function walkingRecord() {
    //완성 기록 좌표 데이터 불러오기
    const {data: recordData ,error:recordError} = await supabase
      .from('group_walking_r_location')
      .select("*")
      .eq('group_id', groupID);
    if(recordError){
      console.error(error);
    }
    // console.log(recordData);

    //미완성 기록 좌표 데이터 불러오기
    const {data: record_N_data, error: record_N_error}=await supabase
      .from('group_walking_r_location_N')
      .select("*")
      .eq('group_id', groupID)
    if(record_N_error){
      console.error(record_N_error)
    }
    //recrodData에 완성 미완성 합치기
    recordData.push(...record_N_data)
    setPath(recordData)

    const {data: recordDisData , error :recordDisError}= await supabase
      .from('group_walking_record')
      .select('region_number , distance')
      .eq('group_id', groupID)
    if(recordDisError){
      console.error(recordDisError)
    }
    console.log(recordDisData)

    const {data: record_N_DisData , error :record_N_DisError}= await supabase
      .from('group_walking_record_N')
      .select('region_number , distance')
      .eq('group_id', groupID)
    if(recordDisError){
      console.error(record_N_DisError)
    }
    console.log(record_N_DisData)

    recordDisData.push(...record_N_DisData)
    setRecrodDisSum(recordDisData)
  }
  useEffect(()=>{
    console.log(path)
    if(path){
      const groupPaths =groupPathsByRegion(path)
      setGroupRecordPath(groupPaths)
    }
  },[path])

  function calculateTotalDistance(section) {
    let totalDistance = 0;
    for (let i = 0; i < section.length - 1; i++) {
      const distance = calculateDistance2(section[i], section[i + 1]);
      totalDistance += distance;
    }
    return totalDistance;
  }

  useEffect(()=>{
    console.log(groupRecordPath)
    const newDistanceArray = Array(distacneCount).fill(0)
    if(Object.keys(groupRecordPath).length > 0){
      // const newDistanceArray = Array(distacneCount).fill(0)
      for (const regionNum in groupRecordPath){
        const section = groupRecordPath[regionNum];
        const passDistance = calculateTotalDistance(section)
        newDistanceArray[regionNum-1]=passDistance.toFixed(2)
      }
    }
    setRecordDistance(newDistanceArray)
  },[groupRecordPath])

  useEffect(()=>{
    console.log(recordDistance)
    const newPercentArray = Array(distacneCount).fill(0)
    recordDistance.map((dis,index)=>{
      let percent= (dis/Number(distance[index])*100).toFixed(2)
      newPercentArray[index]=percent
    })
    setRecordPercent(newPercentArray)
  },[recordDistance])  
  
  useEffect(()=>{
    console.log(recordPercent)
    if(recordPercent.every(percent => percent === '100.00')){
      setFinished(true)
      console.log(finished)
    }
  },[recordPercent])

  function goPost(){
    navigate('/write_group_map', {state: {groupRecordPath : groupRecordPath, color:color,bounds: bounds, groupID:groupID, location:location}})
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

      <MapDiv className='gd_img'><MyMap groupDrawPath={groupDrawPath} color={color} bounds={bounds} groupRecordPath={groupRecordPath}/></MapDiv>

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
          // console.log(otherUserRegionNumbers)
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
                {/* 밑에 recordPercent[index]가 달성률임다 위치수정 부탁드립니다 폰트 글자색등 자유롭게 원하는대로 바꾸주시면 됩니다!!*/}
                <span className="group_choice_distance_rate"> {recordPercent[index]} %</span>
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
        {finished ? 
          ( <div className="gd_join_text" onClick={goPost}>그림 완성 !!</div>)
          : 
          (<div className="gd_join_text" onClick={goBefore}>걷기 시작하기</div> )}
      </div>
    </div>
  );
}
