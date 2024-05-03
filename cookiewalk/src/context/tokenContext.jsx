//tokenContext.jsx
import React, {createContext, useContext, useState, useEffect} from 'react';
import { supabase } from '../supabaseClient';

export const TokenContext = createContext(null);

export const useToken = () => useContext(TokenContext);

export const TokenProvider = ({children}) => {
  const [user,setUser]= useState(null);
  const [userInfo,setUserInfo]= useState(null);

  useEffect(()=> {
    async function checkUser(){
      // const tokenString = window.localStorage.getItem('sb-rbdbdnushdupstmiydea-auth-token');
      // const tokenData = JSON.parse(tokenString);
      // console.log('Token Data:', tokenData);
      // const {data: AuthChange}=supabase.auth.onAuthStateChange((event, session) => {
      //   setTimeout(async () => {
      //     console.log('event: ',event ,'session :',session )
      //   }, 0)
      // })
      const {data, error} =await supabase.auth.getSession();
      console.log(data.session.user.id)
      if(data){
        setUser(data.session.user.id);
      }else{
        setUser(null);
      }
        if(error){
        console.error('오류발생', UserError)
      }

    }

    checkUser();
  },[]);

  return (
    <TokenContext.Provider value={{user,setUser}}>
      {children}
    </TokenContext.Provider>
  )

};