import './Signup4.css'
import { Link } from "react-router-dom";

export default function Signup4(){

return (
<div className="signup4_container">
    <span className="cookiewalk_logo">CookieWalk</span>
    <span className="e83_66">상세정보 입력 완료!</span>
    <img className='cookielogo' src="../public/images/new_cookie_logo.png" alt="" />
    <span className="e83_86">세상을 당신의 캔버스로, 쿠키워크</span>
    <span className="e83_85">쿠키워크와 새로운 여정을 떠나볼까요?</span>
    <Link to="/home"><button className='go_login'>런닝하러 가기</button></Link>
</div>
);
}
