import React, { useEffect, useState } from 'react';
import './Unfinished_route.css'
import { Link } from "react-router-dom";
import Unfinished_active from './Unfinished_route_list/Unfinished_route_active';
import Unfinished_List from './Unfinished_route_list/Unfinished_route_list';
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext';

export default function Unfinished_route() {

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
    let drawPathArray=[]
    const [path, setPath]=useState([])
    const [center, setCenter]=useState([])
    const [drawPath, setDrawPath]=useState([])

    //로딩상태
    const [loading, setLoading]=useState(true)
    
    // 중심좌표 구하는 함수
    const calculateCenter=(path) =>{
        const total = path.length; //배열의 총 개수
        //좌표 배열 순회하며 각 죄표의 위도 경도의 합을 구함
        const sum =path.reduce((acc, coord) => ({
            lat: acc.lat + coord.latitude,  //누적된 위도 합에 현재 좌표 위도 합 더하기
            lng: acc.lng + coord.longitude	//누적된 경도 합에 현재 좌표 경도 합 더하기
        }), {lat:0, lng:0})  //초기값 {lat:0, lng:0}
        return {
            latitude: sum.lat / total,
            longitude: sum.lng / total,
        };
    }


     //미완성 산책기록 찾는 함수
    async function nonCompleteRecord() {
        const {data: recordInfoData , error: recordInfoError}= await supabase
            .from('walking_record_N')
            .select('walking_record_id ,distance, title, location, walking_time, draw_id')
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
                        .from('walking_record_N_location')
                        .select('latitude, longitude')
                        .eq('walking_record_id', recordInfoData[index].walking_record_id)
                    // console.log(findPathData)
                    if(findPathData.length >0){
                        pathArray.push({
                            walking_record_id: recordInfoData[index].walking_record_id,
                            coordinate: findPathData,
                        });
                        centerArray.push({
                            walking_record_id: recordInfoData[index].walking_record_id,
                            coordinate: await calculateCenter(findPathData)
                        })
                    }
                    if(recordInfoData[index].draw_id  && recordInfoData[index].draw_id.includes('draw')){
                        const {data: findDrawPathData, error: findDrawPathError} = await supabase
                            .from('draw_map_c_location')
                            .select('latitude, longitude')
                            .eq('draw_m_c_id', recordInfoData[index].draw_id)
                        // console.log(findDrawPathData)
                        if(findDrawPathData.length >0){
                            drawPathArray.push({
                                walking_record_id: recordInfoData[index].walking_record_id,
                                coordinate: findDrawPathData,
                            })
                        }
                    }
                }
                await findPath()
            }
            setPath(pathArray)
            setCenter(centerArray)
            setDrawPath(drawPathArray)
            setLoading(false)
        }
    }
    useEffect(()=>{
        // console.log(totalDistance, totalTime)
    }, [totalDistance, totalTime])
    useEffect(()=>{
        console.log(path)
    }, [path])
    useEffect(()=>{
        console.log(drawPath)
    }, [drawPath])

    useEffect(()=>{
        if(userID){
            nonCompleteRecord()
        }
    },[userID])

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    if(loading){
        return (
            <div className="BeforeStart_container">
                <div>현재 위치 정보를 가져오는 중입니다....</div>
            </div>
        )
    }
return (
    <div className="Unfinished_route_container">
        <div className='Unfinished_nav'>
            <Link to='/BeforeStart'><div><img className="Unfinished_back_arrow" src="./icon/arrow.svg"/></div></Link>
            <div className="Unfinished_route_title">미완성 경로</div>
            <div className="Unfinished_title_active_line"></div>
        </div>

        <Unfinished_active distance={totalDistance} time={totalTime} count={countRecord}></Unfinished_active>
        
        {recordList.map((recordItem, index)=>{
            const sendOnlyPath = path.find(p => p.walking_record_id === recordItem.walking_record_id);
            const sendOnlydrawPath =drawPath.find(p=> p.walking_record_id ===recordItem.walking_record_id)
            return (
            <Link to='/BeforeStart' className='unfinishToBefore_link' 
                state={{ path: sendOnlyPath ? sendOnlyPath.coordinate : null ,drawPath: sendOnlydrawPath ? sendOnlydrawPath.coordinate : []}} key={recordItem.walking_record_id}>
                <Unfinished_List
                    key={recordItem.walking_record_id}
                    drawId={recordItem.walking_record_id}
                    location={recordItem.location}
                    distance={recordItem.distance}
                    time={recordItem.walking_time}
                    pathcoord={sendOnlyPath ? sendOnlyPath.coordinate : null}
                    centercoord={center[index]}
                ></Unfinished_List>
            </Link>
            )    
        })}
        {/* 위의 방법으로 하는 대신 갯수제한 */}
    </div>
    );
}