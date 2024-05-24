import { Link } from "react-router-dom"
import { supabase } from "../../supabaseClient"

export default function Finished_active({distance, time, count}){
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
    };
    return(
        <div className="Fi_active">
            <div className="finished_summary_box"></div>
    
            <div className="f_summary_box_title">완성한 그림</div>
    
            <div className="f_summary_box_label1">완성한 그림 수</div>
            <div className="f_summary_box_value1">{count}개</div>
    
            <div className="fa_line1"></div>
    
            <span className="f_summary_box_label2">활동 거리</span>
            <span className="f_summary_box_value2">{distance}km</span>
    
            <div className="fa_line2"></div>
    
            <span className="f_summary_box_label3">활동 시간</span>
            <span className="f_summary_box_value3">{formatTime(time)}</span>
        </div>
    )
}