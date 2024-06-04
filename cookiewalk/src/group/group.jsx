import React, { useEffect }  from 'react';
import './group.css';
import { Link } from "react-router-dom";
import Group_List from './group_list';

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

      <div className='GroupList_container'>
      <Link className='group_to_part_link' to="/group_detail">
          <Group_List/>
        </Link>
        <Link className='group_to_part_link' to="/group_detail">
          <Group_List/>
        </Link>
        <Link className='group_to_part_link' to="/group_detail">
          <Group_List/>
        </Link>
        <Link className='group_to_part_link' to="/group_detail">
          <Group_List/>
        </Link>
        
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
    </div></>
  );
}

