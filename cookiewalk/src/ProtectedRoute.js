import React, { useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';

// Component와 나머지 props를 인자로 받는 ProtectedRoute 컴포넌트 정의
const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [loading, setLoading] = useState(true);  // 로딩 상태 관리
  const [authenticated, setAuthenticated] = useState(false);  // 인증 상태 관리
  const history = useHistory();  // 라우터의 history 객체 사용
  
  useEffect(() => {
    checkAuthentication();  // 컴포넌트 마운트 시 인증 체크 실행
  }, []);

  const checkAuthentication = async () => {
    const token = localStorage.getItem('sb:token');  // 로컬 스토리지에서 토큰 가져오기
    if (!token) {
      history.push('/login');  // 토큰 없으면 로그인 페이지로 리디렉션
    } else {
      try {
        // Supabase에서 'users' 테이블을 조회하여 토큰이 유효한지 확인
        const { data, error } = await supabase
          .from('users')
          .select('id')
          .eq('token', token);

        if (error) throw error;  // 오류 발생 시 예외 처리
        if (data.length === 0) {
          history.push('/login');  // 유효하지 않은 토큰일 경우 로그인 페이지로
        } else {
          setAuthenticated(true);  // 유효한 토큰일 경우 인증 상태를 true로 설정
        }
      } catch (error) {
        console.error('Auth error:', error.message);  // 오류 로깅
        history.push('/login');  // 오류 시 로그인 페이지로 리디렉션
      }
    }
    setLoading(false);  // 로딩 상태를 false로 설정
  };

  if (loading) {
    return <div>Loading...</div>;  // 로딩 중일 때 로딩 표시
  }

  return authenticated ? <Component {...rest} /> : null;  // 인증된 경우 해당 컴포넌트 렌더, 그렇지 않으면 null
};

export default ProtectedRoute;