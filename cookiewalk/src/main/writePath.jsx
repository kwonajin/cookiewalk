import React, { useState, useEffect } from 'react';
import './write.css'; 
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient'
import { useToken } from '../context/tokenContext'

export default function WritePath() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const userInfo = useToken();
  const userID = userInfo.user;

  const handleFileUpload = async () => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${userID}_${new Date().toISOString()}.${fileExt}`;
    const filePath = `POST/${fileName}`;

    let { error: uploadError, data: uploadData } = await supabase.storage
      .from('image')
      .upload(filePath, file);

    if (uploadError) {
      throw new Error('Failed to upload image');
    }

    // Assuming the bucket 'image' is set to public, construct the URL directly
    return `https://rbdbdnushdupstmiydea.supabase.co/storage/v1/object/public/image/${filePath}`;
  };

  const submitPost = async () => {
    if (!text || !file) {
      alert('모든 필드를 채워주세요.');
      return;
    }
    setIsLoading(true);
    try {
      const newImageUrl = await handleFileUpload();
    
      const createdAt = new Date().toISOString();
      const postID = `${userID}_${createdAt}`;
    
      const { data, error } = await supabase.from('post').insert({
        post_id: postID,
        user_id: userID,
        walking_record_id: 'example', // Update this value according to your context
        content: text,
        image: newImageUrl,
        locate: '부산',
        created_at: createdAt
      });
    
      if (error) {
        throw new Error('Failed to insert post');
      }
    
      console.log('Insert success:', data);
      navigate('/home');
    } catch (error) {
      console.error('Error:', error.message);
      alert(error.message);
    } finally {
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="WritePath-page">
      <Link to="/home">
        <div className="WritePath_back">
          <img className='WritePath_back_icon' src="./icon/arrow.svg" alt="Back" />
        </div>
      </Link>
      <div className="WritePath_title">새 게시물</div>
      <button className="WritePath_add" onClick={submitPost} disabled={isLoading}>
        {isLoading ? '작성 중...' : '작성'}
      </button>
      <textarea className="WritePath_text" placeholder="나의 활동을 공유하세요!" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="WritePath_navbar">
        <input className='picture_add' type="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])} />
        <div className="picture1"></div>
        <div className="picture2"></div>
      </div>
    </div>
  );
}
