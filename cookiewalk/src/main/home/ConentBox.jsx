import { useState } from 'react';
import { supabase } from "../../supabaseClient"
import { Link } from "react-router-dom"

export default function ContentBox() {
    const [showMenu, setShowMenu] = useState(false); // 상태 추가

    const handleMenuToggle = () => {
        setShowMenu(!showMenu); // 메뉴 보이기/숨기기 토글
    };

    return(
      <div className='content_box'>
        <Link to="/home_personal_profile" style={{ textDecoration: 'none' }}>
          <div><img className='home_profile_img' src='./images/ellipse_7.png'/></div>
          <div className="name">running_go</div>
          <div className="home_place">부산 광안리</div>
        </Link>
        <div className="dotmenu" onClick={handleMenuToggle}><img className="dotmenu_icon" src="./icon/dotmenu.svg" alt="" /></div>
        {showMenu && ( // 메뉴가 보이는 경우에만 렌더링
          <div className="dropdown_menu">
            <div>팔로우 취소</div>
            <div>차단</div>
            <div>숨기기</div>
          </div>
        )}
        <div className=""><img className='content_img' src='./images/rectangle_2.png'/></div>
        <div className="comment_name">running_go</div>
        <div className="contents">오랜만에 모닝 러닝한 날🌄👟 오랜만에 모닝 러닝한 날🌄👟오랜만에 모닝 러닝한 날🌄👟 오랜만에 모닝 러닝한 날🌄👟오랜만에 모닝 러닝한 날🌄👟 오랜만에 모닝 러닝한 날🌄👟</div>
        <div className="comment_num">댓글 3개 모두 보기</div>
        <div className="date">4월 13일</div>
        <div className="like">좋아요 129개</div>

        <div className="heart"><img className="heart_icon" src="./icon/heart.svg" alt="" /></div>
        <div className="comment"><img className="comment_icon" src="./icon/comment.svg" alt="" /></div>
        <div className="share"><img className="share_icon" src="./icon/share.svg" alt="" /></div>
      </div>
    )
}
