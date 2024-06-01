import React, { useEffect, useState } from 'react';
import './mygroup_detail.css'; 
import { Link } from "react-router-dom";

export default function MyGroupDetail() {
  const [selected, setSelected] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleSelectClick = () => {
    setSelected(!selected);
  };

  return (
    <div className="gd_background">
      <Link to="/mygroup">
        <div className="gd_back">
          <img className='gd_back_icon' src="./icon/arrow.svg" alt="뒤로가기 아이콘" />
        </div>
      </Link>
      <div className="mgd_title">내가 가입한 그룹</div>
      <div className="gd_line"></div>

      <img className="gd_img" src="./images/group1.png" alt="그룹 이미지" />
      <div className="gd_name">전국 한반도 그리기</div>
      <div className="gd_dday">
        <div className="gd_dday_box"></div>
        <div className="gd_dday_text">D - 14</div>
      </div>
      <div className="gd_line1"></div>

      <div className="gd_people">
        <img className='gd_people_icon' src="./icon/person.svg" alt="사람 아이콘" />
      </div>
      <div className="gd_person">
        <div className="gd_person_current">4</div>
        <div className="gd_slash">/</div>
        <div className="gd_person_total">5</div>
      </div>

      <div className="gd_place">
        <img className='gd_place_icon' src="./icon/place.svg" alt="장소 아이콘" />
      </div>
      <div className="gd_place_name">부산 남구 대연동</div>

      <div className="gd_distance">
        <img className='gd_distance_icon' src="./icon/running.svg" alt="거리 아이콘" />
      </div>
      <span className="gd_distance_num">2.5km</span>
      <div className="gd_line2"></div>

      {/* 리스트1 */}
      <div className="group_choice_box1"></div>
      <div className="group_num_box1">
        <div className="group_choice_num_box1"></div>
        <span className="group_choice_num1">1</span>
      </div>
      <div className="e359_129">
        <div className="e359_130"></div>
        <span className="e359_131">선택완료</span>
      </div>
      <span className="e359_135">1.0km</span>

      {/* 리스트2 */}
      <div className="group_choice_box2"></div>
      <div className="group_num_box2">
        <div className="group_choice_num_box2"></div>
        <span className="group_choice_num2">2</span>
      </div>
      <span className="e359_143">1.0km</span>
      <button
        className={`select_btn ${selected ? 'selected' : 'unselected'}`}
        onClick={handleSelectClick}
      >
        {selected ? '선택하기' : '선택함'}
      </button>

      {/* 리스트3 */}
      <div className="group_choice_box3"></div>
      <div className="e359_158">
        <div className="e359_159"></div>
        <span className="e359_160">3</span>
      </div>
      <div className="e359_161">
        <div className="e359_162"></div>
        <span className="e359_163">선택하기</span>
      </div>
      <span className="e359_157">0.5km</span>

      <div className="gd_join">
        <div className="gd_join_box"></div>
        <div className="gd_join_text">걷기 시작하기</div>
      </div>
    </div>
  );
}
