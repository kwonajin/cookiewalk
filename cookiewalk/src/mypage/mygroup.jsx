import React, { useEffect }  from 'react';
import './mygroup.css';
import { Link } from "react-router-dom";


export default function MyGroup() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="mg_background">
      <div className='mgnav'>
        <Link to="/mypage"><div className="mg_back"><img className="mg_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>
        <span className="mg_title">내가 가입한 그룹</span>
        <div className="mg_line"></div>
      </div>

      <Link to="/mygroup_detail">
        <div className="mg_group1">
          <img className="mg_group1_img" src="./images/group1.png" alt="" />
          <div className="mg_person_box"></div>
          <div className="mg_person"><img className="mg_person_icon" src="./icon/person.svg" alt="" /></div>
          <span className="mg_person_current">4</span>
          <span className="mg_slash">/</span>
          <span className="mg_person_total">5</span>
          <div className="mg_dday_box"></div>
          <span className="mg_dday">D - 14</span>
          <span className="mg_group1_name">전국 한반도 그리기</span>
          <div className="mg_place"><img className='mg_place_icon' src="./icon/place.svg" alt="" /></div>
          <span className="mg_place_text">부산 남구 대연동</span>
          <div className="mg_distance"><img className="mg_distance_icon" src="./icon/running.svg" alt="" /></div>
          <span className="mg_distance_text">2.5km</span>
          <div className="mg_hashtag1_box"></div>
          <span className="mg_hashtag1">#부산</span>
          <div className="mg_hashtag2_box"></div>
          <span className="mg_hashtag2">#대연동</span>
          <div className="mg_hashtag3_box"></div>
          <span className="mg_hashtag3">#자전거</span>
      </div>
      </Link>


      <Link to="/mygroup_detail">
        <div className="mg_group2">
          <img className="mg_group2_img" src="./images/group2.png" alt="" />
          <div className="mg_person_box2"></div>
          <div className="mg_person2"><img className="mg_person_icon2" src="./icon/person.svg" alt="" /></div>
          <span className="mg_person_current2">2</span>
          <span className="mg_slash2">/</span>
          <span className="mg_person_total2">7</span>
          <div className="mg_dday_box2"></div>
          <span className="mg_dday2">D - 20</span>
          <span className="mg_group2_name">부산 토끼 그려요</span>
          <div className="mg_place2"><img className="mg_place_icon2" src="./icon/place.svg" alt="" />
          </div>
          <span className="mg_place_text2">부산 해운대구 우동</span>
          <div className="mg_distance2"><img className="mg_distance_icon2" src="./icon/running.svg" alt="" /></div>
          <span className="mg_distance_text2">2.5km</span>
          <div className="mg_hashtag1_box2"></div>
          <span className="mg_hashtag1_2">#부산</span>
          <div className="mg_hashtag2_box2"></div>
          <span className="mg_hashtag2_2">#해운대구</span>
          <div className="mg_hashtag3_box2"></div>
          <span className="mg_hashtag3_2">#공룡</span>
        </div>
      </Link>
    </div>
  );
}

