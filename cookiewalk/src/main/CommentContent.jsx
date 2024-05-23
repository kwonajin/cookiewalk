import React from 'react';


export default function CommentContent()
{
    return(
    <div className="comment-wrapper">
        <img className="comment-avatar" src="./images/ellipse_7.png" alt="Avatar" />
        <div className="comment-username">good_running_day</div>
        <div className="comment-time">12시간</div>
        <div><img className='comment-delete-button' src="./icon/comment-delete.svg" alt="" /></div>
        <div className="comment-content">너무 멋있어</div>
        <div className="comment-divider"></div>
    </div>
    );
}