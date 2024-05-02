import React from 'react';
import './Unfinished_route.css'

export default function Unfinished_route() {
return (
    <div className="Unfinished_route_container">
        <div><img className="Unfinished_back_arrow" src="./icon/ic--round-arrow-back.svg"/></div>
        

        <div className="Unfinished_route_title">미완성 경로</div>
        <div className="e236_59"></div>

        <div className="Unfinished_summary_box"></div>

        <div className="summary_box_title">기록</div>

        <div className="summary_box_label1">미완성한 그림 수</div>
        <div className="summary_box_value1">1개</div>

        <div className="e118_357"></div>

        <span className="summary_box_label2">활동 거리</span>
        <span className="summary_box_value2">0.00km</span>

        <div className="e118_358"></div>

        <span className="summary_box_label3">활동 시간</span>
        <span className="summary_box_value3">0h 0m</span>

        {/* 리스트1 */}
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
        
        {/* 리스트2 */}
        <div className="Unfinished_list2">
        
        {/* 경로사진 */}
        <div><img className='Unfinished_list2_picture' src="./images/group2.png"/></div>

        <span className="Unfinished_list2_location">부산 수영구 수영동</span>

        <div><img className='Unfinished_list2_distance_icon' src="./icon/run.svg"/></div>
        <div className="Unfinished_list2_distance_value">0.00km</div>

        <div><img className='Unfinished_list2_time_icon' src="./icon/clock.svg"/></div>
        <div className="Unfinished_list2_time_value">0h 0m</div>

        <div><img className="Unfinished_list2_rate_icon" src="./icon/sand-timer.svg" alt="" /></div>
        <span className="Unfinished_list2_rate_value">0%</span>

        </div>

    </div>
);
}