import React, { useState, useEffect } from 'react';
import './write_map_choice.css'; 
import { Link } from "react-router-dom";

export default function WriteMap_choice() {


    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    return (
        <div className="writeMap-choice-page">
        <Link to="/home">
            <div className="writeMap_choice_back">
                <img className='writeMap_choice_back_icon' src="./icon/arrow.svg" alt="Back" />
            </div>
        </Link>

        <div className="writeMap_choice_title">새 게시물</div>

        <Link to='/finished_art'><button type="button" className='my_route_upload'>내 경로 등록</button></Link>
        <Link to='/mygroup'><button type="button" className='my_group_route_upload'>그룹 경로 등록</button></Link>
        
    </div>
    );
}
