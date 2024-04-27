import React, {useState} from 'react';
import './write.css'; 
import { Link } from "react-router-dom";

export default function Write(){
  const [text, setText] = useState("");

  return (
    <div className="write-page">
      <Link to="/home"><div className="write_back"><img className='write_back_icon' src="./icon/arrow.svg" alt="" /></div></Link>
      <div className="write_title">새 게시물</div>
      <div className="write_add">작성</div>
      <div className="write_line1"></div>

      <div className="write_place_add">위치 추가</div>
      <div className="place_add"><img className="place_add_icon" src="./icon/arrow.svg" alt="" /></div>
      <div className="write_line2"></div>
      
      <textarea
        className="write_text"
        placeholder="나의 활동을 공유하세요!"
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <div className="write_navbar">
        <div className="picture_add"><img className="camera_icon" src="./icon/camera.svg" alt="" /></div>
        <div className="picture1"></div>
        <div className="picture2"></div>
      </div>
    </div>
  );
}


