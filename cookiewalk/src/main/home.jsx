import React, { useEffect, useState } from 'react';
import './home.css';
import { Link, useNavigate } from "react-router-dom";
import { useToken } from '../context/tokenContext';
import HomeNav from './home/HomeNav';
import Active from './home/Active';
import ContentBox from './home/ContentBox';
import NavBar from './home/NavBar';
import { supabase } from '../supabaseClient';
import debounce from 'lodash/debounce';  // 디바운스 함수 추가
import {formatTime} from '../utils/formatTime';

export default function Home() {
  const navigate = useNavigate();
  const userInfo = useToken();
  const userID = userInfo.user;
  const [postList, setPostList] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  //active 에 들어갈 것
  let time=0
  let distance=0
  const [recordcount, setRecordCount]=useState(0)
  const [totalDistance ,setTotalDistance]=useState(0)
  const [totoalTime, setTotoalTime]=useState('')

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userID) {
      checkNickname();
      fetchPosts(page);
      userWalkingRecords()
    }

    const debouncedHandleScroll = debounce(handleScroll, 200); // 스크롤 이벤트 디바운싱
    window.addEventListener('scroll', debouncedHandleScroll);

    return () => window.removeEventListener('scroll', debouncedHandleScroll);
  }, [userID, page]);


  async function userWalkingRecords(){
    const {data , error, count}= await supabase
      .from('walking_record')
      .select('distance, walking_time',{count : 'exact'})
      .eq('user_id', userID);
    if(error){
      console.error('Error', error);
      return
    }
    console.log(data)
    setRecordCount(count)
    if(data.length >= 1){
      data.forEach(record =>{
        distance +=record.distance
        time +=record.walking_time
      })
      const format = formatTime(time)
      setTotalDistance(distance.toFixed(2))
      setTotoalTime(format)
    }
  }
  useEffect(()=>{
    console.log(totalDistance, totoalTime ,recordcount)
  },[totalDistance, totoalTime, recordcount])

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
      .range((page - 1) * 10, page * 10 - 1);

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

    setPostList(prevPosts => {
      const newPosts = [...prevPosts, ...postsWithUserInfo];
      return Array.from(new Set(newPosts.map(p => p.post_id))).map(id => newPosts.find(p => p.post_id === id)); // 중복 게시물 제거
    });
    setLoading(false);
  };

  const handleScroll = () => {
    if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight || loading) {
      return;
    }
    setPage(prevPage => prevPage + 1);
  };

  return (
    <>
      <div className="home_background">
        <div className="topnav">
          <HomeNav />
          <Active distance={totalDistance} time={totoalTime} count={recordcount}/>
        </div>
        {postList.map((post, index) => (
          <ContentBox
            key={`${post.post_id}-${index}`}
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
