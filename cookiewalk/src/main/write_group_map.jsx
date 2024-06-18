import React, { useState, useEffect } from 'react';
import './write_map.css'; 
import { Link, useNavigate, useLocation } from "react-router-dom";
import { supabase } from '../supabaseClient'
import { useToken } from '../context/tokenContext'
import { Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline } from 'react-naver-maps';


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

export default function Write_map() {
  const navigate = useNavigate();
  const recordItem = useLocation()
  const groupId = recordItem.state.groupID;
  const bounds = recordItem.state.bounds
  // const groupRecordPath = recordItem.state.groupRecordPath
  const [groupRecordPath, setGroupRecordPath]=useState(recordItem.state.groupRecordPath)
  const color= recordItem.state.color
  const location =recordItem.state.location

  console.log(recordItem)
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기 URL 상태 추가
  
  const userInfo = useToken();
  const userID = userInfo.user;


  const submitPost = async () => {
    if (!text) {
      alert('모든 필드를 채워주세요.');
      return;
    }
    setIsLoading(true);
    try {
      const createdAt = new Date().toISOString();
      const postID = `${userID}_${createdAt}`;
    
      const { data, error } = await supabase.from('post').insert({
        post_id: postID,
        user_id: userID,
        walking_record_id: groupId, // Update this value according to your context
        content: text,
        image: 'N',
        locate: location,
        created_at: createdAt
      });
    
      if (error) {
        console.error(error)
        throw new Error('Failed to insert post');
      }
      console.log('Insert success:', data);
      navigate('/home');
    } catch (error) {
      console.error('Error:', error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="write-map-page">
      <Link to="/finished_art">
        <div className="write_map_back">
          <img className='write_map_back_icon' src="./icon/arrow.svg" alt="Back" />
        </div>
      </Link>
      
      <div className="write_map_title">새 게시물</div>
      <button className="write_map_add" onClick={submitPost} disabled={isLoading}>
        {isLoading ? '등록중' : '작성'}
      </button>

      <div className='writeMap_Picture_add_box'>

        <MapDiv className='write_map_img'><MyMap groupRecordPath={groupRecordPath} bounds={bounds} color={color}/></MapDiv>
        {previewUrl && <img src={previewUrl} alt="Preview" className="writeMap_image_preview" />}
      </div>  


      <textarea className="writeMap_text" placeholder="나의 활동을 공유하세요!" value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}
