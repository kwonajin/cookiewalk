import React, { useEffect, useState, useRef }  from 'react';
import './profile_edit.css'; 
import { Link ,useNavigate} from "react-router-dom";
import {supabase} from '../supabaseClient'
import { useToken } from '../context/tokenContext'


export default function ProfileEdit() {
  const navigate = useNavigate();

  //로그인한 유저 계정 user_id
  const userInfo=useToken();
  const userID = userInfo.user
  
  //수정할 유저 프로필 정보
  const [name, setName]=useState('');
  const [intro, setIntro]=useState('');
  const [nickname,setNickname]=useState('');
  const [confirmNickname,setConfirmNickname]=useState('true')
  
  //수정전 유저 프로필 정보
  const [currentName, setCurrentname]=useState('');
  const [currentIntro, setCurrentIntro]=useState('');
  const [currentNickname,setCurrentNickname]=useState('');
  
  //수정할 유저 프로필 이미지 url
  const [imageUrl, setImageUrl]=useState('')
  //수정할 유저 이미지 파일
  const [imageFile, setImageFile]=useState('')

  const nicknamePattern = /^[a-z0-9_]+$/;


  //유저 테이블에서 정보 가져오기
  const User = async()=>{
    // console.log(userID)
    const {data, error}=await supabase
      .from('user')
      .select('name, nick_name ,intro, profile_image')
      .eq('user_id', userID)
      if(error){
        console.error('오류발생', error)
      }

      if (data){
        const userProfile = data[0]
        setCurrentname(userProfile.name)          
        setCurrentNickname(userProfile.nick_name)
        setCurrentIntro(userProfile.intro)
        setImageUrl(userProfile.profile_image)
      }

  }

  const fileInputRef = useRef(null); //파일 입력을 위한 ref 생성

  // div 태그 클릭시에 input file 클릭 이벤트를 트리거
  const selectImage = ()=>{
    fileInputRef.current.click();
  }

  // 파일 선택했을 때 동작 핸들러
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file)

    const reader = new FileReader();
    reader.onloadend = ()=> {
      setImageUrl(reader.result);
    };
    reader.readAsDataURL(file)
    setImageFile(file)
  }

  const ImageFileUpload = async ()=>{
    const randomNumber = Math.floor(10000000 + Math.random() * 90000000); //랜덤 8자리숫자
    const fileExtnesion = imageFile.name.split('.').pop();    //파일확장자추출
    const newFilename=`Profile/${randomNumber}.${fileExtnesion}` //새 파일명 설정 profile폴더에 넣을거라 폴더 경로 추가
    // if(imageUrl !== 'https://rbdbdnushdupstmiydea.supabase.co/storage/v1/object/public/image/Profile/defaultProfileImage.png'){
    //   const {data:removeData, error: removeError} =await supabase.storage
    //     .from('image')
    //     .remove([imageUrl])
    //   if(removeError){
    //     console.error(removeError)
    //   }
    // if(removeData){
    //   console.log(removeData)
    // }
    // }
    const {data, error} = await supabase.storage
      .from('image')
      .upload(newFilename, imageFile, {upsert: true}); //prifile 폴더내에 저장
    if (error){
      console.error('오류 발생', error)   
    }
    const newImageUrl =`https://rbdbdnushdupstmiydea.supabase.co/storage/v1/object/public/image/${newFilename}`
    const {data: profileImageData , error : porfileImageError} = await supabase 
      .from('user')
      .update({
        profile_image: newImageUrl,
      })
      .eq('user_id', userID)
    if(porfileImageError){
      console.error('오류발생', error)
    }
    console.log('저장완료', profileImageData)
  }

  useEffect(()=>{
    console.log('닉네임:',nickname,'이름:',name,'소개:',intro )
  },[nickname, name, intro]) 
  
  
  //저장 함수
  const submitProfile = async(e)=>{
    e.preventDefault()

    //name, nickname, intro 데이터 처리
    if(nickname && nickname !== currentNickname){   //닉네임을 수정했을시 중복검사 //''여기서띄어쓰기 했다가 오류남
      if (!nicknamePattern.test(nickname)) {
        alert("닉네임은 영어 소문자, 숫자, 언더스코어(_)로만 이루어져야 합니다.");
        setConfirmNickname(false);
        return;
      }
      const {data, error}= await supabase
      .from('user')
      .select('nick_name')
      .eq('nick_name', nickname)
      if(data.length>0){
        alert('닉네임 중복입니다.')
        console.log('닉네임 중복', data)
        setConfirmNickname(false)
        return 
      }
    }
    if(confirmNickname){
      if(imageFile){
        ImageFileUpload();
      }
      const updatedName = name || currentName;
      const updatdNickname= nickname || currentNickname;
      const updateIntro = intro || currentIntro;
      
      const {data: userDatabase , error : userDatabaseError} = await supabase 
      .from('user')
      .update({
        name: updatedName,
        nick_name:updatdNickname,
        intro: updateIntro
      })
      .eq('user_id', userID)
      if(userDatabaseError){
        console.error('오류발생', error)
      }
      console.log('저장완료', userDatabase)
      setTimeout(()=>{
        navigate('/mypage');
      },1000)
    }
  }
  

  useEffect(() => {
    window.scrollTo(0, 0);
    if(userID !=null){
      User();
    }
  }, [userID]);

  const [nicknameVisible, setNicknameVisible] = useState(true);
  const [usernameVisible, setUsernameVisible] = useState(true);
  const [introduceVisible, setIntroduceVisible] = useState(true);

  // 포커스 이벤트 핸들러
  const handleNicknameFocus = () => {
    setNicknameVisible(false); // 닉네임 플레이스홀더를 숨김
    setUsernameVisible(true); // 사용자 이름 플레이스홀더를 보이게 함
    setIntroduceVisible(true); // 소개 플레이스홀더를 보이게 함
  };

  const handleUsernameFocus = () => {
    setUsernameVisible(false); // 사용자 이름 플레이스홀더를 숨김
    setNicknameVisible(true); // 닉네임 플레이스홀더를 보이게 함
    setIntroduceVisible(true); // 소개 플레이스홀더를 보이게 함
  };

  const handleIntroduceFocus = () => {
    setIntroduceVisible(false); // 소개 플레이스홀더를 숨김
    setNicknameVisible(true); // 닉네임 플레이스홀더를 보이게 함
    setUsernameVisible(true); // 사용자 이름 플레이스홀더를 보이게 함
  };

  const handleBlur = () => {
    setNicknameVisible(true); // 닉네임 플레이스홀더를 다시 보이게 함
    setUsernameVisible(true); // 사용자 이름 플레이스홀더를 다시 보이게 함
    setIntroduceVisible(true); // 소개 플레이스홀더를 다시 보이게 함
  };

  return (
    <div className="pe_background">
      <Link to="/mypage"><div className="pe_back"><img className="pe_back_icon" src="./icon/arrow.svg" alt="" /></div></Link>
      <span className="pe_title">프로필 편집</span>
      <div className='pe_complete' onClick={submitProfile}>저장</div>
      <div className="pe_line"></div>
      <img  className='pe_profile_img'src={imageUrl} alt="" />
      {/* <img className='pe_profile_img' src="./images/ellipse_7.png" alt="" /> */}
      <div className="pe_img_mod"></div>
      <div className="pe_img_mod_text" onClick={selectImage}>프로필 사진 수정</div>
      <input type="file" ref={fileInputRef} style={{display:'none' }} onChange={handleFileChange} accept='image/*'/>
      <div className="pe_line1"></div>
      <span className="pe_nickname">닉네임</span>
      <input type="text" className='pe_nickname_input' placeholder={nicknameVisible ? currentNickname : ""} onFocus={handleNicknameFocus} onBlur={handleBlur} value={nickname} onChange={(e)=>{setNickname(e.target.value) 
                                setConfirmNickname(true)
                                }}/>
      <div className="pe_line2"></div>
      <span className="pe_user_name">사용자 이름</span>
      <input type="text" className='pe_user_name_input' placeholder={usernameVisible ? currentName : ""} onFocus={handleUsernameFocus} onBlur={handleBlur} value={name} onChange={(e)=>{setName(e.target.value)}}/>
      <div className="pe_line3"></div>
      <span className="pe_introduce">소개</span>
      <input type="text" className='pe_introduce_input' placeholder={introduceVisible ? currentIntro : ""} onFocus={handleIntroduceFocus} onBlur={handleBlur} value={intro} onChange={(e)=>{setIntro(e.target.value)}}/>
      <div className="pe_line4"></div>
    </div>
  );
}

