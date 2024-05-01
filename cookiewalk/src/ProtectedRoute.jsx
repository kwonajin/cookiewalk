//ProtectRoute.jsx
import React, {useState,useEffect} from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {supabase} from './supabaseClient'

const ProtectedRoute = ({children}) => {
  const location = useLocation(); //현재 위치 정보

  const [loading, setLoading] = useState(true); //로딩 상태 관리 state
  const [authenticated, setAuthenticated] = useState(false); //인증 상태를 관리하는 state

  useEffect(() => {
    // 컴포넌트가 마운트 되면 현재 세션 상태 확인
    const {data: getSessionData, error: getSessionError} =supabase.auth.getSession();
    setAuthenticated(!!getSessionData);

    // 인증 상태 변경 확인
    const unsubscribe = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth event:', event, '; Session:', session);
      setAuthenticated(!!session);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // 인증 상태 확인 중에는 로딩 페이지 표시
  }

  if (!authenticated) {
    // 사용자 인증 실패시 로그인 페이지로 리다이렉트
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;  // 사용자 인증선공시 자식 컴포넌트 렌더링
};

export default ProtectedRoute;

