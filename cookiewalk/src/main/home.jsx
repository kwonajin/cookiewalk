import React, { useEffect }  from 'react';
import './home.css'; // CSS 파일을 import 합니다.
import { Link , useNavigate } from "react-router-dom";
import { useToken } from '../context/tokenContext';
import HomeNav from './home/HomeNav';
import Active from './home/Active';
import ContentBox from './home/ConentBox';
import NavBar from './home/NavBar';
import { supabase } from '../supabaseClient';


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

  
  return (
    <><div className="home_background">
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

     <ContentBox></ContentBox>
     <ContentBox></ContentBox>
     <ContentBox></ContentBox>
     <ContentBox></ContentBox>
     <ContentBox></ContentBox>
     <ContentBox></ContentBox>
     <ContentBox></ContentBox>
     <ContentBox></ContentBox>
     <ContentBox></ContentBox>



    </div>
    
    <NavBar></NavBar>
    </>
  );
}