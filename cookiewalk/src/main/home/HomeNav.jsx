import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";



export default function HomeNav() {
    return(
        <div className="homenav">
          <Link to="/write"><div className="write"><img className="write_icon" src="./icon/write.svg" alt="" /></div></Link>
          <div className="home_title">홈</div>
          <Link to="/notice"><div className="notification"><img className="notification_icon" src="./icon/notification.svg" alt="" /></div></Link>
          <Link to="/friend"><div className="friendadd"><img className="friendadd_icon" src="./icon/friendadd.svg" alt="" /></div></Link>
          <div className="homenav_line"></div>
        </div>
    )
}