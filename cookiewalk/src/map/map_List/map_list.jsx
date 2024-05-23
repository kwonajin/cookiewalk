import { Link } from "react-router-dom";
import { supabase } from "../../supabaseClient";


export default function MapList({location, title, distance, level, time}) {
    // console.log(title)
return(
    <div className="map_list1">
    <div className="map_list1_box"></div>
    <div className="map_list1_location">{location}</div>
    <div><img className="map_list1_picture" src="./images/group1.png" alt="" /></div>

    {/* 여기에 위치 정보 넣는란도 추가 희망 */}
    <div><img className='map_list1_distance_icon' src="./icon/run.svg"/></div>
    <div className="map_list1_distance_value">{distance}km</div>
    
    <div><img className='map_list1_time_icon' src="./icon/place.svg"/></div>
    <div className="map_list1_time_value">장소 넣기 (시/동)</div>

    <div><img className='map_list1_rate_icon' src="./icon/round-star.svg"/></div>
    <div className="map_list1_rate_value">{level}</div>
    </div>
    )
}