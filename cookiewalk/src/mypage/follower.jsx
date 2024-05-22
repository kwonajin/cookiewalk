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

  // Fetch user email by userID
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
      console.error('Error fetching user email:', error);
    }
  };

  // Fetch follower list by userEmail
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
      console.error('Error fetching follower list:', error);
    }
  };

  // Fetch additional user info by email
  const getUserInfo = async (email) => {
    try {
      const { data, error } = await supabase
        .from('user')
        .select('name, nick_name, profile_image')
        .eq('email', email)
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error fetching user info:', error);
      return {};
    }
  };

  // Check if user is following the target email
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
      console.error("Error checking follow status", error);
      return false;
    }
  };

  // Handle follow/unfollow button click
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
      console.error("Error toggling follow status", error);
    }
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
            <img className="friend_back_icon" src="./icon/arrow.svg" alt="Back" />
          </div>
        </Link>
        <div className="follower_title">팔로워</div>
        <div className="follower_line1"></div>
      </div>

      <input type='text' className="follower_searchbar" placeholder='검색'></input>
      {/* <span className="follower_searchbar_text" ></span> */}
      <div className="follower_search">
        <img className="follower_search_icon" src="./icon/search.svg" alt="Search" />
      </div>

      {followerList.map((follower, index) => (
        <div key={index} className={`follower${index + 1}`}>
          <img className={`follower${index + 1}_profile`} src={follower.profile_image} alt={`${follower.nick_name}'s profile`} />
          <div className={`follower${index + 1}_text`}>
            <div className={`follower${index + 1}_id`}>{follower.nick_name}</div>
            <div className={`follower${index + 1}_name`}>{follower.name}</div>
          </div>
          <button 
            className={`follower${index + 1}_follow ${follower.isFollowing ? 'following' : 'not-following'}`} 
            onClick={() => handleFollowClick(userEmail, follower.following_email, index)}
          >
            {follower.isFollowing ? "팔로잉" : "팔로우"}
          </button>
          <div className={`follower${index + 1}_line`}></div>
        </div>
      ))}
    </div>
  );
}
