import { Link } from "react-router-dom"
import { supabase } from "../../supabaseClient"

export default function Unfinished_active({distance, time, count}){
    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(secs).padStart(2, '0')}s`;
    };

    return(
        <div className="Un_active">
            <div className="Unfinished_summary_box"></div>
    
            <div className="summary_box_title">기록</div>
    
            <div className="summary_box_label1">미완성한 그림 수</div>
            <div className="summary_box_value1">{count}개</div>
    
            <div className="e118_357"></div>
    
            <span className="summary_box_label2">활동 거리</span>
            <span className="summary_box_value2">{distance}km</span>
    
            <div className="e118_358"></div>
    
            <span className="summary_box_label3">활동 시간</span>
            <span className="summary_box_value3">{formatTime(time)}</span>
        </div>
    )
}