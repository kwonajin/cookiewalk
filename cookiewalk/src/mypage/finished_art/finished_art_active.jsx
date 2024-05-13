import { Link } from "react-router-dom"
import { supabase } from "../../supabaseClient"

export default function Finished_active(){
    return(
        <div className="Fi_active">
            <div className="finished_summary_box"></div>
    
            <div className="f_summary_box_title">완성한 그림</div>
    
            <div className="f_summary_box_label1">완성한 그림 수</div>
            <div className="f_summary_box_value1">1개</div>
    
            <div className="fa_line1"></div>
    
            <span className="f_summary_box_label2">활동 거리</span>
            <span className="f_summary_box_value2">0.00km</span>
    
            <div className="fa_line2"></div>
    
            <span className="f_summary_box_label3">활동 시간</span>
            <span className="f_summary_box_value3">0h 0m</span>
        </div>
    )
}