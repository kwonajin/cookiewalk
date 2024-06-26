import React, { useEffect, useState } from 'react';
import './home_personal_profile.css';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { supabase } from '../supabaseClient'; // Supabase 클라이언트
import { useToken } from '../context/tokenContext';

export default function HomePersonalProfile() {
  const userInfo = useToken();
  const userID = userInfo.user;
  const { userId } = useParams(); // URL에서 userId 추출
  const [isFollowing, setIsFollowing] = useState(false); // 팔로우 상태를 관리합니다.
  const navigate = useNavigate(); // useNavigate를 사용하여 navigate 함수를 가져옵니다. 
  const [userData, setUserData] = useState(null); // 초기 상태를 null로 설정
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [userEmail, setUserEmail] = useState(null); // 사용자 user 이메일
  const [targetEmail, setTargetEmail] = useState(null);
  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  // user 이메일 조회 
  const getUserEmail = async (userID) => {
    const { data, error } = await supabase
      .from('user')
      .select('email')
      .eq('user_id', userID)
      .single(); // userID가 고유하므로 단일 기록을 반환하도록 함

    if (error) {
      console.error('Error fetching user email:', error);
      return;
    }

    setUserEmail(data.email);
  };

  // target 이메일 조회
  const getTargetEmail = async (targetID) => {
    const { data, error } = await supabase
      .from('user')
      .select('email')
      .eq('user_id', targetID)
      .single(); // targetID가 고유하므로 단일 기록을 반환하도록 함

    if (error) {
      console.error('Error fetching target email:', error);
      return;
    }

    setTargetEmail(data.email);
  };

  // 팔로우 상태 조회
  const checkIsFollowing = async (userEmail, targetEmail) => {
    const { count: isFollowing, error } = await supabase
      .from("follows")
      .select("*", { count: "exact" })
      .eq('following_email', userEmail)
      .eq('target_email', targetEmail);

    if (error) {
      console.error("오류 발생", error);
      return;
    }

    setIsFollowing(isFollowing > 0);
  };

  // 팔로우, 팔로워 정보 가져오기
  const followInfo = async() => {
    const { count: follower, error: followerError } = await supabase
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('target_email', targetEmail);

    if (followerError) {
      console.error('오류발생', followerError);
      return;
    }

    setFollowerCount(follower);

    const { count: following, error: followingError } = await supabase
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('following_email', targetEmail);

    if (followingError) {
      console.error('오류발생', followingError);
      return;
    }

    setFollowingCount(following);
  };

  const handleFollowClick = async () => {
    if (isFollowing) {
      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('following_email', userEmail)
        .eq('target_email', targetEmail);

      if (error) {
        console.error('Error unfollowing user:', error);
        return;
      }

      setIsFollowing(false);
    } else {
      const { error } = await supabase
        .from('follows')
        .insert([{ following_email: userEmail, target_email: targetEmail }]);

      if (error) {
        console.error('Error following user:', error);
        return;
      }

      setIsFollowing(true);
    }

    // 팔로우 상태가 변경된 후 팔로워 정보 갱신
    followInfo();
  };

  const handleGoBack = () => {
    navigate(-1); // navigate 함수를 사용하여 이전 페이지로 이동합니다.
  };

  async function fetchUserData(userId) {
    try {
      const { data, error } = await supabase
        .from('user')
        .select("nick_name, profile_image, intro,post  (post_id, image, created_at)")
        .eq('user_id', userId)
        .order('created_at', { foreignTable: 'post', ascending: false }); // Add this line to sort by created_at

      if (error) throw error;
      setUserData(data); // 직접 새 데이터를 상태로 설정
      setLoading(false); // 로딩 상태 업데이트
    } catch (error) {
      console.error('Error fetching data:', error);
      setLoading(false); // 에러 발생 시 로딩 상태 업데이트
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0);
    fetchUserData(userId);
    getUserEmail(userID);
    getTargetEmail(userId);
  }, [userId, userID]); // 의존성 배열에 userID를 추가

  useEffect(() => {
    if (userEmail && targetEmail) {
      checkIsFollowing(userEmail, targetEmail);
      followInfo();
    }
  }, [userEmail, targetEmail]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!userData || userData.length === 0) {
    return <div>No data found for user.</div>;
  }

  const { nick_name, profile_image, intro, post } = userData[0];
  console.log("포스트", post);

  return (
    <>
      <div className="hpp_background">
        <div className='hppnav'>
          <div className="hpp_back" onClick={handleGoBack}>
            <img className="hpp_back_icon" src="/icon/arrow.svg" alt="" />
          </div>
          <div className="hpp_user_id">{nick_name}</div>
          <div className="hpp_line"></div>
        </div>

        <div><img className="h_profile_img" src={profile_image} alt="" /></div>
        <div className="hpp_total_distance_num">78km</div>
        <div className="hpp_total_distance">총거리</div>
        <div className="hpp_follower_num">{followerCount}</div>
        <div className="hpp_follower">팔로워</div>
        <div className="hpp_following_num">{followingCount}</div>
        <div className="hpp_following">팔로잉</div>
        <div className="hpp_user_name">{nick_name}</div>
        <div className="hpp_introduction">{intro}</div>

        <button className={`hpp_follow_box ${isFollowing ? 'hpp_following_box' : ''}`} onClick={handleFollowClick}>
          {isFollowing ? '팔로잉' : '팔로우'}
        </button>
        <div className='postBox'>
          {post.map((postItem) => (
            <div key={postItem.post_id}><img src={postItem.image} alt="" /></div>
          ))}
        </div>
      </div>

      <div className="navbar">
        <Link to="/home"><div className="home"><img className="my_home_icon" src="../../icon/home.svg" alt="" /></div></Link>
        <Link to="/map"><div className="map"><img className="my_map_icon" src="../../icon/map.svg" alt="" /></div></Link>
        <Link to="/Beforestart"><div className="run"><img className="my_run_icon" src="../../icon/record.svg" alt="" /></div></Link>
        <Link to="/group"><div className="group"><img className="my_group_icon" src="../../icon/group.svg" alt="" /></div></Link>
        <Link to="/mypage"><div className="my"><img className="my_my_icon" src="../../icon/my.svg" alt="" /></div></Link>
      </div>
    </>
  );
}
