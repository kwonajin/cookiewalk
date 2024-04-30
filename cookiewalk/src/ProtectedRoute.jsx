import React from 'react';
import {Navigate, useLocation} from 'react-router-dom';
import {useToken} from './context/tokenContext'

const ProtectedRoute = ({children}) => {
  const {user} = useToken(); //사용자 상태
  const location = useLocation(); //현재 위치 정보

  if (!user) {
    return <Navigate to="/login" state={{from: location}} replace/>;
  }

  return children; // 로그인한 사용자에게는 자식 컴포넌트를 표시
};

export default ProtectedRoute;

