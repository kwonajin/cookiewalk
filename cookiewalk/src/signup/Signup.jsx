import './Signup.css'
import React, { useState,useEffect } from 'react';
import { Link, useNavigate } from "react-router-dom";
import {supabase} from '../supabaseClient'

export default function Signup() {
  // 첫 번째 비밀번호 입력 필드의 가시성 상태
  const [passwordVisible, setPasswordVisible] = useState(false);
  // 비밀번호 재입력 필드의 가시성 상태
  const [passwordConfirmVisible, setPasswordConfirmVisible] = useState(false);

  // 첫 번째 비밀번호 입력 필드의 가시성을 토글하는 함수
  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  // 비밀번호 재입력 필드의 가시성을 토글하는 함수
  const togglePasswordConfirmVisibility = () => {
    setPasswordConfirmVisible(!passwordConfirmVisible);
  };

  const [email, setemail]=useState('');
  const [confirmEmail, setConfirmEmail] = useState(false);
  const [password, setPassword]=useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordsMatch, setPasswordsMatch] = useState(false);
  
  //이메일 양식 검사 함수
  function validateEmail(e) {
    const regex =/^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
    return regex.test(e);
  }
  //이메일 중복 및 양식 검사 
  const onSubmitEmail = async (e) =>{
    e.preventDefault();
    const isValidEmail = validateEmail(email);
    if(isValidEmail=== true){
      const {data, error}= await supabase
        .from('user')
        .select('email')
        .eq('email', email)
      if(data.length>0){
        setConfirmEmail(false)
        console.log('이미 가입된 이메일 입니다.')
        window.alert(`이미 가입된 이메일 입니다.`)
      }else{
        setConfirmEmail(true)
        console.log('사용가능한 이메일 입니다')
        window.alert(`사용가능한 이메일 입니다.`)
      } 
    }else{
      console.log('양식이 틀렸습니다.')
      window.alert(`양식이 틀렸습니다.`)
    }
  }
  //비밀 번호 검사 
  const confirmFuntion = (e)=>{
    const {name, value} = e.target;
    if (name === 'password'){
      setPassword(value);
    }else if (name === 'confirmPassword'){
      setConfirmPassword(value)
    }
  }
   // 비밀번호와 비밀번호 확인 입력이 변경될 때 실행시킴
  useEffect(()=>{
    setPasswordsMatch(password === confirmPassword)
  },[password, confirmPassword])

  // setpasswordsMatch 상태가 변경될 때마다 실행해 취신 결과값 확인
  useEffect(() => {
    console.log(password, confirmPassword, passwordsMatch);
  }, [passwordsMatch]);

  const nextStep = async (e) =>{
    e.preventDefault(); //버튼 클릭시 마다 제출되는 것을 방지 하는 함수
    if(confirmEmail && passwordsMatch){
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })
      if(data.length>0){
        console.log(data)
        console.log('이메일의 인증 링크를 클릭하시오')  
        window.alert(`이메일로 인증 링크를 발송 하였습니다.`);
      }
      console.log(data)
      if (error) {
        console.error('Signup error:', error.message);
      }
    }

      const { data, error } = await supabase.auth.getSession()
      console.log(data)
  }   

  return (
    <div className="signup_container">
      <div><img className='e83_104' src="./icon/ic--round-arrow-back.svg" /></div>
      <span className="cookiewalk_logo">CookieWalk</span>
      <span className="e82_14">쿠키워크의 계정정보를 입력해주세요</span>
      <span className="e82_15">아래의 정보로 계정이 생성됩니다.</span>
      <form method = "/" >
        {/* 아이디 입력 */}
        <input type="text" className="userIdInput" onChange={(e)=>setemail(e.target.value)} value={email} placeholder="이메일를 입력해주세요" required/>
        <button type='submit' className="Id_double_check" onClick={onSubmitEmail}>중복확인</button>
        
        {/* 비밀번호 비밀 번호 입력부분 */}
        <input type={passwordVisible ? "text" : "password"} className="userPwInput" name="password" onChange={confirmFuntion} placeholder="비밀번호를 입력해주세요" required/>
        <button type="button" className="e83_30" onClick={togglePasswordVisibility}>
            <img className="e83_31" src={passwordVisible ? "./icon/mdi--eye.svg" : "./icon/mdi--eye-off.svg"} alt="Toggle Password Visibility"/>
        </button>
        <div className="e83_21">
          <div><img className="e83_22" src="./icon/ei--check.svg"/></div>
        </div>
        <span className="e83_24">영문 8자리이상 16자리 이하</span>
        <div className="e83_25">
          <div><img className="e83_26" src="./icon/ei--check.svg"/></div>
        </div>
        <span className="e83_29">숫자 포함</span>
        <input type={passwordConfirmVisible ? "text" : "password"} className="userPwInput2" name="confirmPassword" onChange={confirmFuntion} placeholder="비밀번호를 재입력해주세요" required/>
        <button type='button' className="e83_32" onClick={togglePasswordConfirmVisibility}>
          <img className="e83_33"  src={passwordConfirmVisible ? "./icon/mdi--eye.svg" : "./icon/mdi--eye-off.svg"} alt="Toggle Password Confirm Visibility"/>
        </button>
        <button  type="button" className='next1'onClick={nextStep}>다음</button>
      </form>
    </div>
  );
}