import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";


export default function MapList() {
return(
    <div className="map_list1">
    <div className="map_list1_box"></div>
    <div className="map_list1_location">부산 수영구 광안동</div>
    <div><img className="map_list1_picture" src="./images/group1.png" alt="" /></div>

    <div><img className='map_list1_distance_icon' src="./icon/run.svg"/></div>
    <div className="map_list1_distance_value">4.0km</div>

    <div><img className='map_list1_time_icon' src="./icon/clock.svg"/></div>
    <div className="map_list1_time_value">1h 0m</div>

    <div><img className='map_list1_rate_icon' src="./icon/sand-timer.svg"/></div>
    <div className="map_list1_rate_value">중</div>
    </div>
    )
}