import { useState } from 'react';
import { supabase } from "../../supabaseClient"
import { Link, useParams} from "react-router-dom"
import { useContext } from 'react';
import mainContext from '../../context/MainContext';

export default function ContentBox({
  profileName,
  profileImage,
  location,
  likes,
  contentImage,
  contentText,
  createdAt,
  userId
}) {
    const [showMenu, setShowMenu] = useState(false); // 상태 추가

    const handleMenuToggle = () => {
        setShowMenu(!showMenu); // 메뉴 보이기/숨기기 토글
    };

    return(
      <div className='main_content_box'>
        <Link to={`/home_personal_profile/${userId}`} style={{ textDecoration: 'none' }}>
          <div><img className='home_profile_img' src={profileImage}/></div>
          <div className="name">{profileName}</div>
          <div className="home_place">{location}</div>
        </Link> 
        <div className="dotmenu" onClick={handleMenuToggle}><img className="dotmenu_icon" src="./icon/dotmenu.svg" alt="" /></div>
        {showMenu && ( // 메뉴가 보이는 경우에만 렌더링
          <div className="dropdown_menu">
            <div className='menu_title'><img className='dropdown_icon' src="./icon/follow_minus.svg" alt="" />팔로우 취소</div>
            <div className='menu_title'><img className='dropdown_icon' src="./icon/block.svg" alt="" />차단</div>
            <div className='menu_title'><img className='dropdown_icon' src="./icon/hide.svg" alt="" />숨기기</div>
            <div className='menu_title2'><img className='dropdown_icon2' src="./icon/trash.svg" alt="" />삭제</div>
          </div>
        )}
        <div className="content_img_box"><img className='content_img' src={contentImage}/></div>
        <div className="comment_name">{profileName}</div>
        <div className="contents">{contentText}</div>
        <div className="comment_num">댓글 3개 모두 보기</div>
        <div className="date">{createdAt}</div>
        <div className="like">좋아요 {likes}개</div>

        <div className="heart"><img className="heart_icon" src="./icon/heart.svg" alt="" /></div>
        <div className="comment"><img className="comment_icon" src="./icon/comment.svg" alt="" /></div>
        <div className="share"><img className="share_icon" src="./icon/share.svg" alt="" /></div>
      </div>
    )
}
