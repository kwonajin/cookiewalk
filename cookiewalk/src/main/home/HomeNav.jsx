import React, { useState } from 'react';
import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";



export default function HomeNav() {
  const [showMenu, setShowMenu] = useState(false); // 상태 추가

  const handleMenuToggle = () => {
      setShowMenu(!showMenu); // 메뉴 보이기/숨기기 토글
  };

    return(
        <div className="homenav">
          <div className="write" onClick={handleMenuToggle}><img className="write_icon" src="./icon/write.svg" alt="" /></div>
          {showMenu && ( // 메뉴가 보이는 경우에만 렌더링
          <div className="write_dropdown_menu">
            <Link className='homenav_dropdown_link' to='/write'>
              <img className='write_dropdown_icon' src="./icon/camera.svg" alt="" />
              <div className='write_menu_title1'>사진 등록</div>
            </Link>
            <hr className='dropdown_divider_line'></hr>
            <Link className='homenav_dropdown_link' to='/finished_art'>
              <div className='write_menu_title2'>경로 등록</div>
              <img className='write_dropdown_icon' src="./icon/map.svg" alt="" />
              </Link>
          </div>
        )}
          <div className="home_title">홈</div>
          <Link to="/notice"><div className="notification"><img className="notification_icon" src="./icon/notification.svg" alt="" /></div></Link>
          <Link to="/friend"><div className="friendadd"><img className="friendadd_icon" src="./icon/friendadd.svg" alt="" /></div></Link>
          <div className="homenav_line"></div>
        </div>
    )
}