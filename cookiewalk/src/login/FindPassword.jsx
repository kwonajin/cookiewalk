import './FindPassword.css'
import React from 'react';
import { Link, useNavigate } from "react-router-dom";
import {supabase} from '../supabaseClient'

export default function FindPassword() {
return (
    <div className="FindPassword_container">

        <Link to='/'><div><img className="find_ps_back_icon" src="./icon/ic--round-arrow-back.svg" alt="" /></div></Link>
        
        <span className="FindPassword_logo1">CookieWalk</span>
        <div><img className="FindsPassword_logo2" src="./images/new_cookie_logo.png" alt="" /></div>

        <form method='/'>
            <input type="text" className="find_ps_email_input" placeholder="이메일을 입력해주세요" required/>
    
            <Link to='/find_ps2'><button  type="button" className='find_ps_next1'>다음</button></Link>
    
            <span className="e277_26">비밀번호를 찾고자하는 이메일을 입력해주세요.</span>
        </form>

        
    </div>
);
}

