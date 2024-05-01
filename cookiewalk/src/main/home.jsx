import './home.css'; // CSS 파일을 import 합니다.
import { Link } from "react-router-dom";
import { supabase } from '../supabaseClient';
import HomeNav from './home/HomeNav';
import Active from './home/Active';
import ContentBox from './home/ConentBox';
import NavBar from './home/NavBar';

export default function Home() {
  return (
    <>
    <div className="home_background">
      <div className="topnav">
        <HomeNav></HomeNav>
        <Active></Active>
      </div>

     <ContentBox></ContentBox>

    </div>
    
      <NavBar></NavBar>
    </>
    
  );
}
