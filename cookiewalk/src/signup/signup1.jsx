import './signup1.css'

export default function signup1() {
  return (
    <div className="e82_6">
      <span className="e82_14">쿠키워크의 계정정보를 입력해주세요</span>
      <input type="text" className="e82_8" placeholder="아이디를 입력해주세요" />
      <div className="e82_9"></div>
      <span className="e83_81">비밀번호를 입력해주세요</span>
      <div className="e83_19"></div>
      <div className="e82_10"></div>
      <span className="e82_15">아래의 정보로 계정이 생성됩니다.</span>
      <button className="e82_16">중복확인</button>
      <span className="e83_18">다음</span>
      <div className="e83_21">
        <div><img className="e83_22" src="./icon/ei--check.svg"/></div>
      </div>
      <span className="e83_24">영문 8자리이상 16자리 이하</span>
      <span className="e83_29">숫자 포함</span>
      <div className="e83_25">
        <div><img className="e83_26" src="./icon/ei--check.svg"/></div>
      </div>
      <div className="e83_30">
        <div><img className="e83_31" src="./icon/mdi--eye.svg"/></div>
      </div>
      <div className="e83_32">
        <div><img className="e83_33" src="./icon/mdi--eye.svg"/></div>
      </div>
      <span className="e83_80">비밀번호를 재입력해주세요</span>
      <span className="e83_103">CookieWalk</span>
      <div><img className='e83_104' src="./icon/ic--round-arrow-back.svg" /></div>
    </div>
  );
}
