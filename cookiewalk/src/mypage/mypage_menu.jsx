import React from 'react';
import { Link } from 'react-router-dom';
import './mypage_menu.css'

export default function MypageMenu() {
  return (
    <div className="mm_background">

      <div className="mm_back"><img className="mm_back_icon" src="./icon/arrow.svg" alt="" /></div>
      <span className="mm_title">설정 및 활동</span>
      <div className="mm_line"></div>

      <span className="menu1">계정 및 앱 설정</span>
      <div className="account"><img className='account_icon' src="./icon/profile.svg" alt="" /></div>
      <span className="account_info">계정 정보</span>
      <div className="go1"><img className='go1_icon' src="./icon/arrow.svg" alt="" /></div>
      <div className="e227_25"></div>
      <div className="e228_6">
        <div className="e228_7"></div>
      </div>
      <span className="e227_53">다크모드</span>
      <div className="e231_13"></div>
      <div className="e227_28"></div>

      <span className="e227_27">내활동 관리</span>
      <div className="e227_55">
        <div className="e227_56"></div>
      </div>
      <span className="e227_54">저장한 게시물</span>
      <div className="e227_43">
        <div className="e227_44"></div>
      </div>
      <div className="e227_30"></div>
      <div className="e228_9">
        <div className="e228_10"></div>
      </div>
      <span className="e228_8">좋아요한 게시물</span>
      <div className="e227_45">
        <div className="e227_46"></div>
      </div>
      <div className="e227_31"></div>
      <div className="e228_13">
        <div className="e228_14"></div>
      </div>
      <span className="e228_15">댓글단 게시물</span>
      <div className="e227_47">
        <div className="e227_48"></div>
      </div>
      <div className="e227_32"></div>
      <div className="e228_16">
        <div className="e228_17"></div>
      </div>
      <span className="e228_18">차단한 사용자</span>
      <div className="e227_49">
        <div className="e227_50"></div>
      </div>
      <div className="e227_34"></div>

      <span className="e227_35">더많은 지원</span>
      <div className="e230_8">
        <div className="e230_9"></div>
      </div>
      <span className="e229_2">정보</span>
      <div className="e229_5">
        <div className="e229_6"></div>
      </div>

      <div className="e227_37"></div>

      <span className="e227_38">로그인 관리</span>
      <span className="e229_7">로그아웃</span>

    </div>
  );
}
