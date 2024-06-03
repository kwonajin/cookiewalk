import React, { useEffect, useState } from 'react';
import './following.css';
import { Link } from "react-router-dom";
import { useToken } from '../context/tokenContext';
import { supabase } from '../supabaseClient';

export default function Following() {
  const userInfo = useToken();
  const userID = userInfo.user;
  const [followingList, setFollowingList] = useState([]);

  async function getFollowingList(userID) {
    const { data: userEmailData, error: userEmailError } = await supabase
      .from('user')
      .select('email')
      .eq('user_id', userID)
      .single();

    if (userEmailError) {
      console.error("getFollowingList 에러", userEmailError);
      return;
    }

    const userEmail = userEmailData.email;

    const { data, error } = await supabase
      .from("follows")
      .select(`
        user:target_email (
          user_id,
          email,
          name,
          nick_name,
          profile_image
        )
      `)
      .eq('following_email', userEmail)
      .order('followdate');

    if (error) {
      console.error("getFollowingList 에러", error);
    } else {
      setFollowingList(data);
    }
  }

  console.log("팔로잉 리스트", followingList);

  useEffect(() => {
    window.scrollTo(0, 0);
    getFollowingList(userID);
  }, [userID]);

  const handleFollowClick = async (userId, nickName, email) => {
    const confirmation = window.confirm(`${nickName} 님의 팔로우를 취소하시겠습니까?`);
    if (confirmation) {
      const { data: userEmailData, error: userEmailError } = await supabase
        .from('user')
        .select('email')
        .eq('user_id', userID)
        .single();

      if (userEmailError) {
        console.error("handleFollowClick 에러", userEmailError);
        return;
      }

      const userEmail = userEmailData.email;

      const { error } = await supabase
        .from('follows')
        .delete()
        .eq('following_email', userEmail)
        .eq('target_email', email);

      if (error) {
        console.error("handleFollowClick 에러", error);
      } else {
        setFollowingList(prevList => prevList.filter(item => item.user.user_id !== userId));
      }
    }
  };

  return (
    <div className="following_background">
      <div className='followingnav'>
        <Link to="/mypage">
          <div className="following_back">
            <img className="friend_back_icon" src="./icon/arrow.svg" alt="" />
          </div>
        </Link>
        <div className="following_title">팔로잉</div>
        <div className="following_line1"></div>
      </div>

      <input type='text' className="following_searchbar" placeholder='검색'></input>
      <div className="following_search">
        <img className="following_search_icon" src="./icon/search.svg" alt="" />
      </div>

      {followingList.map((item, index) => (
        <div className="following1" key={index}>
          <Link to={`/home_personal_profile/${item.user.user_id}`}>
            <img className="following1_profile" src={item.user.profile_image || "./images/ellipse_11.png"} alt="" />
            <div className="following1_text">
              <div className="following1_id">{item.user.nick_name}</div>
              <div className="following1_name">{item.user.name}</div>
            </div>
          </Link>
          <button
            className="following1_follow following"
            onClick={() => handleFollowClick(item.user.user_id, item.user.nick_name, item.user.email)}>
            팔로잉
          </button>
          <div className="following1_line"></div>
        </div>
      ))}
    </div>
  );
}
