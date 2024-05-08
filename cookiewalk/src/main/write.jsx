import React, { useState, useEffect } from 'react';
import './write.css'; 
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient'
import { useToken } from '../context/tokenContext'

export default function Write() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);

  const userInfo = useToken();
  const userID = userInfo.user;

  // 파일 업로드 함수
  const handleFileUpload = async () => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${userID}_${new Date().toISOString()}.${fileExt}`;
    const filePath = `POST/${fileName}`;

    let { error: uploadError, data: uploadData } = await supabase.storage
      .from('image')
      .upload(filePath, file);

      console.log(file)
      console.log(filePath)

    if (uploadError) {
      throw new Error('Failed to upload image');
    }

    // 파일 URL 반환
    return uploadData.Key;
  };

  // 게시물 제출 함수
  const submitPost = async (e) => {
    e.preventDefault();
    try {
      // 파일 업로드
      const filePath = await handleFileUpload();
      const createdAt = new Date();
      const postID = `${userID}_${createdAt.toISOString()}`;

      // 파일 URL을 public URL로 변환
      const { publicURL, error: urlError } = supabase.storage
        .from('image')
        .getPublicUrl(filePath);

      if (urlError) throw new Error('Failed to get public URL');

      // 게시물 데이터 삽입
      const { data, error } = await supabase.from('post').insert({
        post_id: postID,
        user_id: userID,
        walking_record_id: 'example',
        content: text,
        image: publicURL,
        locate: '부산',
        created_at: createdAt
      });

      if (error) throw new Error('Failed to insert post');

      console.log('Insert success:', data);
      navigate('/home'); // 성공적으로 게시 후 홈으로 리다이렉션
    } catch (error) {
      console.error('Error:', error.message);
    }
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  return (
    <div className="write-page">
      <Link to="/home"><div className="write_back"><img className='write_back_icon' src="./icon/arrow.svg" alt="" /></div></Link>
      <div className="write_title">새 게시물</div>
      <div className="write_add" onClick={submitPost}>작성</div>
      <textarea className="write_text" placeholder="나의 활동을 공유하세요!" value={text} onChange={(e) => setText(e.target.value)} />
      <div className="write_navbar">
        <input className='picture_add' type="file" accept='image/*' onChange={handleFileChange} />
        <div className="picture1"></div>
        <div className="picture2"></div>
      </div>
    </div>
  );
}
    