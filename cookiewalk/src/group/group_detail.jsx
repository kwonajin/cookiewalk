import React, { useEffect }  from 'react';
import './group_detail.css'; 
import { Link } from "react-router-dom";

export default function GroupDetail() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="gd_background">
      <Link to="/group"><div className="gd_back"><img className='gd_back_icon' src="./icon/arrow.svg" alt="" /></div></Link>
        <div className="gd_title">그룹</div>
        <div className="gd_line"></div>


      <img className="gd_img" src="./images/group1.png" alt="" />
      <div className="gd_name">같이 그리실 분??</div>
      <div className="gd_dday">
        <div className="gd_dday_box"></div>
        <div className="gd_dday_text">D - 14</div>
      </div>
      <div className="gd_line1"></div>

      <div className="gd_people"><img className='gd_people_icon' src="./icon/person.svg" alt="" /></div>
      <div className="gd_person">
        <div className="gd_person_current">4</div>
        <div className="gd_slash">/</div>
        <div className="gd_person_total">5</div>
      </div>

      <div className="gd_place"><img className='gd_place_icon' src="./icon/place.svg" alt="" /></div>
      <div className="gd_place_name">부산 남구 대연동</div>

      <div className="gd_distance"><img className='gd_distance_icon' src="./icon/running.svg" alt="" /></div>
      <span className="gd_distance_num">2.5km</span>
      <div className="gd_line2"></div>



      <div className="gd_hashtag1">
        <div className="gd_hashtag1_box"></div>
        <div className="gd_hashtag1_text">#부산</div>
      </div>
      <div className="gd_hashtag2">
        <div className="gd_hashtag2_box"></div>
        <span className="gd_hashtag2_text">#대연동</span>
      </div>
      <div className="gd_hashtag3">
        <div className="gd_hashtag3_box"></div>
        <span className="gd_hashtag3_text">#자전거</span>
      </div>


      <div className="gd_join">
        <div className="gd_join_box"></div>
        <div className="gd_join_text">그룹 참여하기</div>
      </div>


    </div>
  );
}

