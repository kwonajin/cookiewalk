import React, { useEffect }  from 'react';
import './profile_edit.css'; 
import { Link } from "react-router-dom";

export default function ProfileEdit() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
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
      <span className="e206_89">닉네임</span>
      <span className="e206_90">사용자 이름</span>
      <span className="e206_91">소개</span>
    </div>
  );
}

