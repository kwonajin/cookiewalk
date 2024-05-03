import react, { useContext, useState, useEffect } from 'react';
import { Link, redirect , useNavigate} from 'react-router-dom';
import './mypage.css'
import {supabase} from '../supabaseClient'
import { useToken } from '../context/tokenContext.jsx'

export const Tab = () => {
  const [currentTab, clickTab] = useState(0);
  const navigate = useNavigate();

  const [nickname, setNickname]=useState('');
  const [name, setName]=useState('')
  const [intro, setIntro]=useState('')
  const [profileImage, setProfileImage]=useState('')
  const [email, setEmail]=useState('')
  const [distance, setDistance]=useState(0)

  const [followerCount, setFollowerCount]=useState(0);
  const [followingCount, setFollowingCount]=useState(0);
  
  const userInfo=useToken(); //TokenContext에서 user 상태를 가져옴
  // console.log(userInfo.user)
  const userID= userInfo.user

  const menuArr = [
    { id: 1, name: '내활동', content: '' },
    { id: 2, name: '게시물', content: '' },
  ];

  const selectMenuHandler = (index) => {
    clickTab(index);
  };
  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if(error){
      console.log(error)
    }
    navigate('/')
  }
  function logouthandle(e){
    e.preventDefault();
    signOut();
  }

  //유저 테이블에서 정보 가져오기
  const User = async()=>{
    // console.log(userID)
    const {data, error}=await supabase
      .from('user')
      .select('*')
      .eq('user_id', userID)
      if(error){
        console.error('오류발생', error)
      }
      if (data){
        console.log(data)
        setNickname(data[0].nick_name)
        setName(data[0].name)
        setIntro(data[0].intro)
        setProfileImage(data[0].profile_image)
        setEmail(data[0].email)
        setDistance(data[0].distance)
        // const name=data[0].name
        // const nickname=data[0].nick_name
        // const Intro=data[0].intro
        // const profileImage=data[0].profile.image
        // const email=data[0].email
      }
  }
  //팔로우 팔로워 정보 가벼오기
  const followInfo = async()=>{
    const {count :follower, error: followerError}= await supabase
      .from('follows')
      .select('*',{count:'exact'})
      .eq('target_email',email)

      if(followerError){
        console.error('오류발생', followingError)
      }
      if(follower){
        setFollowerCount(follower)
        console.log(follower)
      }


    const {count :following, error: followingError}= await supabase
      .from('follows')
      .select('*',{count:'exact'})
      .eq('following_email',email)

      if(followingError){
        console.error('오류발생', followingError)
      }
      if(following){
        setFollowingCount(following)
        console.log(following)
      }
  }
  

  useEffect(() => {
    window.scrollTo(0, 0);
    if(userID !=null){
      User();
    }
    if(email){
      followInfo();
    }
  }, [userID, email]);
  return (
    <>
  
    <div className='mypage_background'>
      <div className='mynav'>
          <div className="user_id" onClick={logouthandle}>{nickname}</div>
          <div className="menu"><img className="menu_icon" src="./icon/menu.svg" alt="" /></div>
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
        <Link to="/profile_edit"><div className="profile_edit_text">프로필 편집</div></Link>
        <div className="profile_share"></div>
        <div className="profile_share_text">프로필 공유</div>
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
                  <div className="carousel"></div>
                  <div className="carousel_right">
                    <img
                      className="carousel_right_icon"
                      src="./icon/arrow.svg"
                      alt=""
                    />
                  </div>
                  <div className="carousel_left">
                    <img
                      className="carousel_left_icon"
                      src="./icon/arrow.svg"
                      alt=""
                    />
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
                    <div className="badge1"></div>
                    <div className="badge2"></div>
                    <div className="badge3"></div>
                    <div className="badge4"></div>
                  </div>
  
                  <Link to="/mygroup">
                    <div className="myjoingroup">내가 가입한 그룹</div>
                    <div className="group_go"><img className='group_go_icon' src="./icon/arrow.svg" alt=""/></div>
                  </Link>
                  <div className="myjoingroup_list"></div>
                  <div className="group1">
                    <div className="group1_img"></div>
                    <div className="group1_title">전국 한반도 그리기</div>
                  </div>
                  <div className="group2">
                    <div className="group2_img"></div>
                    <div className="group2_title">부산 토끼 그려요</div>
                  </div>
                  <div className="group3">
                    <div className="group3_img"></div>
                    <div className="group3_title">폼폼푸린 🍮</div>
                  </div>
                </>
              )}
              {currentTab === 1 && (
                <>
                  {/* <div className="badge">획득한 뱃지</div>
                  <div className="badge_go">
                    <img
                      className='badge_go_icon'
                      src="./icon/arrow.svg"
                      alt=""
                    />
                  </div>
                  <div className="badge_list">
                    <div className="badge1"></div>
                    <div className="badge2"></div>
                    <div className="badge3"></div>
                    <div className="badge4"></div>
                  </div>
  
                  <div className="myjoingroup">내가 가입한 그룹</div>
                  <div className="group_go">
                    <img
                      className='group_go_icon'
                      src="./icon/arrow.svg"
                      alt=""
                    />
                  </div>
                  <div className="myjoingroup_list"></div>
                  <div className="group1">
                    <div className="group1_img"></div>
                    <div className="group1_tilte">전국 한반도 그리기</div>
                  </div>
                  <div className="group2">
                    <div className="group2_img"></div>
                    <div className="group2_tilte">부산 토끼 그려요</div>
                  </div>
                  <div className="group3">
                    <div className="group3_img"></div>
                    <div className="group3_tilte">폼폼푸린 🍮</div>
                  </div> */}
                </>
              )}
            </div>
          </div>
        </div>
    </div>
    
    <div className="navbar">
      <Link to="/home"><div className="home"><img className="my_home_icon" src="./icon/home.svg" alt="" /></div></Link>
      <Link to="/map"><div className="map"><img className="my_map_icon" src="./icon/map.svg" alt="" /></div></Link>
      <Link to="/BeforeStart"><div className="run"><img className="my_run_icon" src="./icon/record.svg" alt="" /></div></Link>
      <Link to="/group"><div className="group"><img className="my_group_icon" src="./icon/group.svg" alt="" /></div></Link>
      <Link to="/mypage"><div className="my"><img className="my_my_icon" src="./icon/my.svg" alt="" /></div></Link>
    </div></>
    
  );
};

export default Tab;

