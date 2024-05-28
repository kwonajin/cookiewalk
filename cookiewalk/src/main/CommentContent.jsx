import React from 'react';
import './comment.css';

export default function CommentContent({ commentID, userId, nickName, profileImage, comment, createdAt, deleteComment, userID }) {
    return (
        <div className="comment-wrapper">
            <img className="comment-avatar" src={profileImage} alt="Avatar" />
            <div className="comment-username">{nickName}</div>
            <div className="comment-time">{new Date(createdAt).toLocaleDateString()}</div>
            <div>
                {userId === userID && (
                     <img className='comment-delete-button' src="../../public/icon/comment-delete.svg" alt="Delete" onClick={() => deleteComment(commentID)} />
                )}
            </div> 
            <div className="comment-content">{comment}</div>
        </div>
    );
}
