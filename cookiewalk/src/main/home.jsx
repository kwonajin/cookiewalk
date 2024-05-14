import React, { useEffect, useState } from 'react';
import './home.css'; // CSS 스타일시트 임포트
import { Link, useNavigate } from "react-router-dom"; // 리액트 라우터의 링크 및 네비게이션 훅
import { useToken } from '../context/tokenContext'; // 사용자 토큰 정보를 가져오는 커스텀 훅
import HomeNav from './home/HomeNav'; // 홈 네비게이션 컴포넌트
import Active from './home/Active'; // 활동 관련 컴포넌트
import ContentBox from './home/ContentBox'; // 각 게시물을 표시하는 컴포넌트
import NavBar from './home/NavBar'; // 페이지 하단의 네비게이션 바 컴포넌트
import { supabase } from '../supabaseClient'; // Supabase 클라이언트
import mainContext from '../context/MainContext';

export default function Home() {
  const navigate = useNavigate(); // 페이지 네비게이션을 위한 훅
  const userInfo = useToken(); // 사용자 토큰을 통해 사용자 정보를 가져옴
  const userID = userInfo.user; // 사용자 ID
  const [postList, setPostList] = useState([]); // 게시물 데이터를 저장할 상태

  // 컴포넌트가 마운트 될 때 실행될 useEffect
  useEffect(() => {
    window.scrollTo(0, 0); // 페이지 상단으로 스크롤
    if (userID) { // 사용자 ID가 있으면 닉네임 체크와 게시물 가져오기 실행
      checkNickname();
      fetchPosts();
    }
  }, [userID]); // userID가 변경될 때마다 이 훅을 재실행

  // 사용자의 닉네임 체크 함수
  const checkNickname = async () => {
    const { data: firstLoginData, error: firstLoginError } = await supabase
      .from('user')
      .select('nick_name') // nick_name 필드 선택
      .eq('user_id', userID) // 현재 사용자 ID와 일치하는 레코드
      .is('nick_name', null); // 닉네임이 null인 경우
    if (firstLoginData.length > 0) { // 닉네임이 설정되지 않은 경우
      navigate('/signup3'); // 닉네임 설정 페이지로 리다이렉트
    }
  };

  // 게시물을 불러오는 함수
  const fetchPosts = async () => {
    const { data, error } = await supabase
      .from('post')
      .select('*') // 모든 필드를 선택
      .order('created_at', { ascending: false }); // 생성된 날짜 기준으로 내림차순 정렬
    if (error) {
      console.error('Error fetching posts:', error.message);
      return;
    }

    // 각 게시물에 대해 사용자의 닉네임과 프로필 이미지 정보를 추가하여 저장
    const postsWithUserInfo = await Promise.all(data.map(async (post) => {
      const { data: userData } = await supabase
        .from('user')
        .select('nick_name, profile_image')
        .eq('user_id', post.user_id)
        .single(); // 각 게시물의 사용자 정보를 단일 조회
      
      return {
        ...post,
        user_name: userData ? userData.nick_name : 'Unknown', // 사용자 닉네임 설정
        user_image: userData ? userData.profile_image : 'default_image.png' // 사용자 이미지 설정
      };
    }));

    setPostList(postsWithUserInfo); // 상태 업데이트
  };

  // 컴포넌트 렌더링 부분
  return (
    <>
      <div className="home_background">
        <div className="topnav">
          <HomeNav />
          <Active />
        </div>
        {postList.map(post => ( // 게시물 데이터를 ContentBox 컴포넌트에 매핑
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
