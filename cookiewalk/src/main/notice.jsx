import React from 'react';
import './notice.css'; 
import { Link } from "react-router-dom";

export default function Notice() {
  return (
    <div className="notice-page">

      <div className="noticenav">
        <Link to="/home"><div className="notice_back"><img className='notice_back_icon' src="./icon/arrow.svg" alt="" /></div></Link>
        <div className="notice_title">알림</div>
        <div className="notice_line1"></div>
      </div>

      <div className="e158_220">
        <div className="e158_215">
          <div className="e158_216"></div>
          <div className="e158_217"></div>
          <span className="e158_218">good_running_day님이 회원의 게시물을 좋아합니다.</span>
          <div className="e158_219"></div>
        </div>
        <div className="e155_36"></div>
      </div>
      <div className="e158_221">
        <div className="e158_223"></div>
        <div className="e158_229">
          <div className="e158_231"></div>
          <span className="e158_232">good_running_day님이 회원의 게시물에 댓글을 남겼습니다.</span>
          <div className="e158_233"></div>
        </div>
        <div className="e158_234"></div>
      </div>
      <div className="e158_235">
        <div className="e158_243">
          <div className="e158_244"></div>
          <div className="e158_245"></div>
        </div>
        <div className="e158_248"></div>
        <div className="e158_267">
          <div className="e155_47"></div>
          <span className="e155_50">팔로잉</span>
        </div>
      </div>
      <div className="e158_249">
        <div className="e158_257">
          <div className="e158_258"></div>
          <div className="e158_259"></div>
        </div>
        <div className="e158_262"></div>
        <div className="e158_266">
          <div className="e155_54"></div>
          <span className="e155_55">팔로우</span>
        </div>
        <div className="e158_293"><span className="e158_295">팔로우</span></div>
      </div>
      <span className="e155_53">good_running_day님이 회원님을 팔로우하기 시작했습니다.</span>
      <span className="e155_46">good_running_day님이 회원님을 팔로우하기 시작했습니다.</span>
    </div>
  );
};
