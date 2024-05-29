import React, { useEffect, useState } from 'react';
import './comment.css';
import { Link, useParams } from "react-router-dom";
import CommentContent from './CommentContent';
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext';

export default function Comment() {

    const userInfo = useToken();
    const userID = userInfo.user;  // 로그인 중인 사용자 uuid
    const { postID } = useParams();
    const [commentList, setCommentList] = useState([]);
    const [newComment, setNewComment] = useState("");
    const [userProfile, setUserProfile] = useState({});

    // 사용자 프로필 가져오기
    async function getUserProfile(userID) {
        const { data, error } = await supabase
            .from("user")
            .select("profile_image, nick_name")
            .eq("user_id", userID);

        if (error) {
            console.error("getUserProfile 에러", error);
        }

        if (data && data.length > 0) {
            setUserProfile(data[0]); // 배열의 첫 번째 요소로 설정
        }
    }

    // 댓글 삭제 
    async function deleteComment(commentID) {
        const { error } = await supabase
            .from('comment')
            .delete()
            .eq('comment_id', commentID);

        if (error) {
            console.error("deleteComment 에러", error);
        } else {
            getCommentList(postID); // 댓글 삭제 후 목록 갱신
        }
    }

    // 댓글 달기
    async function postComment() {
        if (newComment.trim() === "") {
            window.alert("댓글 내용이 비어있습니다.");
            return;
        }

        const { error } = await supabase
            .from("comment")
            .insert([{
                comment_id: `comment-${userID}-${new Date().toISOString()}`,
                user_id: userID,
                post_id: postID,
                content: newComment,
                created_at: new Date().toISOString()
            }]);

        if (error) {
            console.error("postComment 에러", error);
        } else {
            setNewComment(""); // 댓글 입력창 초기화
            getCommentList(postID); // 댓글 추가 후 목록 갱신
        }
    }

    // 댓글 가져오기
    async function getCommentList(postID) {
        const { data, error } = await supabase
            .from("comment")
            .select(`
                comment_id,
                user_id,
                post_id,
                content,
                created_at,
                user:user_id (
                    nick_name,
                    profile_image
                )
            `)
            .eq("post_id", postID)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("getCommentList 에러", error);
        }

        const formattedData = data.map(comment => ({
            ...comment,
            nick_name: comment.user.nick_name,
            profile_image: comment.user.profile_image
        }));

        setCommentList(formattedData); // 가져온 댓글 목록을 상태에 저장
    }

    useEffect(() => {
        getUserProfile(userID);
        window.scrollTo(0, 0);
    }, [userID]);

    useEffect(() => {
        getCommentList(postID); // 컴포넌트가 처음 마운트될 때 댓글 목록을 가져옴
        window.scrollTo(0, 0); // 페이지를 맨 위로 스크롤
    }, [postID]);

    return (
        <div className="comment-section-container">
            <div className="comment-title">댓글</div>
            <Link to='/home'><div><img className="comment-back-button" src="/icon/arrow.svg" alt="Back" /></div></Link>
            <div className="comment-section-divider"></div>

            {commentList.map(comment => (
                <CommentContent
                    key={comment.comment_id}
                    commentID={comment.comment_id}
                    userId={comment.user_id}
                    nickName={comment.nick_name}
                    profileImage={comment.profile_image}
                    comment={comment.content}
                    createdAt={comment.created_at}
                    deleteComment={deleteComment}
                    userID={userID}
                />
            ))}

            <div className="comment-input-wrapper">
                <img className="comment-input-avatar" src={userProfile.profile_image} alt="Avatar" />
                <input
                    className="comment-input-box"
                    type="text"
                    placeholder={`${userProfile.nick_name}으로 댓글 달기`}
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                />
                <button className='comment-input-button' onClick={postComment}><img className='comment-input-icon' src="./icon/round-arrow-up-bold.svg" alt="" /></button>
            </div>
        </div>
    );
}