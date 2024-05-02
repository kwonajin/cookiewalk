import React, { useEffect }  from 'react';
import './home.css'; // CSS 파일을 import 합니다.
import { Link , useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient';
import HomeNav from './home/HomeNav';
import Active from './home/Active';
import ContentBox from './home/ConentBox';
import NavBar from './home/NavBar';
import { useToken } from '../context/tokenContext';

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
    <>
    <div className="home_background">
      <div className="topnav">
        <HomeNav></HomeNav>
        <Active></Active>
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
    
    <div className="navbar">
      <Link to="/home"><div className="home"><img className="home_home_icon" src="./icon/home.svg" alt="" /></div></Link>
      <Link to="/map"><div className="map"><img className="home_map_icon" src="./icon/map.svg" alt="" /></div></Link>
      <Link to="/BeforeStart"><div className="run"><img className="home_run_icon" src="./icon/record.svg" alt="" /></div></Link>
      <Link to="/group"><div className="group"><img className="home_group_icon" src="./icon/group.svg" alt="" /></div></Link>
      <Link to="/mypage"><div className="my"><img className="home_my_icon" src="./icon/my.svg" alt="" /></div></Link>
    </div></>
    
  );
}
