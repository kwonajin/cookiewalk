import { Link } from "react-router-dom"
import { supabase } from "../../supabaseClient"



export default function Active() {
    return(
        <div className="active">
        <div className="my_active">나의 이번주 활동</div>
        <Link to="/mypage" ><div className="detail">자세히보기</div></Link>
        <div className="art">완성한 그림 수</div>
        <div className="art_num">0개</div>
        <div className="home_line1"></div>
        <div className="active_distance">활동 거리</div>
        <div className="active_distance_num">0.00km</div>
        <div className="home_line2"></div>
        <div className="active_time">활동 시간</div>
        <div className="active_time_num">0h 0m</div>
      </div>
    )
    
}