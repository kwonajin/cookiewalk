import React, { useState } from 'react';
import './Signup3.css'
import { Link } from "react-router-dom";

export default function DetailedInfo() {
    const [gender, setGender] = useState(null); // 성별 상태

    // 성별 선택 핸들러
    const handleGenderSelect = (selectedGender) => {
        setGender(selectedGender);
    };
    return (
    <div className="e86_8">

        <div><img className='e86_35' src="./icon/ic--round-arrow-back.svg" /></div>
        <span className="cookiewalk_logo">CookieWalk</span>

        <span className="e86_9">쿠키워크의 상세정보를 입력해주세요</span>
    
        <form action="/" method = "/">
            <input type="text" className="inputUserName" placeholder="이름을 입력해주세요" required/>
            {/* 이름 */}
            <input type="text" className="inputUserCP" placeholder="전화번호를 입력해주세요 (‘-’없이 입력)" required/>
            {/* 전화번호 */}
    
            <button type='button' className={`e86_37 ${gender === 'male' ? 'selected' : ''}`} onClick={() => handleGenderSelect('male')}>
                    {gender === 'male' ? <img className="e86_38" src='./icon/lets-icons--check-fill.svg' alt="selected"/> : <img className="e86_38" src='./icon/ei--check.svg' alt="unselected"/>}
                </button>
            <span className="e86_39">남자</span>
    
            <button type='button' className={`e86_20 ${gender === 'female' ? 'selected' : ''}`} onClick={() => handleGenderSelect('female')}>
                    {gender === 'female' ? <img className="e86_21" src='./icon/lets-icons--check-fill.svg' alt="selected"/> : <img className="e86_21" src='./icon/ei--check.svg' alt="unselected"/>}
                </button>
            <span className="e86_40">여자</span>
    
            <input type="text" className="inputUserNickName" placeholder="닉네임을 입력해주세요" required/>
    
            <button type='submit' className="UserNick_double_check">중복확인</button>
    
            <button className="next">다음</button>
        </form>
    </div>
    );
    }
