import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { supabase } from '../../supabaseClient';
import { calculateBounds } from '../../utils/calculateBounds';
import { Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline } from 'react-naver-maps';

// MyMap 컴포넌트는 네이버 맵을 표시하고 경로를 그립니다.
function MyMap({ path, bounds, color }) {
  const navermaps = useNavermaps();
  return (
    <NaverMap
      bounds={bounds ? new navermaps.LatLngBounds(
        new navermaps.LatLng(bounds.south, bounds.west),
        new navermaps.LatLng(bounds.north, bounds.east)
      ) : null}
      defaultZoom={15}
      scaleControl={false}
      mapDataControl={false}
    >
      {path.length > 1 && (
        <Polyline
          path={path.map(p => new navermaps.LatLng(p.latitude, p.longitude))}
          strokeColor={color}
          strokeWeight={4}
          strokeOpacity={0.8}
          strokeStyle="solid"
        />
      )}
    </NaverMap>
  );
}

export default function ContentBox({
  profileName,    // 프로필 이름
  profileImage,   // 프로필 이미지
  location,       // 위치 정보
  contentImage,   // 콘텐츠 이미지
  contentText,    // 콘텐츠 텍스트
  createdAt,      // 생성 날짜
  userId,         // 게시물 작성자 ID
  userID,         // 현재 로그인한 사용자 ID
  postID,         // 게시물 ID
  recordId        // 워킹 기록 ID
}) {
  const [showMenu, setShowMenu] = useState(false);         // 메뉴 표시 여부 상태
  const [isLike, setIsLike] = useState(false);             // 좋아요 상태
  const [likeCount, setLikeCount] = useState(0);           // 좋아요 수
  const [commentCount, setCommentCount] = useState(0);     // 댓글 수
  const [notRecord, setNotRecord] = useState(true);        // 워킹 기록 유무 상태
  const [record, setRecord] = useState([]);                // 워킹 기록 데이터
  const [color, setColor] = useState('');                  // 경로 색상
  const [bounds, setBounds] = useState([]);                // 경로 경계

  console.log(recordId);

  // recordId가 'example'이 아니면 findRecordData 함수 호출
  useEffect(() => {
    if (recordId != 'example') {
      findRecordData();
      setNotRecord(false);
    }
  }, [recordId]);

  // 워킹 기록 데이터를 찾아오는 함수
  async function findRecordData() {
    const { data: colorData, error: colorError } = await supabase
      .from('walking_record')
      .select('color')
      .eq('walking_record_id', recordId);
    if (colorError) {
      console.error(colorError);
    }
    console.log(colorData[0].color);
    setColor(colorData[0].color);

    const { data: walkingData, error: walkingError } = await supabase
      .from('walking_record_location')
      .select('*')
      .eq('walking_record_id', recordId);
    if (walkingError) {
      console.error(walkingError);
    }
    console.log(walkingData);
    const bound = calculateBounds(walkingData);  // 경로 경계 계산
    setBounds(bound);
    setRecord(walkingData);
  }

  // 경계 변경 시 콘솔 로그 출력
  useEffect(() => {
    console.log(bounds);
  }, [bounds]);

  // 좋아요 상태, 좋아요 수, 댓글 수를 가져오는 함수들
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
      const { count, error } = await supabase
        .from('post_like')
        .select('user_id', { count: 'exact' })
        .eq('post_id', postID);

      if (error) {
        console.error("Error fetching like count:", error);
      } else {
        setLikeCount(count);
      }
    };

    const fetchCommentCount = async () => {
      const { count, error } = await supabase
        .from('comment')
        .select('comment_id', { count: 'exact' })
        .eq('post_id', postID);

      if (error) {
        console.error("Error fetching comment count:", error);
      } else {
        setCommentCount(count);
      }
    };

    fetchLikeStatus();
    fetchLikeCount();
    fetchCommentCount();
  }, [postID, userID]);

  // 메뉴 토글 함수
  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

  // 좋아요 처리 함수
  const handleIsLike = async (event) => {
    event.stopPropagation();

    if (!isLike) {
      const { error } = await supabase
        .from('post_like')
        .insert([{ post_id: postID, user_id: userID }]);
      if (error) {
        console.error("Error liking post:", error);
      } else {
        setIsLike(true);
        setLikeCount((prevCount) => prevCount + 1);
      }
    } else {
      const { error } = await supabase
        .from('post_like')
        .delete()
        .eq('post_id', postID)
        .eq('user_id', userID);
      if (error) {
        console.error("Error unliking post:", error);
      } else {
        setIsLike(false);
        setLikeCount((prevCount) => prevCount - 1);
      }
    }
  };

  // 게시물 삭제 함수
  const handlePostDelete = async () => {
    const { error } = await supabase
      .from('post')
      .delete()
      .eq('post_id', postID);
    if (error) {
      console.error("Error deleting post:", error);
    } else {
      window.location.reload(); // 삭제 후 페이지 새로고침
    }
  };

  return (
    <div className='main_content_box'>
      {/* 사용자 프로필 링크 */}
      <Link 
        className='content_top_link' 
        to={userId === userID ? "/mypage" : `/home_personal_profile/${userId}`} 
        style={{ textDecoration: 'none' }}
      >
        <div><img className='home_profile_img' src={profileImage} alt="프로필 이미지" /></div>
        <div className="name">{profileName}</div>
        <div className="home_place">{location}</div>
      </Link>
      <div className="dotmenu" onClick={handleMenuToggle}>
        <img className="dotmenu_icon" src="./icon/dotmenu.svg" alt="메뉴" />
      </div>
      {showMenu && (
        <div className="dropdown_menu">
          {userId !== userID && (
            <div className='menu_title'><img className='dropdown_icon' src="./icon/follow_minus.svg" alt="언팔로우" />팔로우 취소</div>
          )}
          {userId !== userID && (
            <div className='menu_title'><img className='dropdown_icon' src="./icon/block.svg" alt="차단" />차단</div>
          )}
          <div className='menu_title'><img className='dropdown_icon' src="./icon/hide.svg" alt="숨기기" />숨기기</div>
          <div className='menu_title'><img className='dropdown_icon' src="./icon/information.svg" alt="정보" />경로 정보</div>

          {userId === userID && (
            <div className='menu_title2' onClick={handlePostDelete}>
              <img className='dropdown_icon2' src="./icon/trash.svg" alt="삭제" />삭제
            </div>
          )}
        </div>
      )}
      <div className="content_img_box">
        {/* 워킹 기록이 없으면 이미지 표시, 있으면 지도 표시 */}
        {notRecord ? (
          <img className='content_img' src={contentImage} alt="콘텐츠 이미지" />
        ) : (
          <MapDiv className='content_img'>
            <MyMap path={record} bounds={bounds} color={color} />
          </MapDiv>
        )}
      </div>

      {/* 좋아요 버튼 */}
      <div className="heart" onClick={handleIsLike}>
        <img className="heart_icon" src={isLike ? "./icon/heart_fill_test.svg" : "./icon/heart_test.svg"} alt="하트" />
      </div>
      <Link to={`/comment/${postID}`}><div className="comment"><img className="comment_icon" src="./icon/comment.svg" alt="댓글" /></div></Link>
      <div className="share"><img className="share_icon" src="./icon/share.svg" alt="공유" /></div>

      <div className='h_save'><img className='h_save_icon' src="./icon/save.svg" alt="" /></div>
      <div className="like">좋아요 {likeCount}개</div>
      <Link 
        className="comment_name" 
        to={userId === userID ? "/mypage" : `/home_personal_profile/${userId}`} 
        style={{ textDecoration: 'none' }}
      >
        {profileName}
      </Link>
      <div className="contents">{contentText}</div>
      <Link className='comment_num_link' to={`/comment/${postID}`}><div className="comment_num">{`댓글 ${commentCount}개 모두 보기`}</div></Link>
      <div className="date">{createdAt}</div>
    </div>
  );
}
