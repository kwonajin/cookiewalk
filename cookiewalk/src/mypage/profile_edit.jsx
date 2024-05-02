import React, { useEffect, useState }  from 'react';
import './profile_edit.css'; 
import { Link } from "react-router-dom";
import {supabase} from '../supabaseClient'
import { useToken } from '../context/tokenContext'


export default function ProfileEdit() {
  
  const [name, setName]=useState('');
  const [intro, setIntro]=useState('');
  const [nickname,setNickname]=useState('');
  const [currentName, setCurrentname]=useState('');
  const [currentIntro, setCurrentIntro]=useState('');
  const [currentNickname,setCurrentNickname]=useState('');
  const userInfo=useToken();
  const userID = userInfo.user


  const User = async()=>{
    console.log(userID)
    const {data, error}=await supabase
      .from('user')
      .select('name, nick_name ,intro')
      .eq('user_id', userID)
      if (data){
        const userProfile = data[0]
        setCurrentname(userProfile.name)
        setCurrentNickname(userProfile.nick_name)
        setCurrentIntro(userProfile.intro)
      }
  }

  const checkNickname = ()=>{

  }

  
  
  
  useEffect(() => {
    window.scrollTo(0, 0);
    if(userID !=null){
      User();
    }
  }, [userID]);
  return (
    <div className="pe_background">
      <Link to="/mypage"><div className="pe_back"><img className="pe_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>
      <span className="pe_title">프로필 편집</span>
      <div className="pe_line"></div>
      <div className='pe_complete'>저장</div>


      <div className="e206_74"></div>
      <div className="e206_92"></div>
      <div className="e206_93"></div>
      <div className="e206_95"></div>


      <div className="e206_79"></div>
      <div className="e206_80"></div>
      <span className="e206_84">프로필 사진 수정</span>
      <span className="e206_85">닉네임</span>
      <span className="e206_86">닉네임</span>
      <span className="e206_87">사용자 이름</span>
      <span className="e206_88">소개</span>
      {/* <span className="e206_89">{currentNickname}</span> */}
      <input type="text" className='e206_89' name="nickname" vlaue={nickname} onChange={(e)=> setNickname(e.target.value)} placeholder={currentNickname}></input>
      {/* <span className="e206_90">{currentName}</span> */}
      <input type="text" className='e206_89' name="name" vlaue={name} onChange={(e)=> setName(e.target.value)} placeholder={currentName}></input>
      {/* <span className="e206_91">{currentIntro}</span> */}
      <input type="text" className='e206_89' name="name" vlaue={intro} onChange={(e)=> setIntro(e.target.value)} placeholder={currentIntro}></input>
    </div>
  );
}

