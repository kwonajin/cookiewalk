import React from 'react';
import './comment.css';

export default function CommentContent({ commentID, userId, nickName, profileImage, comment, createdAt, deleteComment, userID }) {
    return (
        <div className="comment-wrapper">
            <img className="comment-avatar" src={profileImage} alt="Avatar" />
            <div>
                <div className="comment-username">{nickName}</div>
                <div className="comment-time">{new Date(createdAt).toLocaleDateString()}</div>
                {userId === userID && (
                    <img className='comment-delete-button' src="/icon/comment-delete.svg" alt="Delete" onClick={() => deleteComment(commentID)} />
                )}
                <div className="comment-content">{comment}</div>
            </div>
        </div>
    );
}
