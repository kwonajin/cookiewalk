import React from 'react';
import './mypage.css'; // Import your CSS file

export default function MyPage() {
  return (
    <><div className="background">

      <div className='mynav'>
        <div className="user_id">running_go</div>
        <div className="menu"><img className="menu_icon" src="./icon/menu.svg" alt="" /></div>
        <div className="title_line"></div>
      </div>

      <div><img className="profile_img" src="./images/ellipse_7.png" alt="" /></div>
      <div className="total_distance_num">32km</div>
      <div className="total_distance">총거리</div>
      <div className="follower_num">147</div>
      <div className="follower">팔로워</div>
      <div className="following_num">182</div>
      <div className="following">팔로잉</div>

      <div className="user_name">유민지</div>
      <div className="introduction">재미있는 산책을 지향합니다 🌳✨</div>

      <div className="profile_edit"></div>
      <div className="profile_edit_text">프로필 편집</div>
      <div className="profile_share"></div>
      <span className="profile_share_text">프로필 공유</span>

      <div className="line1"></div>
      <span className="myactive">내활동</span>
      <span className="mypost">게시물</span>
      <div className="line2"></div>

      <div className="carousel"></div>
      <div className="carousel_right"><div><img className="carousel_right_icon" src="./icon/arrow.svg" alt="" /></div></div>
      <div className="carousel_left"><div><img className="carousel_left_icon" src="./icon/arrow.svg" alt="" /></div></div>


      <div className="badge">획득한 뱃지</div>
      <div className="badge_go"><img className='badge_go_icon' src="./icon/arrow.svg" alt="" /></div>
      <div className="badge_list">
        <div className="badge1"></div>
        <div className="badge2"></div>
        <div className="badge3"></div>
        <div className="badge4"></div>
      </div>

      <span className="myjoingroup">내가 가입한 그룹</span>
      <div className="group_go"><img className='group_go_icon' src="./icon/arrow.svg" alt="" /></div>
      <div className="myjoingroup_list"></div>
      <div className="group1">
        <div className="group1_img"></div>
        <span className="group1_tilte">전국 한반도 그리기</span>
      </div>
      <div className="group2">
        <div className="group2_img"></div>
        <span className="group2_tilte">부산 토끼 그려요🐰</span>
      </div>
      <div className="group3">
        <div className="group3_img"></div>
        <span className="group3_tilte">폼폼푸린 🍮</span>
      </div>
    </div>

    <div className="navbar">
      <a href="./index.html"><div className="home"><img className="home_icon" src="./icon/home.svg" alt="" /></div></a>
      <a href="#"><div className="map"><img className="map_icon" src="./icon/map.svg" alt="" /></div></a>
      <a href="#"><div className="run"><img className="run_icon" src="./icon/record.svg" alt="" /></div></a>
      <a href="#"><div className="group"><img className="group_icon" src="./icon/group.svg" alt="" /></div></a>
      <a href="./mypage/mypage.jsx"><div className="my"><img className="my_icon" src="./icon/my.svg" alt="" /></div></a>
    </div></>
    
  );
}
