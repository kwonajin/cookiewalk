import React, { useEffect, useState } from 'react';
import './home.css';
import { Link, useNavigate } from "react-router-dom";
import { useToken } from '../context/tokenContext';
import HomeNav from './home/HomeNav';
import Active from './home/Active';
import ContentBox from './home/ContentBox';
import NavBar from './home/NavBar';
import { supabase } from '../supabaseClient';
import mainContext from '../context/MainContext';

export default function Home() {
  const navigate = useNavigate();
  const userInfo = useToken();
  const userID = userInfo.user;
  const [postList, setPostList] = useState([]);
  const [page, setPage] = useState(1); // 현재 페이지를 추적
  const [loading, setLoading] = useState(false); // 로딩 상태를 추적

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userID) {
      checkNickname();
      fetchPosts(page); // 초기 게시물 가져오기
    }

    // 스크롤 이벤트 리스너 추가
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // 언마운트 시 클린업
  }, [userID, page]);

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

  const fetchPosts = async (page) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('post')
      .select('*')
      .order('created_at', { ascending: false })
      .range((page - 1) * 10, page * 10 - 1); // 페이지당 10개의 게시물 가져오기

    if (error) {
      console.error('Error fetching posts:', error.message);
      setLoading(false);
      return;
    }

    const postsWithUserInfo = await Promise.all(data.map(async (post) => {
      const { data: userData } = await supabase
        .from('user')
        .select('nick_name, profile_image')
        .eq('user_id', post.user_id)
        .single();
      
      return {
        ...post,
        user_name: userData ? userData.nick_name : 'Unknown',
        user_image: userData ? userData.profile_image : 'default_image.png'
      };
    }));

    setPostList(prevPosts => [...prevPosts, ...postsWithUserInfo]); // 기존 리스트에 새 게시물 추가
    setLoading(false);
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
      return;
    }
    setPage(prevPage => prevPage + 1); // 다음 페이지 로드
  };

  return (
    <>
      <div className="home_background">
        <div className="topnav">
          <HomeNav />
          <Active />
        </div>
        {postList.map((post, index) => (
          <ContentBox
            key={`${post.post_id}-${index}`} // 고유한 키 생성
            userId={post.user_id}
            profileName={post.user_name}
            profileImage={post.user_image}
            location={post.locate}
            contentImage={post.image}
            contentText={post.content}
            createdAt={new Date(post.created_at).toLocaleString()}
            userID={userID}
            postID={post.post_id}
          />
        ))}
        {loading && <div>Loading...</div>}
      </div>
      <NavBar />
    </>
  );
}
