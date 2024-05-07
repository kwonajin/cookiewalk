import React, { useEffect, useState } from 'react';
import './Unfinished_route.css'
import { Link } from "react-router-dom";
import Unfinished_active from './Unfinished_route_list/Unfinished_route_active';
import Unfinished_List from './Unfinished_route_list/Unfinished_route_list';


export default function Unfinished_route() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

return (
    <div className="Unfinished_route_container">
        <Link to='/BeforeStart'><div><img className="Unfinished_back_arrow" src="./icon/ic--round-arrow-back.svg"/></div></Link>
        

        <div className="Unfinished_route_title">미완성 경로</div>
        <div className="e236_59"></div>

        <Unfinished_active></Unfinished_active>
        

        <Unfinished_List></Unfinished_List>
        <Unfinished_List></Unfinished_List>
        <Unfinished_List></Unfinished_List>
        <Unfinished_List></Unfinished_List>
        <Unfinished_List></Unfinished_List>
        {/* 위의 방법으로 하는 대신 갯수제한 */}

    </div>
);
}