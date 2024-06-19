import React, { useEffect, useState } from 'react';
import './shop.css'; // 필요한 CSS 파일
import { Link, useNavigate } from "react-router-dom";
import { useToken } from '../../../context/tokenContext';
import { supabase } from '../../../supabaseClient';
import logo from "../images/logo.png";

// Supabase 데이터베이스에서 아이템 목록을 가져오는 함수
async function fetchItems() { 
  const { data, error } = await supabase
    .from('item')
    .select('*');

  if (error) {
    console.error("Error fetching items", error); // 아이템 목록 가져오기 실패 시 에러 출력
    return [];
  }

  console.log("아이템 목록", data); // 가져온 아이템 목록 출력
  return data;
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

// Supabase 데이터베이스에서 각 아바타의 사용 횟수를 가져오는 함수
async function fetchAvatarUsage() {
  const { data, error } = await supabase
    .from('user')
    .select('avatar');

  if (error) {
    console.error("Error fetching avatar usage", error); // 아바타 사용 횟수 가져오기 실패 시 에러 출력
    return {};
  }

  const usageCount = data.reduce((acc, curr) => {
    acc[curr.avatar] = (acc[curr.avatar] || 0) + 1;
    return acc;
  }, {});

  console.log("아바타 사용 횟수", usageCount); // 가져온 아바타 사용 횟수 출력
  return usageCount;
}

// Supabase 데이터베이스에서 사용자가 구매한 아이템 목록을 가져오는 함수
async function fetchUserItems(userID) {
  const { data, error } = await supabase
    .from('user_item')
    .select('item_id')
    .eq('user_id', userID);

  if (error) {
    console.error("Error fetching user items", error); // 사용자 아이템 목록 가져오기 실패 시 에러 출력
    return [];
  }

  console.log("사용자 아이템 목록", data); // 가져온 사용자 아이템 목록 출력
  return data.map(item => item.item_id);
}

// Supabase 데이터베이스에서 사용자의 point를 가져오는 함수
async function getUserPoints(userID) {
  const { data, error } = await supabase
    .from('user')
    .select('point')
    .eq('user_id', userID)
    .single(); // 단일 레코드 가져오기

  if (error) {
    console.error("Error fetching user points", error); // 포인트 가져오기 실패 시 에러 출력
    return null;
  }

  return data.point; // point 값 반환
}

// Supabase 데이터베이스에서 아이템을 구매하는 함수
async function purchaseItem(userID, itemID, itemPrice) {
  const userPoints = await getUserPoints(userID); // 사용자의 현재 포인트를 가져옴

  if (userPoints < itemPrice) {
    window.alert("point가 부족합니다."); // 포인트가 부족할 경우 경고 메시지
    return false;
  }

  const { error } = await supabase
    .from('user_item')
    .insert({ user_id: userID, item_id: itemID });

  if (error) {
    console.error("Error purchasing item", error); // 아이템 구매 실패 시 에러 출력
    return false;
  } else {
    console.log("Item purchased successfully"); // 아이템 구매 성공 시 메시지 출력
    // 포인트를 차감하는 로직 추가
    const { error: updateError } = await supabase
      .from('user')
      .update({ point: userPoints - itemPrice })
      .eq('user_id', userID);

    if (updateError) {
      console.error("Error updating points", updateError); // 포인트 업데이트 실패 시 에러 출력
      return false;
    } else {
      console.log("Points updated successfully"); // 포인트 업데이트 성공 시 메시지 출력
      return true;
    }
  }
}

export default function Shop() {
  const navigate = useNavigate(); // 페이지 이동을 위한 훅
  const userInfo = useToken(); // 사용자 정보를 가져오는 훅
  const userID = userInfo.user; // 사용자 ID
  const [items, setItems] = useState([]); // 아이템 목록을 저장하는 상태 변수
  const [currentAvatar, setCurrentAvatar] = useState(''); // 현재 사용 중인 아바타를 저장하는 상태 변수
  const [selectedOption, setSelectedOption] = useState('avatar'); // 선택된 옵션 상태 변수
  const [sortOption, setSortOption] = useState('distance'); // 정렬 기준 상태 변수
  const [avatarUsage, setAvatarUsage] = useState({}); // 아바타 사용 횟수를 저장하는 상태 변수
  const [userItems, setUserItems] = useState([]); // 사용자가 구매한 아이템 목록을 저장하는 상태 변수

  // 컴포넌트가 마운트될 때 아이템 목록을 가져와 상태를 업데이트하는 함수
  useEffect(() => {
    async function fetchData() {
      const [itemsData, avatar, usageData, userItemsData] = await Promise.all([
        fetchItems(),
        getUserAvatar(userID),
        fetchAvatarUsage(),
        fetchUserItems(userID)
      ]);

      setItems(itemsData); // 아이템 상태를 업데이트
      setCurrentAvatar(avatar); // 현재 아바타 상태를 업데이트
      setAvatarUsage(usageData); // 아바타 사용 횟수 상태를 업데이트
      setUserItems(userItemsData); // 사용자 아이템 상태를 업데이트
    }

    fetchData(); // 함수 호출
  }, [userID]);

  // 아바타를 업데이트하는 함수
  const handleAvatarUpdate = (avatarValue) => {
    updateAvatar(userID, avatarValue); // 아바타 값을 업데이트하는 함수 호출
    setCurrentAvatar(avatarValue); // 현재 아바타 상태를 업데이트
  };

  // 아이템을 구매하는 함수
  const handlePurchaseItem = async (itemID, itemName, itemPrice) => {
    const confirmPurchase = window.confirm(`"${itemName}"을(를) "${itemPrice}P"를 소비하여 구매하시겠습니까?`);
    if (confirmPurchase) {
      const success = await purchaseItem(userID, itemID, itemPrice); // 아이템 구매 함수 호출
      if (success) {
        setUserItems([...userItems, itemID]); // 사용자 아이템 목록에 추가
      }
    }
  };

  // 기프티콘을 사용하는 함수
  const handleUseGifticon = (itemID) => {
    window.alert(`No${extractNumber(itemID)} 기프티콘을 사용합니다.`);
  };

  // 옵션 변경 핸들러 함수
  const handleOptionChange = (event) => {
    setSelectedOption(event.target.value); // 선택된 옵션 상태를 업데이트
  };

  // 정렬 기준 변경 핸들러 함수
  const handleSortChange = (event) => {
    setSortOption(event.target.value); // 정렬 기준 상태를 업데이트
  };

  // 정렬 함수
  const sortItems = (items) => {
    if (sortOption === 'distance') {
      return [...items].sort((a, b) => extractNumber(a.item_id) - extractNumber(b.item_id));
    } else if (sortOption === 'under5km') {
      return [...items].sort((a, b) => extractNumber(b.item_id) - extractNumber(a.item_id));
    } else if (sortOption === 'under10km') {
      return [...items].sort((a, b) => a.price - b.price);
    } else if (sortOption === 'under15km') {
      return [...items].sort((a, b) => {
        const usageA = avatarUsage[a.item_id] || 0;
        const usageB = avatarUsage[b.item_id] || 0;
        if (usageA !== usageB) {
          return usageB - usageA;
        } else {
          return extractNumber(a.item_id) - extractNumber(b.item_id);
        }
      });
    }
    return items;
  };

  // 숫자를 추출하는 함수
  const extractNumber = (itemId) => {
    const match = itemId.match(/\d+$/);
    return match ? parseInt(match[0], 10) : 0;
  };

  // 선택된 옵션과 정렬 기준에 따라 필터링된 아이템을 반환하는 함수
  const filteredItems = sortItems(items.filter(item => item.type === selectedOption));

  return (
    <div className="shop-container">
      <div className="group_background">
        <div className='groupnav'>
          <Link to="/reward"><div className="shop_back"><img className='shop_back_icon' src="./icon/arrow.svg" alt="" /></div></Link>
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

        <select className='region_select_box' onChange={handleOptionChange} value={selectedOption}>
          <option value="avatar">아바타</option>
          <option value="gifticon">기프티콘</option>
          <option value="option2">미정2</option>
          <option value="option3">미정3</option>
          <option value="option4">미정4</option>
        </select>
        <select className='sort_box' onChange={handleSortChange} value={sortOption}>
          <option value="distance">오름차순</option>
          <option value="under5km">내림차순</option>
          <option value="under10km">가격순</option>
          <option value="under15km">인기순</option>
        </select>

        <div className='GroupList_container'>
          {selectedOption === "avatar" && (
            <div className="avatar_No0">
              <img src={logo} alt="Default Avatar" /> {/* 기본 아바타 이미지 */}
              <p>avatar_No0</p> {/* 기본 아바타 이름 */}
              <p className='price'>무료</p>
              <button className='usedbtn' 
                onClick={() => handleAvatarUpdate("avatar_No0")}
                disabled={currentAvatar === "avatar_No0"} // 현재 아바타가 avatar_No0이면 버튼 비활성화
              >
                {currentAvatar === "avatar_No0" ? "사용중" : "사용하기"} {/* 현재 아바타가 avatar_No0이면 '사용중' 표시 */}
              </button>
            </div>
          )}
          {filteredItems.map((item) => (
            <div key={item.item_id} className={`${selectedOption}_No${item.item_id.split('_')[1]}`}>
              <img src={item.source} alt={`Image ${item.item_id}`} /> {/* 아이템 이미지 */}
              <p>{item.item_id}</p> {/* 아이템 ID */}
              <p className='price'>가격: {item.price}P</p> {/* 아이템 가격 */}
              {userItems.includes(item.item_id) ? (
                selectedOption === "gifticon" ? (
                  <button className='usebtn' onClick={() => handleUseGifticon(item.item_id)}>사용하기</button>
                ) : (
                  <button 
                    onClick={() => handleAvatarUpdate(item.item_id)}
                    disabled={currentAvatar === item.item_id} // 현재 아바타가 item_id이면 버튼 비활성화
                  >
                    {currentAvatar === item.item_id ? "사용중" : "사용하기"} {/* 현재 아바타가 item_id이면 '사용중' 표시 */}
                  </button>
                )
              ) : (
                <button className='buybtn' onClick={() => handlePurchaseItem(item.item_id, item.item_id, item.price)}>구매하기</button>
              )}
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
      </div>
    </div>
  );
}
