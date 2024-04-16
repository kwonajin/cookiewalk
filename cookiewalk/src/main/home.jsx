import './home.css'; // CSS 파일을 import 합니다.

export default function Home() {
  return (
    <><div className="background">
      <div className="topnav">
        <div className="homenav">
          <a href="http://www.naver.com"><div className="write"><img className="write_icon" src="./icon/write.svg" alt="" /></div></a>
          <div className="home_title">홈</div>
          <a href="http://www.naver.com"><div className="notification"><img className="notification_icon" src="./icon/notification.svg" alt="" /></div></a>
          <a href="#"><div className="friendadd"><img className="friendadd_icon" src="./icon/friendadd.svg" alt="" /></div></a>
          <div className="homenav_line"></div>
        </div>

        <div className="active">
          <div className="my_active">나의s이번주 활동</div>
          <div className="e7_21">자세히보기</div>
          <div className="e7_16">완성한 그림 수</div>
          <div className="e7_13">0개</div>
          <div className="e7_17">활동 거리</div>
          <div className="e7_14">0.00km</div>
          <div className="e7_18">활동 시간</div>
          <div className="e7_15">0h 0m</div>
          <div className="e7_19"></div>
          <div className="e7_20"></div>
        </div>
      </div>

      <div><img className='e7_22' src='./images/ellipse_7.png'/></div>
      <div className="name">running_go</div>
      <div className="place">부산 광안리</div>

      <div className=""><img className='e11_2' src='./images/rectangle_2.png'/></div>
      <div className="comment_name">running_go</div>
      <div className="contents">오랜만에 모닝 러닝한 날 ️🌄👟 오랜만에 모닝 러닝한 날 ️🌄👟오랜만에 모닝 러닝한 날 ️🌄👟 오랜만에 모닝 러닝한 날 ️🌄👟오랜만에 모닝 러닝한 날 ️🌄👟 오랜만에 모닝 러닝한 날 ️🌄👟</div>
      <div className="comment_num">댓글 3개 모두 보기</div>
      <div className="date">4월 13일</div>
      <div className="like">좋아요 129개</div>
      <div className="distance">거리 8.11km</div>
      <div className="time">시간 3h 13m</div>

      <div className="heart"><img className="heart_icon" src="./icon/heart.svg" alt="" /></div>
      <div className="comment"><img className="comment_icon" src="./icon/comment.svg" alt="" /></div>
      <div className="save"><img className="save_icon" src="./icon/save.svg" alt="" /></div>
      <div className="dotmenu"><img className="dotmenu_icon" src="./icon/dotmenu.svg" alt="" /></div>
      <div className="share"><img className="share_icon" src="./icon/share.svg" alt="" /></div>

    </div><div className="navbar">
        <a href="./index.html"><div className="home"><img className="home_icon" src="./icon/home.svg" alt="" /></div></a>
        <a href="#"><div className="map"><img className="map_icon" src="./icon/map.svg" alt="" /></div></a>
        <a href="#"><div className="run"><img className="run_icon" src="./icon/record.svg" alt="" /></div></a>
        <a href="#"><div className="group"><img className="group_icon" src="./icon/group.svg" alt="" /></div></a>
        <a href="./mypage/mypage.jsx"><div className="my"><img className="my_icon" src="./icon/my.svg" alt="" /></div></a>
      </div></>
  );
}
