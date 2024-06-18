import React, { useEffect, useState } from 'react';
import './shop.css'; // 필요한 CSS 파일
import { Link, useNavigate } from "react-router-dom";
import { useToken } from '../../../context/tokenContext';
import { supabase } from '../../../supabaseClient';
import logo from "../images/logo.png"

// Supabase 스토리지에서 특정 버킷과 폴더의 파일 목록을 가져오는 함수
async function listFilesInFolder(bucketName, folderPath) {
  const { data, error } = await supabase
    .storage
    .from(bucketName)
    .list(folderPath, {
      limit: 100, // 최대 100개의 파일 목록을 가져옴
      offset: 0,
    });

  if (error) {
    console.error("Error Listing Files", error); // 파일 목록 가져오기 실패 시 에러 출력
    return [];
  }

  console.log("파일", data); // 가져온 파일 목록 출력
  return data;
}

// Supabase 스토리지에서 파일의 공개 URL을 가져오는 함수
function getPublicUrl(bucketName, filePath) {
  const { data } = supabase
    .storage
    .from(bucketName)
    .getPublicUrl(filePath);

  if (!data) {
    console.error("Error getting public URL"); // URL 가져오기 실패 시 에러 출력
    return null;
  }

  return data.publicUrl; // 공개 URL 반환
}

// Supabase 데이터베이스에서 avatar 컬럼을 업데이트하는 함수
async function updateAvatar(userID, avatarValue) {
  const { error } = await supabase
    .from('user')
    .update({ avatar: avatarValue })
    .eq('user_id', userID); // 특정 사용자 ID에 해당하는 레코드 업데이트

  if (error) {
    console.error("Error updating avatar", error); // 업데이트 실패 시 에러 출력
  } else {
    console.log("Avatar updated successfully"); // 업데이트 성공 시 메시지 출력
  }
}

// Supabase 데이터베이스에서 현재 사용자의 avatar 값을 가져오는 함수
async function getUserAvatar(userID) {
  const { data, error } = await supabase
    .from('user')
    .select('avatar')
    .eq('user_id', userID)
    .single(); // 단일 레코드 가져오기

  if (error) {
    console.error("Error fetching user avatar", error); // 가져오기 실패 시 에러 출력
    return null;
  }

  return data.avatar; // avatar 값 반환
}

export default function Shop() {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const userInfo = useToken(); // 사용자 정보를 가져오는 훅
  const userID = userInfo.user; // 사용자 ID
  const [images, setImages] = useState([]); // 이미지 목록을 저장하는 상태 변수
  const [currentAvatar, setCurrentAvatar] = useState(''); // 현재 사용 중인 아바타를 저장하는 상태 변수

  // 컴포넌트가 마운트될 때 파일 목록과 공개 URL을 가져와 상태를 업데이트하는 함수
  useEffect(() => {
    async function fetchImages() {
      const files = await listFilesInFolder('image', 'avatar'); // 'image' 버킷의 'avatar' 폴더의 파일 목록을 가져옴
      const imageUrls = files.map((file) => {
        const url = getPublicUrl('image', `avatar/${file.name}`); // 각 파일의 공개 URL을 가져옴
        console.log("Public URL:", url);
        return { url, name: file.name.replace('.png', '') }; // URL과 파일 이름(.png 확장자 제거)을 반환
      });
      setImages(imageUrls); // 이미지 상태를 업데이트

      const avatar = await getUserAvatar(userID); // 현재 사용자 아바타 값을 가져옴
      setCurrentAvatar(avatar); // 현재 아바타 상태를 업데이트
    }

    fetchImages(); // 함수 호출
  }, [userID]);

  // 아바타를 업데이트하는 함수
  const handleAvatarUpdate = (avatarValue) => {
    updateAvatar(userID, avatarValue); // 아바타 값을 업데이트하는 함수 호출
    setCurrentAvatar(avatarValue); // 현재 아바타 상태를 업데이트
  };

  return (
    <div className="shop-container">
      <div className="group_background">
        <div className='groupnav'>
          <div className="group_title">상점</div> {/* 상점 제목 */}
          <div className="group_line"></div> {/* 상점 제목 아래 선 */}
        </div>
        <input
          className="searchbar"
          type="text"
          placeholder="검색"
        />
        <div className="search">
          <img className='search_icon' src="./icon/search.svg" alt="Search Icon" />
        </div>

        <select className='region_select_box'>
          <option value="avatar">아바타</option>
          <option value="option1">미정1</option>
          <option value="option2">미정2</option>
          <option value="option3">미정3</option>
          <option value="option4">미정4</option>
        </select>
        <select className='sort_box'>
          <option value="distance">오름차순</option>
          <option value="under5km">내림차순</option>
          <option value="under10km">가격순</option>
          <option value="under15km">인기순</option>
        </select>

        <div className='GroupList_container'>
          <div className="No0">
            <img src={logo}></img> {/* 기본 아바타 이미지 */}
            <p>No0_original</p> {/* 기본 아바타 이름 */}
            <button 
              onClick={() => handleAvatarUpdate("No0")}
              disabled={currentAvatar === "No0"} // 현재 아바타가 No0이면 버튼 비활성화
            >
              {currentAvatar === "No0" ? "사용중" : "사용하기"} {/* 현재 아바타가 No0이면 '사용중' 표시 */}
            </button>
          </div>
          {images.map((image, index) => (
            <div key={index} className={`No${index+1}`}>
              <img src={image.url} alt={`Image ${index+1}`} /> {/* 아바타 이미지 */}
              <p>{image.name}</p> {/* 아바타 이름 (확장자 제거) */}
              <button 
                onClick={() => handleAvatarUpdate(`No${index+1}`)}
                disabled={currentAvatar === `No${index+1}`} // 현재 아바타가 No1, No2, ...이면 버튼 비활성화
              >
                {currentAvatar === `No${index+1}` ? "사용중" : "사용하기"} {/* 현재 아바타가 No1, No2, ...이면 '사용중' 표시 */}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="navbar">
        <Link to="/home"><div className="home"><img className="group_home_icon" src="./icon/home.svg" alt="Home" /></div></Link>
        <Link to="/map"><div className="map"><img className="group_map_icon" src="./icon/map.svg" alt="Map" /></div></Link>
        <Link to="/BeforeStart"><div className="run"><img className="group_run_icon" src="./icon/record.svg" alt="Run" /></div></Link>
        <Link to="/group"><div className="group"><img className="group_group_icon" src="./icon/group.svg" alt="Group" /></div></Link>
        <Link to="/mypage"><div className="my"><img className="group_my_icon" src="./icon/my.svg" alt="My Page" /></div></Link>
        <Link to="/draw_group_map" className="group_floating-add-button">
          <img className='group_floating-add-button-icon' src="./icon/write.svg" alt="Add Map" />
        </Link>
      </div>
    </div>
  );
}
