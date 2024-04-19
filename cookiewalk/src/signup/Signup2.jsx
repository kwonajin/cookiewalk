import './Signup2.css'
import { Link } from "react-router-dom";

export default function Singup2() {
return (
    <div className="signup2_container">
        <div ><img className="e83_102" src="./icon/ic--round-arrow-back.svg" alt="" /></div>
        <span className="cookiewalk_logo">CookieWalk</span>
        <span className="e83_36">이메일 인증을 진행해주세요</span>
        <span className="e83_41">입력하신 이메일로 인증번호를 발송합니다</span>
        <form action="/" method = "/">
            <input type="text" className="userEmailinput" placeholder="이메일을 입력해주세요" required/>
            <button type='submit' className="userEmailinput_btn">발급</button>
            <span className="e83_59">이메일 인증코드 입력</span>
            <input type="text" className="userEmailconfirm" required/>
            {/* <span className="e89_19">올바르지 않은 입력입니다</span> */}
            {/* 이메일 입력이 틀릴 시 나오게 할 부분 */}
            <button className="next">다음</button>
        </form>
        </div>
    );
}
