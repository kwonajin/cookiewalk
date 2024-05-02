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
    
      <NavBar></NavBar>
    </>
    
  );
}
