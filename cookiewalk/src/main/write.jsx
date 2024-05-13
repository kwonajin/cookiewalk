import React, { useState, useEffect } from 'react';
import './write.css'; 
import { Link, useNavigate } from "react-router-dom";
import { supabase } from '../supabaseClient'
import { useToken } from '../context/tokenContext'

export default function Write() {
  const navigate = useNavigate();
  const [text, setText] = useState("");
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null); // 미리보기 URL 상태 추가
  
  const userInfo = useToken();
  const userID = userInfo.user;

    // 파일 인풋을 트리거하는 함수
    const triggerFileInput = () => {
      document.getElementById('fileInput').click();
    };

    // 파일 선택 시 실행될 함수
    const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFile(file);
      // FileReader를 사용하여 파일 읽기
      const reader = new FileReader();
      reader.onloadend = () => {
        // 읽기가 완료되면 결과를 previewUrl 상태에 저장
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
    <div className="write-page">
      <Link to="/home">
        <div className="write_back">
          <img className='write_back_icon' src="./icon/arrow.svg" alt="Back" />
        </div>
      </Link>
      
      <div className="write_title">새 게시물</div>
      <button className="write_add" onClick={submitPost} disabled={isLoading}>
        {isLoading ? '작성 중...' : '작성'}
      </button>

      {/* <div className='Picture_add_box'><input className='picture_add' type="file" accept='image/*' onChange={(e) => setFile(e.target.files[0])} /></div> */}

      <div className='Picture_add_box'>
        {/* 숨겨진 파일 인풋 */}
        <input id="fileInput" className='picture_add' type="file" accept='image/*' onChange={handleFileChange} />
        {/* 사용자 정의 아이콘으로 파일 인풋 트리거 - 이미지가 없을 때만 보여줍니다 */}
        {!previewUrl && <img src='./icon/camera.svg' className="picture_add_icon" onClick={() => document.getElementById('fileInput').click()} alt="Upload" />}
        {/* 이미지 미리보기 - 이미지가 있을 때만 보여줍니다 */}
        {previewUrl && <img src={previewUrl} alt="Preview" className="image_preview" />}
      </div>  


      <textarea className="write_text" placeholder="나의 활동을 공유하세요!" value={text} onChange={(e) => setText(e.target.value)} />
    </div>
  );
}
