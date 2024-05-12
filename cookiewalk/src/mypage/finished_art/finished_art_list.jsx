import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";

export default function Finished_List() {
    return(
    
        <div className="Unfinished_list1">
        
        {/* 경로 사진 */}
        <div><img className='Unfinished_list1_picture' src="./images/group1.png" /></div>

        <span className="Unfinished_list1_location">부산 수영구 광안동</span>
        
        <div><img className='Unfinished_list1_distance_icon' src="./icon/run.svg"/></div>
        <div className="Unfinished_list1_distance_value">0.00km</div>

        <div><img className='Unfinished_list1_time_icon' src="./icon/clock.svg"/></div>
        <div className="Unfinished_list1_time_value">0h 0m</div>

        <div><img className='Unfinished_list1_rate_icon' src="./icon/sand-timer.svg"/></div>
        <div className="Unfinished_list1_rate_value">0%</div>

        </div>
    )
    }