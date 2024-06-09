import React, { useEffect ,useState }  from 'react';
import './group_detail.css'; 
import { Link , useNavigate, useLocation } from "react-router-dom";
import { Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline } from 'react-naver-maps';
import { useToken } from '../context/tokenContext';

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




export default function GroupDetail() {
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
  const [groupDrawPath, setGroupDrawPath] = useState([]);
  const [selected, setSelected] = useState([]);
  const [bounds, setBounds] = useState(null);
  const count = groupList.state.count

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    console.log(drawPath);
    if (drawPath) {
      const groupedPaths = groupPathsByRegion(drawPath);
      setGroupDrawPath(groupedPaths);
      const bounds = calculateBounds(drawPath);
      setBounds(bounds);
    }
  }, [drawPath]);

  useEffect(() => {
    console.log(groupDrawPath);
  }, [groupDrawPath]);

  useEffect(() => {
    setSelected(new Array(distance.length).fill(false));
    console.log(selected);
  }, [distance]);


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
      <Link to="/group"><div className="gd_back"><img className='gd_back_icon' src="./icon/arrow.svg" alt="" /></div></Link>
        <div className="gd_title">그룹</div>
        <div className="gd_line"></div>


      <MapDiv className='gd_img'><MyMap groupDrawPath={groupDrawPath} color={color} bounds={bounds} /></MapDiv>
      <div className="gd_name">{title}</div>
      <div className="gd_dday">
        <div className="gd_dday_box"></div>
        <div className="gd_dday_text">D - 14</div>
      </div>
      <div className="gd_line1"></div>

      <div className="gd_people"><img className='gd_people_icon' src="./icon/person.svg" alt="" /></div>
      <div className="gd_person">
        <div className="gd_person_current">{count}</div>
        <div className="gd_slash">/</div>
        <div className="gd_person_total">{limitMember}</div>
      </div>

      <div className="gd_place"><img className='gd_place_icon' src="./icon/place.svg" alt="" /></div>
      <div className="gd_place_name">{location}</div>

      <div className="gd_distance"><img className='gd_distance_icon' src="./icon/running.svg" alt="" /></div>
      <span className="gd_distance_num">{totalDistance} km</span>
      <div className="gd_line2"></div>

      <div className="gd_hashtag1">
        <div className="gd_hashtag1_box"></div>
        <div className="gdd_hashtag1_text">#부산</div>
      </div>
      <div className="gd_hashtag2">
        <div className="gd_hashtag2_box"></div>
        <span className="gdd_hashtag2_text">#대연동</span>
      </div>
      <div className="gd_hashtag3">
        <div className="gd_hashtag3_box"></div>
        <span className="gdd_hashtag3_text">#자전거</span>
      </div>


      <div className="gd_join">
        <div className="gd_join_box"></div>
        <div className="gd_join_text">그룹 참여하기</div>
      </div>


    </div>
  );
}

