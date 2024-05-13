import React, { useEffect, useState } from 'react';
import './home.css';
import { Link, useNavigate } from "react-router-dom";
import { useToken } from '../context/tokenContext';
import HomeNav from './home/HomeNav';
import Active from './home/Active';
import ContentBox from './home/ContentBox';
import NavBar from './home/NavBar';
import { supabase } from '../supabaseClient';

export default function Home() {
  const navigate = useNavigate();
  const userInfo = useToken();
  const userID = userInfo.user;
  const [postList, setPostList] = useState([]);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userID) {
      checkNickname();
      fetchPosts();
    }
  }, [userID]);

  const checkNickname = async () => {
    const { data: firstLoginData, error: firstLoginError } = await supabase
      .from('user')
      .select('nick_name')
      .eq('user_id', userID)
      .is('nick_name', null);
    if (firstLoginData.length > 0) {
      navigate('/signup3');
    }
  };

  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('post')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching posts:', error.message);
      return;
    }

    // 사용자의 닉네임과 프로필 이미지를 포함한 게시물 정보를 저장할 배열
    const postsWithUserInfo = await Promise.all(data.map(async (post) => {
      const { data: userData } = await supabase
        .from('user')
        .select('nick_name, profile_image')
        .eq('user_id', post.user_id)
        .single();
      
      return {
        ...post,
        user_name: userData ? userData.nick_name : 'Unknown', // 닉네임이 없는 경우 대비
        user_image: userData ? userData.profile_image : 'default_image.png' // 프로필 이미지 기본값 설정
      };
    }));

    setPostList(postsWithUserInfo);
  };

  return (
    <>
      <div className="home_background">
        <div className="topnav">
          <HomeNav />
          <Active />
        </div>
        {postList.map(post => (
          <ContentBox
            key={post.post_id}
            profileName={post.user_name}
            profileImage={post.user_image}
            location={post.locate}
            likes={post.likes}
            contentImage={post.image}
            contentText={post.content}
            createdAt={new Date(post.created_at).toLocaleString()}
          />
        ))}
      </div>
      <NavBar />
    </>
  );
}
