import React, {useState, useEffect} from 'react';
import './write.css'; 
import { Link, useNavigate } from "react-router-dom";
import {supabase} from '../supabaseClient'
import {useToken} from '../context/tokenContext'


export default function Write(){
  const navigate = useNavigate();
  const [text, setText] = useState("");
  
  //로그인 사용자 user_id
  const userInfo=useToken();
  const userID=userInfo.user;

  
  const submitPost = async (e)=>{
    e.preventDefault()
    const {data: countData, error: countError, count}=await supabase   //게시글row수 카운트
      .from('post')
      .select('*',{count: 'exact'});  
    const postNumber=count+1;
    const postID = "post_"+postNumber;  
    console.log(postID)
    console.log(userID)
    // 걷기 기록 없어서 삽입 안됨
    const {data, error}=await supabase //게시글 삽입
      .from('post')
      .insert({ 
        post_id: postID,
        user_id: userID,
        walking_record_id: 'example',
        content: text,
        locate: '부산'
      });
    if (error){
      console.error(error)
    }
  }


  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  
  return (
    <div className="write-page">
      <Link to="/home"><div className="write_back"><img className='write_back_icon' src="./icon/arrow.svg" alt="" /></div></Link>
      <div className="write_title">새 게시물</div>
      <div className="write_add" onClick={submitPost}>작성</div>
      <div className="write_line1"></div>

      <div className="write_place_add">위치 추가</div>
      <div className="place_add"><img className="place_add_icon" src="./icon/arrow.svg" alt="" /></div>
      <div className="write_line2"></div>
      
      <textarea
        className="write_text"
        placeholder="나의 활동을 공유하세요!"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="write_navbar">
        <div className="picture_add"><img className="camera_icon" src="./icon/camera.svg" alt="" /></div>
        <div className="picture1"></div>
        <div className="picture2"></div>
      </div>
    </div>
  );
}


