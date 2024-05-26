import React, { useEffect, useState } from 'react';
import './comment.css'
import { Link, useNavigate } from "react-router-dom";
import CommentContent from './CommentContent';

export default function Comment(){

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

	return (
    <div className="comment-section-container">
        <div className="comment-title">댓글</div>
        <Link to='/home'><div><img className="comment-back-button" src="../../public/icon/arrow.svg" alt="Back" /></div></Link>
        <div className="comment-section-divider"></div>

        <CommentContent />
        <CommentContent />
        <CommentContent />

            <div className="comment-input-wrapper">
                <img className="comment-input-avatar" src="../../public/images/ellipse_7.png" alt="Avatar" />
                <input
                    className="comment-input-box"
                    type="text"
                    placeholder="good_running_day(으)로 댓글 달기"
                />
            </div>
    </div>
    );
}
