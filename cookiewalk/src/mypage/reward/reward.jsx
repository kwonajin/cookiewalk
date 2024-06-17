import React, { useState, useEffect } from 'react';
import './reward.css';
import { Link } from "react-router-dom";
import { supabase } from '../../supabaseClient'; // supabaseClient를 import합니다.

export default function Reward(){
  const [points, setPoints] = useState(0);

  useEffect(() => {
    const fetchPoints = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { id } = user;
        const { data, error } = await supabase
          .from('user')
          .select('point')
          .eq('user_id', id)
          .single();
        if (data) {
          setPoints(data.point);
        }
        if (error) {
          console.error('Error fetching points:', error);
        }
      }
    };

    fetchPoints();
  }, []);

  return (
    <div style={{ background: '#E5E5E5' }}>
      <div className="reward_background">
      <Link to='/mypage'><div className="reward_back"><img className="reward_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>
      <span className="rewardTitle">리워드</span>
      <div className="reward_title_line"></div>

      <img className="logo_icon" src="./images/logo.png" alt="" />
      <img className="footerBackground" src="./images/coin.png" alt="" />
      <span className="pointsAmount">{points}</span>
      <span className="pointsLabel">포인트</span>
      <div className="point_line"></div>
      <div className="line1"></div>
      <img className='shop_img' src="./images/shop.png" alt="" />
      <span className="shopTitle">상점 바로가기</span>
      <div className="division"></div>
      <img className='cash_img' src="./images/cash.png" alt="" />
      <span className="cashTitle">현금 인출하기</span>

      <div className="line2"></div>
      <span className="pointsHistoryTitle">포인트 사용내역</span>
        <div className="ph"><img className="ph_icon" src="./icon/arrow.svg" alt="" /></div>
        <div className="line3"></div>
        <span className="termsText">포인트 이용약관</span>
        <div className="terms"><img className="terms_icon" src="./icon/arrow.svg" alt="" /></div>

        <div className="line4"></div>
      </div>
    </div>
  );
}
