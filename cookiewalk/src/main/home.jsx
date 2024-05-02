import React, { useEffect }  from 'react';
import './home.css'; // CSS 파일을 import 합니다.
import { Link , useNavigate } from "react-router-dom";
import { useToken } from '../context/tokenContext';
import {supabase} from '../supabaseClient'

export default function Home() {
  const navigate = useNavigate();

  const userInfo= useToken();
  const userID= userInfo.user
  console.log(userID)

  const checkNickname = async ()=> {
    const { data: firstLoginData, error:firstLoginError }=await supabase
      .from('user')
      .select('nick_name')
      .eq('user_id', userID)
      .is('nick_name',null)
    console.log(firstLoginData)
    if(firstLoginData.length>0){
      navigate('/signup3')
    }   
  }
  useEffect(() => {
    window.scrollTo(0, 0);
    if(userID !=null){
      checkNickname()
    }
  }, [userID]);

  const additionalItems = [
    {
      profileImgSrc: './images/ellipse_7.png',
      name: 'running_go',
      place: '부산 광안리',
      contentImgSrc: './images/rectangle_2.png',
      contents: '오랜만에 모닝 러닝한 날🌄👟 오랜만에 모닝 러닝한 날🌄👟오랜만에 모닝 러닝한 날🌄👟 오랜만에 모닝 러닝한 날🌄👟오랜만에 모닝 러닝한 날🌄👟 오랜만에 모닝 러닝한 날🌄👟',
      date: '4월 13일',
      likeCount: 129,
      distance: '8.11km',
      time: '3h 13m',
    },
    // 추가 아이템을 필요한 만큼 여기에 추가
  ];

  
  return (
    <div className="home_background">
      <div className="topnav">
        <div className="homenav">
          <Link to="/write"><div className="write"><img className="write_icon" src="./icon/write.svg" alt="" /></div></Link>
          <div className="home_title">홈</div>
          <Link to="/notice"><div className="notification"><img className="notification_icon" src="./icon/notification.svg" alt="" /></div></Link>
          <Link to="/friend"><div className="friendadd"><img className="friendadd_icon" src="./icon/friendadd.svg" alt="" /></div></Link>
          <div className="homenav_line"></div>
        </div>

        <div className="active">
          <div className="my_active">나의 이번주 활동</div>
          <div className="detail">자세히보기</div>
          <div className="art">완성한 그림 수</div>
          <div className="art_num">0개</div>
          <div className="home_line1"></div>
          <div className="active_distance">활동 거리</div>
          <div className="active_distance_num">0.00km</div>
          <div className="home_line2"></div>
          <div className="active_time">활동 시간</div>
          <div className="active_time_num">0h 0m</div>


        </div>
      </div>

      <div className="home_background">
        {/* 내용 생략 */}
        {/* 아이템 리스트 매핑 */}
        {additionalItems.map((item, index) => (
          <div key={index} className="item">
            <div>
              <img className="home_profile_img" src={item.profileImgSrc} alt="" />
            </div>
            <div className="name">{item.name}</div>
            <div className="home_place">{item.place}</div>
            <div className="dotmenu"><img className="dotmenu_icon" src="./icon/dotmenu.svg" alt="" /></div>

            <div><img className="content_img" src={item.contentImgSrc} alt="" /></div>
            <div className="comment_name">{item.name}</div>
            <div className="contents">{item.contents}</div>
            <div className="comment_num">댓글 3개 모두 보기</div>
            <div className="date">{item.date}</div>
            <div className="like">좋아요 {item.likeCount}개</div>
            <div className="home_distance">거리 {item.distance}</div>
            <div className="time">시간 {item.time}</div>

            <div className="heart"><img className="heart_icon" src="./icon/heart.svg" alt="" /></div>
            <div className="comment"><img className="comment_icon" src="./icon/comment.svg" alt="" /></div>
            <div className="save"><img className="save_icon" src="./icon/save.svg" alt="" /></div>
            <div className="share"><img className="share_icon" src="./icon/share.svg" alt="" /></div>
          </div>
        ))}
      </div>
    
    <div className="navbar">
      <Link to="/home"><div className="home"><img className="home_home_icon" src="./icon/home.svg" alt="" /></div></Link>
      <Link to="/map"><div className="map"><img className="home_map_icon" src="./icon/map.svg" alt="" /></div></Link>
      <Link to="/pause"><div className="run"><img className="home_run_icon" src="./icon/record.svg" alt="" /></div></Link>
      <Link to="/group"><div className="group"><img className="home_group_icon" src="./icon/group.svg" alt="" /></div></Link>
      <Link to="/mypage"><div className="my"><img className="home_my_icon" src="./icon/my.svg" alt="" /></div></Link>
    </div></>
    
  );
}
