import { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { supabase } from '../../supabaseClient';
import { calculateBounds } from '../../utils/calculateBounds';
import { Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline } from 'react-naver-maps';

function MyMap({ path, bounds , color}) {
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
  profileName,
  profileImage,
  location,
  contentImage,
  contentText,
  createdAt,
  userId,
  userID,
  postID,
  recordId
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [isLike, setIsLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [commentCount, setCommentCount] = useState(0);
  const [notRecord, setNotRecord]=useState(true)
  const [record, setRecord]=useState([])
  const [color,setColor]=useState('')
  const [bounds,setBounds]=useState([])

  console.log(recordId)
  useEffect(()=>{
    if(recordId != 'example'){
      findRecordData()
      setNotRecord(false)
    }
  },[recordId])

  async function findRecordData(){
    const {data:colorData, error:colorError}=await supabase
      .from('walking_record')
      .select('color')
      .eq('walking_record_id', recordId)
    if(colorError){
      console.error(colorError)
    }
    console.log(colorData[0].color)
    setColor(colorData[0].color)

    const {data: walkingData , error:walkingError}=await supabase
      .from('walking_record_location')
      .select('*')
      .eq('walking_record_id', recordId)
    if(walkingError){
      console.error(walkingError)
    }
    console.log(walkingData)
    const bound= calculateBounds(walkingData)
    setBounds(bound)
    setRecord(walkingData)

  }
  useEffect(()=>{
    console.log(bounds)
  },[bounds])

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

  const handleMenuToggle = () => {
    setShowMenu(!showMenu);
  };

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

  const handlePostDelete = async () => {
    const { error } = await supabase
      .from('post')
      .delete()
      .eq('post_id', postID);
    if (error) {
      console.error("Error deleting post:", error);
    } else {
      window.location.reload();
    }
  };

  return (
    <div className='main_content_box'>
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
{/*       
      <div className="content_img_box"><img className='content_img' src={contentImage} alt="콘텐츠 이미지" /></div>
      <MapDiv className='content_img_box'><MyMap path={record} bounds={bounds} color={color}/></MapDiv> */}
      <div className="content_img_box">
      {notRecord ? (
        <img className='content_img' src={contentImage} alt="콘텐츠 이미지" />
      ) : (
        <MapDiv className='content_img'>
          <MyMap path={record} bounds={bounds} color={color} />
        </MapDiv>
      )}
      </div>

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
