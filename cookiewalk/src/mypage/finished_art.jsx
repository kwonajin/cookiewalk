import React, { useEffect, useState } from 'react';
import './finished_art.css'
import { Link } from "react-router-dom";
import Finished_active from './finished_art/finished_art_active';
import Finished_List from './finished_art/finished_art_list';


export default function FinishedArt() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

return (
    <div className="Unfinished_route_container">
        <div className='Unfinished_nav'>
            <Link to='/mypage'><div><img className="Unfinished_back_arrow" src="./icon/arrow.svg"/></div></Link>
            <div className="Unfinished_route_title">완성한 그림</div>
            <div className="Unfinished_title_active_line"></div>
        </div>

        <Finished_active></Finished_active>
        


        <Finished_List></Finished_List>
        <Finished_List></Finished_List>
        <Finished_List></Finished_List>
        <Finished_List></Finished_List>
        {/* 위의 방법으로 하는 대신 갯수제한 */}

    </div>
);
}