import React from 'react';
import { Link } from "react-router-dom";

export default function Follower_list({ follower, userEmail, index, handleFollowClick }){
    return(
        <div className='follower1'>
            <Link to={`/home_personal_profile/${follower.user_id}`}>
                <img className= 'follower1_profile' src={follower.profile_image} alt={`${follower.nick_name}'s profile`} />
                <div className='follower1_text'>
                <div className='follower1_id'>{follower.nick_name}</div>
                <div className='follower1_name'>{follower.name}</div>
                </div>
            </Link>
            <button 
                className={`follower1_follow ${follower.isFollowing ? 'following' : ''}`}
                onClick={() => handleFollowClick(userEmail, follower.following_email, index)}>
                {follower.isFollowing ? "팔로잉" : "팔로우"}
            </button>
            <div className='follower1_line'></div>
        </div>
    );
};