import React, { useEffect, useState } from 'react';
import './finished_art.css'
import { Link } from "react-router-dom";
import Finished_active from './finished_art/finished_art_active';
import Finished_List from './finished_art/finished_art_list';
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext';
import { calculateBounds } from '../utils/calculateBounds';

export default function FinishedArt() {
    const userInfo=useToken(); //TokenContext에서 user 상태를 가져옴
    // console.log(userInfo.user)
    const userID= userInfo.user


    //위에 기록 요소들
    const [countRecord, setCountRecord]=useState(0)
    const [totalDistance, setTotalDistance] = useState(0);
    const [totalTime, setTotalTime] = useState(0);

    //각 목록별 요소들
    const [recordList, setRecordList]=useState([])
    let pathArray=[];
    let centerArray=[];
    const [path, setPath]=useState([])
    const [center, setCenter]=useState([])

    //로딩상태
    const [loading, setLoading]=useState(true)

    // 중심좌표 구하는 함수
    // const calculateCenter=(path) =>{
    //     const total = path.length; //배열의 총 개수
    //     //좌표 배열 순회하며 각 죄표의 위도 경도의 합을 구함
    //     const sum =path.reduce((acc, coord) => ({
    //         lat: acc.lat + coord.latitude,  //누적된 위도 합에 현재 좌표 위도 합 더하기
    //         lng: acc.lng + coord.longitude	//누적된 경도 합에 현재 좌표 경도 합 더하기
    //     }), {lat:0, lng:0})  //초기값 {lat:0, lng:0}
    //     return {
    //         latitude: sum.lat / total,
    //         longitude: sum.lng / total,
    //     };
    // }

    //완성 산책기록 찾는 함수
    async function CompleteRecord() {
        const {data: recordInfoData , error: recordInfoError}= await supabase
            .from('walking_record')
            .select('walking_record_id ,distance, title, location, walking_time, color')
            .eq('user_id', userID)
        console.log(recordInfoData)
        setRecordList(recordInfoData)
        setCountRecord(recordInfoData.length)
        let newTotalDistance = 0;
        let newTotalTime = 0;
        if(recordInfoData.length >= 1){
            for(let index in recordInfoData){
                newTotalDistance += recordInfoData[index].distance
                newTotalTime += recordInfoData[index].walking_time
                setTotalDistance(newTotalDistance);
                setTotalTime(newTotalTime);
                async function findPath(){
                    const {data: findPathData, error: findPathError} = await supabase
                        .from('walking_record_location')
                        .select('latitude, longitude')
                        .eq('walking_record_id', recordInfoData[index].walking_record_id)
                    console.log(findPathData)
                    if(findPathData.length >0){
                        pathArray.push({
                            walking_record_id: recordInfoData[index].walking_record_id,
                            coordinate: findPathData,
                        });
                        centerArray.push({
                            walking_record_id: recordInfoData[index].walking_record_id,
                            // coordinate: await calculateCenter(findPathData)
                            coordinate: await calculateBounds(findPathData)
                        })
                    }
                }
                await findPath()
            }
            setPath(pathArray)
            setCenter(centerArray)
            setLoading(false)
        }
    }
    useEffect(()=>{
        console.log(totalDistance, totalTime)
    }, [totalDistance, totalTime])
    useEffect(()=>{
        console.log(path)
    }, [path])

    useEffect(()=>{
        console.log(center)
    }, [center])
    useEffect(()=>{
        if(userID){
            CompleteRecord()
        }
    },[userID])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if(loading){
        return (
            <div className="BeforeStart_container">
                <img className='fa_loadimg' src="./images/logo.png" alt="" />
                <div className='fa_loadmessage'>로딩 중입니다...</div>
            </div>
        )
    }
// detail
    return (
        <div className="finished_route_container">
            <div className='finished_nav'>
                <Link to='/mypage'>
                    <div>
                        <img className="finished_back_arrow" src="./icon/arrow.svg" />
                    </div>
                </Link>
                <div className="finished_route_title">완성한 그림</div>
                <div className="finished_title_active_line"></div>
            </div>
    
            <Finished_active distance={totalDistance} time={totalTime} count={countRecord} />
    
            <div className="finished_content">
                {recordList.map((recordItem, index) => {
                    const sendOnlyPath = path.find(p => p.walking_record_id === recordItem.walking_record_id);
                    return (
                        <Link to={`/finished_art_detail`} className='finished_to_detail_link' state={{drawId:recordItem.walking_record_id, location:recordItem.location, distance: recordItem.distance, time:recordItem.walking_time, pathcoord:sendOnlyPath, center:center[index], title:recordItem.title ,color:recordItem.color}} key={recordItem.walking_record_id}>
                            <Finished_List
                                key={recordItem.walking_record_id}
                                drawId={recordItem.walking_record_id}
                                location={recordItem.location}
                                distance={recordItem.distance}
                                time={recordItem.walking_time}
                                pathcoord={sendOnlyPath ? sendOnlyPath.coordinate : null}
                                centercoord={center[index]}
                                title={recordItem.title}
                                color={recordItem.color}
                            />
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}