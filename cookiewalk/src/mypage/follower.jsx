import React, { useEffect, useState } from 'react';
import './follower.css';
import { Link } from "react-router-dom";
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext';
import Follower_list from './follow_list/follower_list';

export default function Follower() {
  const userInfo = useToken();
  const userID = userInfo.user;
  const [userEmail, setUserEmail] = useState(null);
  const [followerList, setFollowerList] = useState([]);

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

  // userID로 사용자 이메일 가져오기
  const getUserEmail = async (userID) => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('email')
        .eq('user_id', userID)
        .single();

      if (error) throw error;
      setUserEmail(data.email);
    } catch (error) {
      console.error('사용자 이메일을 가져오는 중 오류 발생:', error);
    }
  };

  // userEmail로 팔로워 목록 가져오기
  const getFollowerList = async (userEmail) => {
    try {
      const { data, error } = await supabase
        .from("follows")
        .select("following_email")
        .eq("target_email", userEmail)
        .order("followdate", { ascending: true });

      if (error) throw error;

      const followers = await Promise.all(data.map(async (follower) => {
        const userData = await getUserInfo(follower.following_email);
        return { ...follower, ...userData, isFollowing: await checkIsFollowing(userEmail, follower.following_email) };
      }));
      setFollowerList(followers);
    } catch (error) {
      console.error('팔로워 목록을 가져오는 중 오류 발생:', error);
    }
  };

  // 이메일로 추가 사용자 정보 가져오기
  const getUserInfo = async (email) => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('name, nick_name, profile_image, user_id')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('사용자 정보를 가져오는 중 오류 발생:', error);
      return {};
    }
  };

  // 사용자가 대상 이메일을 팔로우 중인지 확인
  const checkIsFollowing = async (userEmail, targetEmail) => {
    try {
      const { count, error } = await supabase
        .from("follows")
        .select("*", { count: "exact" })
        .eq('following_email', userEmail)
        .eq('target_email', targetEmail);

      if (error) throw error;
      return count > 0;
    } catch (error) {
      console.error("팔로우 상태를 확인하는 중 오류 발생", error);
      return false;
    }
  };

  // 팔로우/언팔로우 버튼 클릭 처리
  const handleFollowClick = async (userEmail, targetEmail, index) => {
    try {
      if (followerList[index].isFollowing) {
        const { error } = await supabase
          .from("follows")
          .delete()
          .eq("following_email", userEmail)
          .eq("target_email", targetEmail);

        if (error) throw error;
      } else {
        const { error } = await supabase
          .from("follows")
          .insert([{ following_email: userEmail, target_email: targetEmail }]);

        if (error) throw error;
      }

      const updatedFollowerList = [...followerList];
      updatedFollowerList[index].isFollowing = !updatedFollowerList[index].isFollowing;
      setFollowerList(updatedFollowerList);
    } catch (error) {
      console.error("팔로우 상태를 전환하는 중 오류 발생", error);
    }
  };

  return (
    <div className="follower_background">
      <div className='followernav'>
        <Link to="/mypage">
          <div className="follower_back">
            <img className="friend_back_icon" src="./icon/arrow.svg" alt="Back" />
          </div>
        </Link>
        <div className="follower_title">팔로워</div>
        <div className="follower_line1"></div>
      </div>

      <input type='text' className="follower_searchbar" placeholder='검색'></input>
      <div className="follower_search">
        <img className="follower_search_icon" src="./icon/search.svg" alt="Search" />
      </div>

      {followerList.map((follower, index) => (
        <Follower_list
          key={follower.user_id}
          follower={follower}
          userEmail={userEmail}
          index={index}
          handleFollowClick={handleFollowClick}
        />
      ))}
    </div>
  );
}
