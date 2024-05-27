import React, { useEffect, useState }  from 'react';
import './following.css';
import { Link, useSearchParams } from "react-router-dom";
import { useToken } from '../context/tokenContext';
import { supabase } from '../supabaseClient';

export default function Following() {
  const userInfo=useToken()
  const userID=userInfo.user
  const [userEmail, setUserEmail]=useState(null)
  const [followingList, setFollowingList]=useState([])

  async function getFollowingList(userID)
  {
    const {data,error}=await supabase
    .from("follows")
    .select(`
    user:target_email ( 
      user_id, 
      email, 
      name, 
      nick_name, 
      profile_image 
    )
  `)
  .eq('following_email', (await supabase.from('user').select('email').eq('user_id', userID).single()).data.email)
  .order('followdate')

  if(error){
    console.error("getFollwingList 에러",error)
  }

  setFollowingList(data)
  }


  console.log("팔로잉 리스트",followingList)



  useEffect(() => {
    window.scrollTo(0, 0);
    getFollowingList(userID)
  }, []);
  return (
    <div className="following_background">
      <div className='followingnav'>
        <Link to="/mypage"><div className="following_back"><img className="friend_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>
        <div className="following_tilte">팔로잉</div>
        <div className="following_line1"></div>
      </div>

      <div className="following_searchbar"></div>
      <span className="following_searchbar_text">검색</span>
      <div className="following_search"><img className="following_search_icon" src="./icon/search.svg" alt="" /></div>

      <div className="following1">
        <img className="following1_profile" src="./images/ellipse_11.png" alt="" />
        <div className="following1_text">
          <div className="following1_id">good_running_day</div>
          <div className="following1_name">박민준</div>
        </div>
        <div className="following1_follow"></div>
        <div className="following1_follow_text">팔로잉</div>
        <div className="following1_line"></div>
      </div>

      <div className="friend2">
        <img className="following2_profile" src="./images/ellipse_11.png" alt="" />
        <div className="following2_text">
          <div className="following2_id">good_running_day</div>
          <div className="following2_name">박민준</div>
        </div>
        <div className="following2_follow"></div>
        <div className="following2_follow_text">팔로잉</div>
        <div className="following2_line"></div>
      </div>

      <div className="following3">
        <img className="following3_profile" src="./images/ellipse_11.png" alt="" />
        <div className="following3_text">
          <div className="following3_id">good_running_day</div>
          <div className="following3_name">박민준</div>
        </div>
        <div className="following3_follow"></div>
        <div className="following3_follow_text">팔로잉</div>
        <div className="following3_line"></div>
      </div>

      <div className="following4">
        <img className="following4_profile" src="./images/ellipse_11.png" alt="" />
        <div className="following4_text">
          <div className="following4_id">good_running_day</div>
          <div className="following4_name">박민준</div>
        </div>
        <div className="following4_follow"></div>
        <div className="following4_follow_text">팔로잉</div>
        <div className="following4_line"></div>
      </div>

    </div>
  );
}

