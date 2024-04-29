import React, { useState,useEffect } from 'react';
import './Signup3.css'
import { Link ,useNavigate, useLocation} from "react-router-dom";
import axios from "axios";

export default function DetailedInfo() {
    const navigate = useNavigate();
    const location = useLocation();
    const {username, password, email} = location.state || {}
    const [name,setName]=useState('')
    const [phone, setPhone]=useState('')
    const [nickname, setNickname]=useState('')
    const [consfirmNickname, setConfirmNickname]=useState(false)
    const [gender, setGender] = useState(null); // 성별 상태

    // 성별 선택 핸들러
    const handleGenderSelect = (selectedGender) => {
        setGender(selectedGender);
    };

    //닉네임 중복 검사 요청
    const onSubmitHandlerNick = (e) =>{
        e.preventDefault();
        axios.post('http://localhost:3000/login/join/signup3', {nickname})
            .then(response=>{
                console.log(response.data)
                setConfirmNickname(response.data==='사용가능')
            })
    }
    // setConfirmCodeMatch 상태가 변경될 때마다 실행해 취신 결과값 확인
    useEffect(() => {
    console.log(consfirmNickname);
    }, [consfirmNickname]);

    const nextStep = (e) =>{
        e.preventDefault()
        console.log(username, name, phone)
        //버튼 클릭시 마다 제출되는 것을 방지 하는 함수
        if(consfirmNickname){
            navigate('/signup4'); // signup3로 이동
        };
    }


    return (
    <div className="e86_8">

        <div><img className='e86_35' src="./icon/ic--round-arrow-back.svg" /></div>
        <span className="cookiewalk_logo">CookieWalk</span>

        <span className="e86_9">쿠키워크의 상세정보를 입력해주세요</span>
    
        <form onSubmit={nextStep} method = "/">
            <input type="text" className="inputUserName" onChange={(e)=>setName(e.target.value)} value={name} placeholder="이름을 입력해주세요" required/>
            {/* 이름 */}
            <input type="text" className="inputUserCP" onChange={(e)=>setPhone(e.target.value)} value={phone} placeholder="전화번호를 입력해주세요 (‘-’없이 입력)" required/>
            {/* 전화번호 */}
    
            <button type='button' className={`e86_37 ${gender === 'M' ? 'selected' : ''}`} onClick={() => handleGenderSelect('M')}>
                    {gender === 'M' ? <img className="e86_38" src='./icon/lets-icons--check-fill.svg' alt="selected"/> : <img className="e86_38" src='./icon/ei--check.svg' alt="unselected"/>}
                </button>
            <span className="e86_39">남자</span>
    
            <button type='button' className={`e86_20 ${gender === 'F' ? 'selected' : ''}`} onClick={() => handleGenderSelect('F')}>
                    {gender === 'F' ? <img className="e86_21" src='./icon/lets-icons--check-fill.svg' alt="selected"/> : <img className="e86_21" src='./icon/ei--check.svg' alt="unselected"/>}
                </button>
            <span className="e86_40">여자</span>
    
            <input type="text" className="inputUserNickName" onChange={(e)=>setNickname(e.target.value)} value={nickname}placeholder="닉네임을 입력해주세요" required/>
    
            <button type='submit' onClick={onSubmitHandlerNick} className="UserNick_double_check">중복확인</button>
    
            <button className="next3">다음</button>
        </form>
    </div>
    );
    }
