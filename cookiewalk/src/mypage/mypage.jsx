import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './mypage.css';
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext.jsx';
import Slider from 'react-slick';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MyBarChart from './chart/MyBarChart.jsx'; // Import MyBarChart
import PostList from './myPost/myPostList.jsx';

export const Tab = () => {
  const [currentTab, clickTab] = useState(0);
  const navigate = useNavigate();

  const [nickname, setNickname] = useState('');
  const [name, setName] = useState('');
  const [intro, setIntro] = useState('');
  const [profileImage, setProfileImage] = useState('');
  const [email, setEmail] = useState('');
  const [distance, setDistance] = useState(0);
  const [point, setPoint] = useState(0); // Add state for point

  const [followerCount, setFollowerCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

  const [postList, setPostList] = useState([]);

  const userInfo = useToken(); // TokenContext에서 user 상태를 가져옴
  const userID = userInfo.user;

  const menuArr = [
    { id: 1, name: '내활동', content: '' },
    { id: 2, name: '게시물', content: '' },
  ];

  const selectMenuHandler = (index) => {
    clickTab(index);
  };

  async function signOut() {
    const { error } = await supabase.auth.signOut();
    if (error) {
      console.log(error);
    }
    navigate('/');
  }

  function logouthandle(e) {
    e.preventDefault();
    signOut();
  }

  //유저 테이블에서 정보 가져오기
  const User = async () => {
    const { data, error } = await supabase
      .from('user')
      .select('*')
      .eq('user_id', userID);
    if (error) {
      console.error('오류발생', error);
    }
    if (data) {
      console.log(data);
      setNickname(data[0].nick_name);
      setName(data[0].name);
      setIntro(data[0].intro);
      setProfileImage(data[0].profile_image);
      setEmail(data[0].email);
      setPoint(data[0].point); // Set the point value
    }
  };

  //팔로우 팔로워 정보 가벼오기
  const followInfo = async () => {
    const { count: follower, error: followerError } = await supabase
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('target_email', email);

    if (followerError) {
      console.error('오류발생', followerError);
    }
    if (follower) {
      setFollowerCount(follower);
      console.log(follower);
    }

    const { count: following, error: followingError } = await supabase
      .from('follows')
      .select('*', { count: 'exact' })
      .eq('following_email', email);

    if (followingError) {
      console.error('오류발생', followingError);
    }
    if (following) {
      setFollowingCount(following);
      console.log(following);
    }
  };

  //총 이동 거리
  async function getTotalDistance() {
    const { data: walkingRecords, error: walkingError } = await supabase
      .from('walking_record')
      .select('distance')
      .eq('user_id', userID);

    if (walkingError) {
      console.error('Error fetching walking_record:', walkingError);
      return;
    }
    console.log(walkingRecords);

    const totalDistance = [...walkingRecords].reduce((sum, record) => sum + (record.distance || 0), 0);
    console.log('Total distance for user', userID, 'is', totalDistance);
    setDistance(totalDistance.toFixed(2));
    return totalDistance;
  }

  //작성한 게시글 리스트
  async function getPostList() {
    const {data, error} = await supabase
      .from("post")
      .select("post_id, created_at, image, walking_record_id")
      .eq("user_id", userID)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("getPostList 에러", error);
      return;
    }

    console.log("postList", data);
    setPostList(data);
  }

  //차트 세팅
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  const sliderRef = useRef(null);

  const goToSlide = (index) => {
    sliderRef.current.slickGoTo(index);
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    if (userID != null) {
      User();
      getTotalDistance();
    }
    if (email) {
      followInfo();
      getPostList();
    }
  }, [userID, email]);

  return (
    <>
      <div className='mypage_background'>
        <div className='mynav'>
          <Link to="/reward">
            <img className='reward_icon' src="./images/logo.png" alt="" />
            <div className='tot_point'>{point}</div> {/* Update point display */}
          </Link>
          <div className="user_id">{nickname}</div>
          <Link to="/mypage_menu">
            <div className="menu">
              <img className="menu_icon" src="./icon/menu.svg" alt="" />
            </div>
          </Link>
          <div className="title_line"></div>
        </div>

        <div><img className="profile_img" src={profileImage} alt="" /></div>
        <div className="total_distance_num">{distance}km</div>
        <div className="total_distance">총거리</div>
        <Link to="/follower">
          <div className="follower_num">{followerCount}</div>
          <div className="follower">팔로워</div>
        </Link>
        <Link to="/following">
          <div className="following_num">{followingCount}</div>
          <div className="following">팔로잉</div>
        </Link>

        <div className="user_name">{name}</div>
        <div className="introduction">{intro}</div>

        <div className="profile_edit"></div>
        <Link to="/profile_edit">
          <div className="profile_edit_text">프로필 편집</div></Link>
        <div className="profile_share"></div>
        <Link to="/finished_art">
          <div className="profile_share_text">완성한 그림</div></Link>

        <div>
          <div className='TabMenu'>
            {menuArr.map((el, index) => (
              <li
                key={el.id} // 각 요소에 고유한 키를 제공
                className={index === currentTab ? 'submenu focused' : 'submenu'}
                onClick={() => selectMenuHandler(index)}
              >
                {el.name}
              </li>
            ))}
          </div>
          <div className='Desc'>
            <div>
              {menuArr[currentTab].content}
              {currentTab === 0 && (
                <>
                  <div className='mygraph'>
                    <button onClick={() => goToSlide(0)}>주</button>
                    <button onClick={() => goToSlide(1)}>월</button>
                    <button onClick={() => goToSlide(2)}>년</button>
                  </div>
                  <div className="carousel">
                    <Slider ref={sliderRef} {...settings}>
                      <div>
                        <MyBarChart user={userID} type="week" />
                      </div>
                      <div>
                        <MyBarChart user={userID} type="month"/>
                      </div>
                      <div>
                        <MyBarChart user={userID} type="year"/>
                      </div>
                    </Slider>
                  </div>

                  <div className="badge">획득한 뱃지</div>
                  <div className="badge_go">
                    <img
                      className='badge_go_icon'
                      src="./icon/arrow.svg"
                      alt=""
                    />
                  </div>
                  <div className="badge_list">
                    <div><img className="badge1" src="./images/badge1.png" alt="" /></div>
                    <div><img className="badge2" src="./images/badge2.png" alt="" /></div>
                    <div><img className="badge3" src="./images/badge3.png" alt="" /></div>
                    <div><img className="badge4" src="./images/badge4.png" alt="" /></div>
                  </div>

                  <Link to="/mygroup">
                    <div className="myjoingroup">내가 가입한 그룹</div>
                    <div className="group_go"><img className='group_go_icon' src="./icon/arrow.svg" alt="" /></div>
                  </Link>
                  <div className="myjoingroup_list"></div>
                  <div className="group1">
                    <div className><img className='group1_img' src="./images/group_img1.png" alt="" /></div>
                    <div className="group1_title">토끼 그려요 🐰</div>
                  </div>
                  <div className="group2">
                  <div className><img className='group2_img' src="./images/group_img2.png" alt="" /></div>
                    <div className="group2_title">🍒 체리 그리실분?!</div>
                  </div>
                  <div className="group3">
                  <div className><img className='group3_img' src="./images/group_img3.png" alt="" /></div>
                    <div className="group2_title">진저맨 쿠키 🍪🍩</div>
                  </div>
                </>
              )}
              {currentTab === 1 && (
                <>
                  <div className='mypage_postBox'>
                    {postList.map((post) => (
                      <PostList
                        key={post.post_id}
                        post_id={post.post_id}
                        created_at={post.created_at}
                        image={post.image}
                        walking_record_id={post.walking_record_id}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="navbar">
        <Link to="/home"><div className="home"><img className="mp_my_home_icon" src="./icon/home.svg" alt="" /></div></Link>
        <Link to="/map"><div className="map"><img className="mp_my_map_icon" src="./icon/map.svg" alt="" /></div></Link>
        <Link to="/BeforeStart"><div className="run"><img className="mp_my_run_icon" src="./icon/record.svg" alt="" /></div></Link>
        <Link to="/group"><div className="group"><img className="mp_my_group_icon" src="./icon/group.svg" alt="" /></div></Link>
        <Link to="/mypage"><div className="my"><img className="mp_my_my_icon" src="./icon/my.svg" alt="" /></div></Link>
      </div>
    </>
  );
};

export default Tab;
