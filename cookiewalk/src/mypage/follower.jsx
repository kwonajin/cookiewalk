import React, { useEffect, useState } from 'react';
import './follower.css';
import { Link } from "react-router-dom";
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext';

export default function Follower() {
  const userInfo = useToken();
  const userID = userInfo.user;
  const [userEmail, setUserEmail] = useState(null);
  const [followerList, setFollowerList] = useState([]);
  

  // 유저 이메일 조회
  const getUserEmail = async (userID) => {
    const { data, error } = await supabase
      .from('user')
      .select('email')
      .eq('user_id', userID)
      .single();

    if (error) {
      console.error('Error fetching user email:', error);
      return;
    }

    setUserEmail(data.email);
  };

  // 팔로워 리스트 조회
  const getFollowerList = async (userEmail) => {
    const { data, error } = await supabase
      .from("follows")
      .select("following_email")
      .eq("target_email", userEmail)
      .order("followdate", { ascending: true });

    if (error) {
      console.error('Error fetching follower list:', error);
    } else {
      const followers = await Promise.all(data.map(async (follower) => {
        const userData = await getUserInfo(follower.following_email);
        return { ...follower, ...userData };
      }));
      setFollowerList(followers);
    }
  };

  // 팔로워 추가 정보 조회
  const getUserInfo = async (email) => {
    const { data, error } = await supabase
      .from('user')
      .select('name, nick_name, profile_image')
      .eq('email', email)
      .single();

    if (error) {
      console.error('Error fetching user info:', error);
      return {};
    }

    return data;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userID) {
      getUserEmail(userID);
    }
  }, [userID]);

  useEffect(() => {
    if (userEmail) {
      getFollowerList(userEmail);
    }
  }, [userEmail]);

  return (
    <div className="follower_background">
      <div className='followernav'>
        <Link to="/mypage">
          <div className="follower_back">
            <img className="friend_back_icon" src="./icon/arrow.svg" alt="" />
          </div>
        </Link>
        <div className="follower_tilte">팔로워</div>
        <div className="follower_line1"></div>
      </div>

      <div className="follower_searchbar"></div>
      <span className="follower_searchbar_text">검색</span>
      <div className="follower_search">
        <img className="follower_search_icon" src="./icon/search.svg" alt="" />
      </div>

      {followerList.map((follower, index) => (
        <div key={index} className={`follower${index + 1}`}>
          <img className={`follower${index + 1}_profile`} src={follower.profile_image} alt="" />
          <div className={`follower${index + 1}_text`}>
            <div className={`follower${index + 1}_id`}>{follower.nick_name}</div>
            <div className={`follower${index + 1}_name`}>{follower.name}</div>
          </div>
          <div className={`follower${index + 1}_follow`}></div>
          <div className={`follower${index + 1}_follow_text`}>팔로우</div>
          <div className={`follower${index + 1}_line`}></div>
        </div>
      ))}
    </div>
  );
}
