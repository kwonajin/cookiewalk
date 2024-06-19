import { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import { calculateBounds } from '../../utils/calculateBounds';
import { Container as MapDiv, NaverMap, Polyline, useNavermaps } from 'react-naver-maps';

// MyMap 컴포넌트는 네이버 맵을 표시하고 경로를 그립니다.
function MyMap({ path, bounds, color }) {
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
      {path.length > 1 && (
        <Polyline
          path={path.map(p => new navermaps.LatLng(p.latitude, p.longitude))}
          strokeColor={color}
          strokeWeight={4}
          strokeOpacity={0.8}
          strokeStyle="solid"
        />
      )}
    </NaverMap>
  );
}

function MyMapGroup({color, bounds, groupRecordPath }) {
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
      {groupRecordPath && Object.keys(groupRecordPath).map((region, index) => (
        // <React.Fragment key={region}>
          <Polyline
            path={groupRecordPath[region].map(p => new navermaps.LatLng(p.latitude, p.longitude))}
            strokeColor={color[region - 1]} // 인덱스 조정
            strokeWeight={8}
            strokeOpacity={1}
            strokeStyle="solid"
          />
        // </React.Fragment>
      ))}
    </NaverMap>
  );
}



export default function PostList({
  post_id, // 게시글 id
  created_at, // 작성 시간
  image, // 이미지
  walking_record_id // 워킹 기록 id
}) {
  
  const [notRecord, setNotRecord] = useState(true);
  const [record, setRecord] = useState([]);
  const [color, setColor] = useState('');
  const [bounds, setBounds] = useState([]);


  const [groupPost, setGroupPost]=useState(false)   //포스트이면 true, 개인기록게시물이면 false
  const [groupColor, setGroupColor]= useState([])
  const [groupRecordPath, setGroupRecordPath]=useState([])
  
  useEffect(() => {
    if (walking_record_id !== 'example') {
      if(walking_record_id.includes('record')){
        findRecordData();
        setNotRecord(false);
      }else if(walking_record_id.includes('group')){
        findGroupData();
        setGroupPost(true)
        setNotRecord(false);
      }
    }
  }, [walking_record_id]);

  async function findRecordData() {
    const { data: colorData, error: colorError } = await supabase
      .from('walking_record')
      .select('color')
      .eq('walking_record_id', walking_record_id);

    if (colorError) {
      console.error("findRecordData color 데이터 오류", colorError);
      return;
    }
    console.log(colorData);
    setColor(colorData[0].color);

    const { data: walkingData, error: walkingError } = await supabase
      .from('walking_record_location')
      .select('*')
      .eq('walking_record_id', walking_record_id);

    if (walkingError) {
      console.error("walkingError", walkingError);
      return;
    }

    console.log("walkingData", walkingData);
    const bound = calculateBounds(walkingData); // 경로 경계 계산
    setBounds(bound);
    setRecord(walkingData);
  }

  function groupPathsByRegion(drawPath) {
    return drawPath.reduce((acc, path) => {
      if (!acc[path.region_number]) {
        acc[path.region_number] = [];
      }
      acc[path.region_number].push(path);
      return acc;
    }, {});
  }

  async function findGroupData(){
    const { data: groupTableData, error: groupTableError } = await supabase
        .from('group')
        .select('*')
        .eq('group_id', walking_record_id);

      if (groupTableError) {
        console.error(groupTableError);
      }
      console.log(groupTableData)
      setGroupColor(groupTableData[0].color)

      const {data: recordDisData , error :recordDisError}= await supabase
        .from('group_walking_r_location')
        .select('*')
        .eq('group_id', walking_record_id)
      if(recordDisError){
        console.error(recordDisError)
      }
      console.log(recordDisData)
      if(recordDisData.length > 0){
        const groupPaths =groupPathsByRegion(recordDisData)
        setGroupRecordPath(groupPaths)
        const bound = calculateBounds(recordDisData)
        setBounds(bound);
      }
  }
  return (
    <div className="postItem">
      {/* 워킹 기록이 없으면 이미지 표시, 있으면 지도 표시 */}
      {notRecord ? (
        <img className='content_img' src={image} alt="콘텐츠 이미지" />
      ) : (
        <MapDiv className='content_img'>
          {groupPost ? (
              <MyMapGroup groupRecordPath={groupRecordPath} bounds={bounds} color={groupColor}/>
            ): (
              <MyMap path={record} bounds={bounds} color={color} />
            )}
        </MapDiv>
      )}
    </div>
  );
}
