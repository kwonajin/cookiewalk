//tokenContext.jsx
import React, {createContext, useContext, useState, useEffect} from 'react';
import { supabase } from '../supabaseClient';

export const TokenContext = createContext(null);

export const useToken = () => useContext(TokenContext);

export const TokenProvider = ({children}) => {
  const [user,setUser]= useState(null);

  useEffect(()=> {
    async function checkUser(){
      const tokenString = window.localStorage.getItem('sb-rbdbdnushdupstmiydea-auth-token');
      const tokenData = JSON.parse(tokenString);
      // console.log('Token Data:', tokenData);
      // const {data, error} =await supabase.auth.getSession();
      // console.log(data)
      if(tokenData){
        setUser(tokenData);
      }else{
        setUser(null);
      }
    }

    checkUser();
  },[]);

  return (
    <TokenContext.Provider value={{user, setUser}}>
      {children}
    </TokenContext.Provider>
  )

};