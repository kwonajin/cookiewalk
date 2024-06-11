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

  useEffect(() => {
    if (walking_record_id !== 'example') {
      findRecordData();
      setNotRecord(false);
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

  return (
    <div className="postItem">
      {/* 워킹 기록이 없으면 이미지 표시, 있으면 지도 표시 */}
      {notRecord ? (
        <img className='content_img' src={image} alt="콘텐츠 이미지" />
      ) : (
        <MapDiv className='content_img'>
          <MyMap path={record} bounds={bounds} color={color} />
        </MapDiv>
      )}
    </div>
  );
}
