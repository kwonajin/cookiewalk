import React, { useEffect }  from 'react';
import './group.css';
import { Link } from "react-router-dom";

export default function Group() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFocus = (event) => {
    event.target.placeholder = '';
  };

  const handleBlur = (event, placeholderText) => {
    event.target.placeholder = placeholderText;
  
  };
  

  return (
    <><div className="group_background">
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
        />
      <div className="search"><img className='search_icon' src="./icon/search.svg" alt="" /></div>

      <div className="region_select_box"></div>
      <div className="region_select">지역을 선택하세요</div>
      <div className="region"><img className="region_icon" src="./icon/arrow.svg" alt="" /></div>
      <div className="sort_box"></div>
      <div className="sort_select">거리순</div>
      <div className="sort"><img className='sort_icon' src="./icon/arrow.svg" alt="" /></div>

      <Link to="/group_detail">
        <img className="group_img" src="./images/group1.png" alt="" />
        <div className="person_box"></div>
        <div className="person"><div><img className="person_icon" src="./icon/person.svg" alt="" /></div></div>
        <div className="current_people">4</div>
        <div className="division">/</div>
        <div className="total_people">5</div>
        <div className="dday_box"></div>
        <div className="dday">D - 14</div>
        <div className="group_name">같이 그리실 분??</div>
        <div className="place"><img className='place_icon' src="./icon/place.svg" alt="" /></div>
        <div className="place_name">부산 남구 대연동</div>
        <div className="distance"><img className='distance_icon' src="./icon/run.svg" alt="" /></div>
        <div className="distance_num">2.5km</div>
      </Link>
      
      <div className="hashtag_box1"></div>
      <div className="hashtag1">#부산</div>
      <div className="hashtag_box2"></div>
      <div className="hashtag2">#대연동</div>
      <div className="hashtag_box3"></div>
      <div className="hashtag3">#자전거</div>

      {/* <div className="e15_382"></div> */}
      {/* <div className="e15_403"></div>
      <div className="e15_404">공룡 같이 그려요 🐉</div>
      <div className="e15_406">부산 해운대구 우동</div>
      <div className="e15_407">#부산</div>
      <div className="e15_408"></div>
      <div className="e15_409">#해운대구</div>
      <div className="e15_410"></div>
      <div className="e15_411">#공룡</div>
      <div className="e15_412">2.5km</div>
      <div className="e15_413">
        <div className="e15_414"></div>
      </div>
      <div className="e15_415">
        <div className="e15_416"></div>
      </div>
      
      <div className="e132_2"></div>
      <div className="e132_3"></div>
      <div className="e132_4">
        <div className="e132_5"></div>
      </div>
      <span className="e132_6">2</span>
      <div className="e132_7">D - 20</div>
      <div className="e132_8">/</div>
      <div className="e132_9">7</div> */}

    </div>

    <div className="navbar">
    <Link to="/home"><div className="home"><img className="group_home_icon" src="./icon/home.svg" alt="" /></div></Link>
    <Link to="/map"><div className="map"><img className="group_map_icon" src="./icon/map.svg" alt="" /></div></Link>
    <Link to="/pause"><div className="run"><img className="group_run_icon" src="./icon/record.svg" alt="" /></div></Link>
    <Link to="/group"><div className="group"><img className="group_group_icon" src="./icon/group.svg" alt="" /></div></Link>
    <Link to="/mypage"><div className="my"><img className="group_my_icon" src="./icon/my.svg" alt="" /></div></Link>
    </div></>
  );
}

