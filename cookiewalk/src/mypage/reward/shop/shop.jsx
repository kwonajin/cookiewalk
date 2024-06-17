import React from 'react';
import './shop.css'; // 필요한 CSS 파일
import { Link, useNavigate } from "react-router-dom";
import { useToken } from '../../../context/tokenContext';
import { supabase } from '../../../supabaseClient';

export default function Shop() {
  // 여기에 필요한 상태와 변수들 선언
  const navigate = useNavigate();
  const userInfo = useToken();
  const userID = userInfo.user;

  return (
    <div className="shop-container">
      <div className="group_background">
        <div className='groupnav'>
          <div className="group_title">상점</div>
          <div className="group_line"></div>
        </div>
        <input
          className="searchbar"
          type="text"
          placeholder="검색"
        />
        <div className="search">
          <img className='search_icon' src="./icon/search.svg" alt="Search Icon" />
        </div>

        <select className='region_select_box'>
          <option value="avatar">아바타</option>
          <option value="option1">미정1</option>
          <option value="option2">미정2</option>
          <option value="option3">미정3</option>
          <option value="option4">미정4</option>
        </select>
        <select className='sort_box'>
          <option value="distance">거리순</option>
          <option value="under5km">5Km 이하</option>
          <option value="under10km">10Km 이하</option>
          <option value="under15km">15Km 이하</option>
          <option value="over15km">15Km 이상</option>
        </select>

        <div className='GroupList_container'>
          <div><img src="../images/cash.png" alt="에러" /></div>
          <div>hello</div>
          <div>hello</div>
        </div>
      </div>

      <div className="navbar">
        <Link to="/home"><div className="home"><img className="group_home_icon" src="./icon/home.svg" alt="Home" /></div></Link>
        <Link to="/map"><div className="map"><img className="group_map_icon" src="./icon/map.svg" alt="Map" /></div></Link>
        <Link to="/BeforeStart"><div className="run"><img className="group_run_icon" src="./icon/record.svg" alt="Run" /></div></Link>
        <Link to="/group"><div className="group"><img className="group_group_icon" src="./icon/group.svg" alt="Group" /></div></Link>
        <Link to="/mypage"><div className="my"><img className="group_my_icon" src="./icon/my.svg" alt="My Page" /></div></Link>
        <Link to="/draw_group_map" className="group_floating-add-button">
          <img className='group_floating-add-button-icon' src="./icon/write.svg" alt="Add Map" />
        </Link>
      </div>
    </div>
  );
}
