import React, { useState,useEffect } from 'react';
import './Signup3.css'
import {Link ,useNavigate} from "react-router-dom";
import {supabase} from '../supabaseClient'
import {useToken} from '../context/tokenContext.jsx'

export default function DetailedInfo() {
    const navigate = useNavigate();
    const [name,setName]=useState('')
    const [phone, setPhone]=useState('')
    const [nickname, setNickname]=useState('')
    const [consfirmNickname, setConfirmNickname]=useState(false)
    const [gender, setGender] = useState('M'); // 성별 상태

    const userInfo=useToken();
    // console.log(userInfo.user.session.user.id)
    // 성별 선택 핸들러
    const handleGenderSelect = (selectedGender) => {
        setGender(selectedGender);
    };

    //닉네임 중복 검사 요청
    const onSubmitHandlerNick = async(e) =>{
        e.preventDefault();
        const {data, error}= await supabase
            .from('user')
            .select('nick_name')
            .eq('nick_name', nickname)
        if(data.length>0){
            console.log('닉네임 중복')
            setConfirmNickname(false)
        }else{
            console.log('사용가능한 닉네임')
            setConfirmNickname(true)
        }
    }
    // setConfirmCodeMatch 상태가 변경될 때마다 실행해 취신 결과값 확인
    useEffect(() => {
    console.log(consfirmNickname);
    }, [consfirmNickname]);

    const nextStep = async(e) =>{
        e.preventDefault()
        if(consfirmNickname){
            const {data, error}= await supabase
                .from('user')
                .update({
                    gender: gender,
                    phone: phone,
                    name : name,
                    nick_name: nickname
                })
                .eq('user_id',userInfo.user )
            if(error){
                console.error(error.message)
            }
            console.log('data :',data)
            navigate('/signup4'); // signup4로 이동
        }
        else{
            console.log('값을 모두 입력해주세요')
        }
    }


    return (
    <div className="e86_8">

        <div><img className='e86_35' src="./icon/ic--round-arrow-back.svg" /></div>
        <span className="cookiewalk_logo">CookieWalk</span>

        <span className="e86_9">쿠키워크의 상세정보를 입력해주세요</span>
    
        <form  method = "/">
            <input type="text" className="inputUserName" onChange={(e)=>setName(e.target.value)} value={name} placeholder="이름을 입력해주세요" required/>
            {/* 이름 */}
            <input type="text" className="inputUserCP" onChange={(e)=>setPhone(e.target.value)} value={phone} placeholder="전화번호를 입력해주세요 (‘-’없이 입력)" required/>
            {/* 전화번호 */}
    
            <button type='button' className={`e86_37 ${gender === 'M' ? 'selected' : ''}`} onClick={() => handleGenderSelect('M')}>
                    {gender === 'M' ? <img className="e86_38" src='./icon/lets-icons--check-fill.svg' alt="selected"/> : <img className="e86_38" src='./icon/ei--check.svg' alt="unselected"/>}
                </button>
            <span className="e86_39">남자</span>
    
            <button type='button' className={`e86_20 ${gender === 'F' ? 'selected' : ''}`} onClick={() => handleGenderSelect('F')}>
                    {gender === 'F' ? <img className="e86_21" src='./icon/lets-icons--check-fill.svg' alt="selected"/> : <img className="e86_21" src='./icon/ei--check.svg' alt="unselected"/>}
                </button>
            <span className="e86_40">여자</span>
    
            <input type="text" className="inputUserNickName" onChange={(e)=>setNickname(e.target.value)} value={nickname}placeholder="닉네임을 입력해주세요" required/>
    
            <button type='submit' onClick={onSubmitHandlerNick} className="UserNick_double_check">중복확인</button>
    
            <button className="next3"onClick={nextStep}>등록</button>
        </form>
    </div>
    );
    }
