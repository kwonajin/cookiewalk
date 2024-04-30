import { useContext, useState } from 'react';
import { Link, redirect , useNavigate} from 'react-router-dom';
import './mypage.css'
import {supabase} from '../supabaseClient'
import { tokenContext } from '../tokenContext';

export const Tab = () => {
  const [currentTab, clickTab] = useState(0);
  const navigate = useNavigate();

  const userInfo=useContext(tokenContext)

  console.log(userInfo)

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
  return (
    <>
  
    <div className='mypage_background'>
      <div className='mynav'>
          <div className="user_id">running_go</div>
          <div className="menu"><img className="menu_icon" src="./icon/menu.svg" alt="" /></div>
          <div className="title_line"></div>
        </div>
  
        <div><img className="profile_img" src="./images/ellipse_7.png" alt="" /></div>
        <div className="total_distance_num">32km</div>
        <div className="total_distance">총거리</div>
        <Link to="/follower">
          <div className="follower_num">147</div>
          <div className="follower">팔로워</div>
        </Link>
        <Link to="/following">
          <div className="following_num">182</div>
          <div className="following">팔로잉</div>
        </Link>
  
        <div className="user_name">유민지</div>
        <div className="introduction">재미있는 산책을 지향합니다 🌳✨</div>
  
        <div className="profile_edit"></div>
        <div className="profile_edit_text">프로필 편집</div>
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
      <Link to="/pause"><div className="run"><img className="my_run_icon" src="./icon/record.svg" alt="" /></div></Link>
      <Link to="/group"><div className="group"><img className="my_group_icon" src="./icon/group.svg" alt="" /></div></Link>
      <Link to="/mypage"><div className="my"><img className="my_my_icon" src="./icon/my.svg" alt="" /></div></Link>
    </div></>
    
  );
};

export default Tab;

