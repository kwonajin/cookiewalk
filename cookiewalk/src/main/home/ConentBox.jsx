import { supabase } from "../../supabaseClient"

export default function ContentBox() {
    return(
        <div className='content_box'>
      <div><img className='home_profile_img' src='./images/ellipse_7.png'/></div>
      <div className="name">running_go</div>
      <div className="home_place">부산 광안리</div>
      <div className="dotmenu"><img className="dotmenu_icon" src="./icon/dotmenu.svg" alt="" /></div>

      <div className=""><img className='content_img' src='./images/rectangle_2.png'/></div>
      <div className="comment_name">running_go</div>
      <div className="contents">오랜만에 모닝 러닝한 날🌄👟 오랜만에 모닝 러닝한 날🌄👟오랜만에 모닝 러닝한 날🌄👟 오랜만에 모닝 러닝한 날🌄👟오랜만에 모닝 러닝한 날🌄👟 오랜만에 모닝 러닝한 날🌄👟</div>
      <div className="comment_num">댓글 3개 모두 보기</div>
      <div className="date">4월 13일</div>
      <div className="like">좋아요 129개</div>
      <div className="home_distance">거리 8.11km</div>
      <div className="time">시간 3h 13m</div>

      <div className="heart"><img className="heart_icon" src="./icon/heart.svg" alt="" /></div>
      <div className="comment"><img className="comment_icon" src="./icon/comment.svg" alt="" /></div>
      <div className="save"><img className="save_icon" src="./icon/save.svg" alt="" /></div>
      <div className="share"><img className="share_icon" src="./icon/share.svg" alt="" /></div>
      </div>
    )
}