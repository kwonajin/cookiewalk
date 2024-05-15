import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { supabase } from '../../supabaseClient';

export default function ContentBox({
  profileName,
  profileImage,
  location,
  contentImage,
  contentText,
  createdAt,
  userId,
  userID,
  postID
}) {
    const [showMenu, setShowMenu] = useState(false);
    const [isLike, setIsLike] = useState(false);
    const [likeCount, setLikeCount] = useState(0); // 좋아요 수 상태 초기화

    useEffect(() => {
        const fetchLikeStatus = async () => {
            const { data, error } = await supabase
                .from('post_like')
                .select('*')
                .eq('post_id', postID)
                .eq('user_id', userID);

            if (data && data.length > 0) {
                setIsLike(true);
            } else {
                setIsLike(false);
            }

            if (error) {
                console.error("Error fetching like status:", error);
            }
        };

        const fetchLikeCount = async () => {
            const { data, error } = await supabase
                .from('post_like')
                .select('user_id', { count: 'exact' })
                .eq('post_id', postID);

            if (data) {
                setLikeCount(data.length);
            }

            if (error) {
                console.error("Error fetching like count:", error);
            }
        };

        fetchLikeStatus();
        fetchLikeCount();
    }, [postID, userID]);

    const handleMenuToggle = () => {
        setShowMenu(!showMenu);
    };

    const handleIsLike = async (event) => {
        event.stopPropagation();
        setIsLike(!isLike);

        if (!isLike) {
            const { error } = await supabase
                .from('post_like')
                .insert([{ post_id: postID, user_id: userID }]);
            if (error) {
                console.error("Error liking post:", error);
                setIsLike(!isLike); // 에러 시 상태 되돌리기
            } else {
                setLikeCount(likeCount + 1); // 좋아요 수 증가
            }
        } else {
            const { error } = await supabase
                .from('post_like')
                .delete()
                .eq('post_id', postID)
                .eq('user_id', userID);
            if (error) {
                console.error("Error unliking post:", error);
                setIsLike(!isLike); // 에러 시 상태 되돌리기
            } else {
                setLikeCount(likeCount - 1); // 좋아요 수 감소
            }
        }
    };

    return (
      <div className='main_content_box'>
        <Link to={`/home_personal_profile/${userId}`} style={{ textDecoration: 'none' }}>
          <div><img className='home_profile_img' src={profileImage} alt="프로필 이미지"/></div>
          <div className="name">{profileName}</div>
          <div className="home_place">{location}</div>
        </Link> 
        <div className="dotmenu" onClick={handleMenuToggle}>
          <img className="dotmenu_icon" src="./icon/dotmenu.svg" alt="메뉴"/>
        </div>
        {showMenu && (
          <div className="dropdown_menu">
            <div className='menu_title'><img className='dropdown_icon' src="./icon/follow_minus.svg" alt="언팔로우"/>팔로우 취소</div>
            <div className='menu_title'><img className='dropdown_icon' src="./icon/block.svg" alt="차단"/>차단</div>
            <div className='menu_title'><img className='dropdown_icon' src="./icon/hide.svg" alt="숨기기"/>숨기기</div>
            <div className='menu_title2'><img className='dropdown_icon2' src="./icon/trash.svg" alt="삭제"/>삭제</div>
          </div>
        )}
        <div className="content_img_box"><img className='content_img' src={contentImage} alt="콘텐츠 이미지"/></div>
        <div className="comment_name">{profileName}</div>
        <div className="contents">{contentText}</div>
        <div className="comment_num">댓글 3개 모두 보기</div>
        <div className="date">{createdAt}</div>
        <div className="like">좋아요 {likeCount}개</div>

        <div className="heart" onClick={handleIsLike}>
          <img className="heart_icon" src={isLike ? "./icon/heart_fill.svg" : "./icon/heart.svg"} alt="하트"
           style={{ color: isLike ? 'red' : 'black' }} />
        </div>
        <div className="comment"><img className="comment_icon" src="./icon/comment.svg" alt="댓글"/></div>
        <div className="share"><img className="share_icon" src="./icon/share.svg" alt="공유"/></div>
      </div>
    );
}
