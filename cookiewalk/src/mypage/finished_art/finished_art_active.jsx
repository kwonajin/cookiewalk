import { Link } from "react-router-dom"
import { supabase } from "../../supabaseClient"

export default function Finished_active(){
    return(
        <div className="Un_active">
            <div className="Unfinished_summary_box"></div>
    
            <div className="summary_box_title">완성한 그림</div>
    
            <div className="summary_box_label1">완성한 그림 수</div>
            <div className="summary_box_value1">1개</div>
    
            <div className="e118_357"></div>
    
            <span className="summary_box_label2">활동 거리</span>
            <span className="summary_box_value2">0.00km</span>
    
            <div className="e118_358"></div>
    
            <span className="summary_box_label3">활동 시간</span>
            <span className="summary_box_value3">0h 0m</span>
        </div>
    )
}