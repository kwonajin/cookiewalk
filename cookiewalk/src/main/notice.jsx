import React, { useEffect }  from 'react';
import './notice.css'; 
import { Link } from "react-router-dom";

export default function Notice() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  
  return (
    <div className="notice-page">

      <div className="noticenav">
        <Link to="/home"><div className="notice_back"><img className='notice_back_icon' src="./icon/arrow.svg" alt="" /></div></Link>
        <div className="notice_title">알림</div>
        <div className="notice_line1"></div>
      </div>

      <div className="notice1">
          <img className='notice1_profile' src="./images/ellipse_11.png" alt="" />
          <div className="notice1_text">good_running_day님이 회원의 게시물을 좋아합니다.</div>
          <img className="notice1_content_img" src="./images/rectangle_2.png" alt="" />
        <div className="notice1_line"></div>
      </div>
      
      <div className="notice2">
        <img className='notice2_profile' src="./images/ellipse_11.png" alt="" />
          <div className="notice2_text">good_running_day님이 회원의 게시물에 댓글을 남겼습니다.</div>
          <img className="notice2_content_img" src="./images/rectangle_2.png" alt="" />
        <div className="notice2_line"></div>
      </div>


      <div className="notice3">
          <img className="notice3_profile" src="./images/ellipse_11.png" alt="" />
          <div className="notice3_text">good_running_day님이 회원님을 팔로우하기 시작했습니다.</div>
        <div className="notice3_following">
          <div className="notice3_following_text">팔로잉</div>
        </div>
        <div className="notice3_line"></div>
      </div>

      <div className="notice4">
      <img className='notice4_profile' src="./images/ellipse_11.png" alt="" />
          <div className="notice4_text">good_running_day님이 회원님을 팔로우하기 시작했습니다.</div>
        <div className="notice4_following">
          <div className="notice4_following_text">팔로우</div>
        </div>
        <div className="notice4_line"></div>
      </div>


    </div>
  );
};
