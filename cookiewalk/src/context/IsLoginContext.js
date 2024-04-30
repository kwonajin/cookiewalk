// //IsLoginContext.js

// import React, { createContext, useContext, useState, useMemo } from 'react'

// const userId = sessionStorage.getItem('id')
// const token = sessionStorage.getItem('token')

// export const IsLoginContext = createContext({ isLogin: userId !== null && token !== null ? true : false })

// export function IsLoginProvider({ children }) {
//   const [isLogin, setIsLogin] = useState(userId !== null && token !== null ? true : false)
//   // useMemo로 캐싱하지 않으면 value가 바뀔 때마다 state를 사용하는 모든 컴포넌트가 매번 리렌더링됨
//   const value = useMemo(() => ({ isLogin, setIsLogin }), [isLogin, setIsLogin])
//   return <IsLoginContext.Provider value={value}>{children}</IsLoginContext.Provider>
// }