import './Signup2.css'
import React, { useState, useEffect } from 'react';
import { Link, useNavigate ,useLocation } from "react-router-dom";
import axios from "axios";

export default function Singup2() {
    const navigate = useNavigate();
    const location = useLocation();
    const {username} = location.state || {};
    const [email, setEmail]=useState('');
    //inputConfirmCode: 이메일 인증창에 사용자가 입력한 인증코드
    //ConfirmCode:서버에서 생성한 인증코드
    const [inputConfirmCode,setInputConfirmCode]=useState('')
    const [confirmCode, setConfirmCode]=useState('')
    const [confirmCodeMatch, setConfirmCodeMatch] = useState(false);


//아이디 이메일 정보 서버로 전달
//가입한 계정이면 response.data에 '가입한계정'이란 말이 나옴 이걸로 알려주는 로직추가 하면 좋을 듯
const sendConfirmCode = (e) =>{
    e.preventDefault();
    axios.post('http://localhost:3000/login/join/signup2', {username,email})
        .then(response=>{
        console.log(response.data.data)
        setConfirmCode(response.data.data)
    })
}

//인증코드 최신값 입력
const confirmFuntion = (e)=>{
    const {name, value} = e.target;
    if (name === 'inputConfirmCode'){
        setInputConfirmCode(value);
    }
}
 // 입력한 인증코드 값이 바뀔때마다 실행
useEffect(()=>{
    console.log(inputConfirmCode, confirmCode, confirmCodeMatch);
    setConfirmCodeMatch(inputConfirmCode === String(confirmCode))
},[inputConfirmCode, confirmCode])

// setConfirmCodeMatch 상태가 변경될 때마다 실행해 취신 결과값 확인
useEffect(() => {
    console.log(inputConfirmCode, confirmCode, confirmCodeMatch);
}, [confirmCodeMatch]);

const nextStep = (e) =>{
    e.preventDefault()
    console.log(confirmCode,inputConfirmCode)
    navigate('/signup3', {state:{username}}); // signup3로 이동
    //버튼 클릭시 마다 제출되는 것을 방지 하는 함수
    if(confirmCodeMatch){
        axios.post('http://localhost:3000/login/join/signup2_2', {username,email})
        .then(response=>{
            console.log(response.status)
            if (response.status === 200) {
                navigate('/signup3', {state:{username}}); // signup3로 이동
            }
        });
    }
}

return (
    <div className="signup2_container">
        <div ><img className="e83_102" src="./icon/ic--round-arrow-back.svg" alt="" /></div>
        <span className="cookiewalk_logo">CookieWalk</span>
        <span className="e83_36">이메일 인증을 진행해주세요</span>
        <span className="e83_41">입력하신 이메일로 인증번호를 발송합니다</span>
        <form method = "/" onSubmit={nextStep}>
            <input type="text" className="userEmailinput" value={email} onChange={(e)=>{setEmail(e.target.value)}} placeholder="이메일을 입력해주세요" required/>
            <button type='submit' className="userEmailinput_btn" onClick={sendConfirmCode}>발급</button>
            <span className="e83_59">이메일 인증코드 입력</span>
            <input type="text" className="userEmailconfirm" name="inputConfirmCode" onChange={confirmFuntion} required/>
            {/* <span className="e89_19">올바르지 않은 입력입니다</span> */}
            {/* 이메일 입력이 틀릴 시 나오게 할 부분 */}
            <button className="next2" >다음</button>
        </form>
        </div>
    );
}
