//ProtectRoute.jsx
import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useToken} from './context/tokenContext'

const ProtectedRoute = ({children}) => {
  const {user, loading} = useToken(); //사용자 상태
  const location = useLocation(); //현재 위치 정보

  //새로고침 시에 user가 초기화되서 로그인 페이지로 넘어감 이거 아님 getSession()쓰자.
  const tokenString = window.localStorage.getItem('sb-rbdbdnushdupstmiydea-auth-token');
  const tokenData = JSON.parse(tokenString);
  
  
  if (loading) {
    return <div>Loading...</div>; 
  }

  if (!tokenData) {
    return <Navigate to="/login" state={{from: location}} replace/>;
  }

  return children; // 로그인한 사용자에게는 자식 컴포넌트를 표시
};

export default ProtectedRoute;

