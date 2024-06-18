import React, { useState, useEffect, useRef } from 'react';
import './Start.css';
import { Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline } from 'react-naver-maps';
import { useLocation, useNavigate } from "react-router-dom";
import testPath2 from '../utils/testPath2';
import { PathNavigation } from '../utils/PathNavigation';
import { textToSpeech } from '../utils/textToSpeech';
import { supabase } from '../supabaseClient';
import { useToken } from '../context/tokenContext'
import fetchAvatar from '../utils/getAvatar/getUserAvatar';

function MyMap({ path = [], drawPath = [], center, passPath = [], walkMode = true, color, avatarUrl }) {
    const navermaps = useNavermaps();
    const markerIcon = {
        content: `<div><img src="${avatarUrl}" alt="icon" class="icon_size"></div>`, // 아바타 URL 사용
        size: new navermaps.Size(24, 24),
        anchor: new navermaps.Point(12, 12)
    };

    return (
        <NaverMap
            defaultCenter={center ? new navermaps.LatLng(center.latitude, center.longitude) : new navermaps.LatLng(37.3595704, 127.105399)}
            defaultZoom={15}
        >
            {path.length >= 1 && (
                <Marker icon={markerIcon} position={new navermaps.LatLng(path[path.length - 1].latitude, path[path.length - 1].longitude)} />
            )}
            {(walkMode && path.length > 1) && (
                <Polyline
                    path={path.map(p => new navermaps.LatLng(p.latitude, p.longitude))}
                    strokeColor={color}
                    strokeWeight={8}
                    strokeOpacity={0.9}
                    strokeStyle="solid"
                />
            )}
            {passPath.length >= 1 && (
                <Polyline
                    path={passPath.map(p => new navermaps.LatLng(p.latitude, p.longitude))}
                    strokeColor={color}
                    strokeWeight={8}
                    strokeOpacity={0.9}
                    strokeStyle="solid"
                />
            )}
            {drawPath.length > 1 && drawPath.map((p, index) => {
                const isPassed = passPath.some(pp => pp.latitude === p.latitude && pp.longitude === p.longitude);
                return (
                    <Marker
                        key={index}
                        position={new navermaps.LatLng(p.latitude, p.longitude)}
                        title={`Marker${index + 1}`}
                        clickable={true}
                        icon={{
                            content: `<div style="background: ${isPassed ? color : `${color}50`}; width: 10px; height: 10px; border-radius: 50%;"></div>`,
                            size: new navermaps.Size(10, 10),
                            anchor: new navermaps.Point(5, 5)
                        }}
                    />
                )
            })}
            {drawPath.length > 1 && (
                <Polyline
                    key={drawPath.length}
                    path={drawPath.map(p => new navermaps.LatLng(p.latitude, p.longitude))}
                    strokeColor={color}
                    strokeWeight={8}
                    strokeOpacity={0.3}
                    strokeStyle="solid"
                />
            )}
        </NaverMap>
    );
}

export default function Start() {
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const location = useLocation();
    const navigate = useNavigate();
    const [groupDraw, setGroupDraw] = useState(false);
    const [regionNumber, setRegionNumber] = useState(0);
    const [groupId, setGroupId] = useState('');
    const [isExpanded, setIsExpanded] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(location.state.currentPosition);
    const [tracking, setTracking] = useState(false);
    const watchIdRef = useRef(null);
    const [path, setPath] = useState([]);
    const [color, setColor] = useState('#7ca0c1');
    const [drawId, setDrawId] = useState('');
    const [drawPath, setDrawPath] = useState([]);
    const [drawDistance, setDrawDistance] = useState([]);
    const [pathLoading, setPathLoading] = useState(true);
    const [passPath, setPassPath] = useState([]);
    const [walkMode, setWalkMode] = useState(true); //true 백지걷기 //false 경로따라걷기
    const passPathRef = useRef(passPath);
    const [level, setLevel] = useState('하');
    const [totalDistance, setTotalDistance] = useState(0);
    const [time, setTime] = useState(0);
    const timerRef = useRef(null);
    const tolerance = 0.007;
    const [navigation, setNavigation] = useState([]);
    const userInfo = useToken();
    const userID = userInfo.user;
    const [avatarUrl, setAvatarUrl] = useState('/images/logo.png'); // 아바타 URL 상태 추가

    // New state for tracking points
    const [lastPointDistance, setLastPointDistance] = useState(0);
    const [showPointPopup, setShowPointPopup] = useState(false);

    const togglePause = () => {
        setIsPaused(!isPaused);
        stopTracking();
    };

    const restart = () => {
        setIsPaused(false);
        startTracking();
    };

    const handleCloseClick = () => {
        const confirmLeave = window.confirm("경로를 저장하지 않고 종료하시겠습니까?");
        if (confirmLeave) {
            navigate('/home');
        }
    };

    const startTracking = () => {
        if (navigator.geolocation) {
            setTracking(true);
            watchIdRef.current = navigator.geolocation.watchPosition(
                (position) => {
                    const { latitude, longitude } = position.coords;
                    const newPosition = { latitude: latitude, longitude: longitude };
                    setCurrentPosition(newPosition);
                    setPath((prevPath) => {
                        if (!Array.isArray(prevPath)) {
                            prevPath = [];
                        }
                        let newPath = [...prevPath, newPosition];
                        const lastPosition = prevPath[prevPath.length - 1];

                        if (drawPath.length === 0) {
                            if (lastPosition) {
                                const distance = calculateDistance(lastPosition, newPosition);
                                setTotalDistance((prevDistance) => {
                                    const newDistance = prevDistance + distance;
                                    return newDistance;
                                });
                            }
                            return newPath;
                        } else {   //받아온 경로 있을시
                            newPath = [...prevPath, newPosition]
                            if (passPathRef.current.length < drawPath.length) {
                                const closePoint = drawPath[passPathRef.current.length];
                                const distanceClosePoint = calculateDistance(newPosition, closePoint)
                                if (distanceClosePoint <= tolerance) {
                                    setPassPath((prevPassPath) => {
                                        let newPassPath = [...prevPassPath, closePoint]
                                        return newPassPath
                                    })
                                }
                            }
                            if (lastPosition) {
                                const distance = calculateDistance(lastPosition, newPosition);
                                setTotalDistance((prevDistance) => {
                                    const newDistance = prevDistance + distance;
                                    return newDistance;
                                });
                            }
                            return newPath;
                        }
                    });
                },
                (error) => {
                    console.error('위치 추적 실패', error);
                },
                {
                    enableHighAccuracy: true,
                    timeout: 20000,
                }
            );
        } else {
            console.error('브라우저에서 지리적 위치 API 지원하지 않음');
        }
    };

    const startTracking2 = () => {
        setTracking(true);
        let countIndex = 0;
        const test = setInterval(() => {
            if (countIndex < testPath2.length) {
                const newPosition = testPath2[countIndex];
                setCurrentPosition(newPosition);
                setPath((prevPath) => {
                    if (!Array.isArray(prevPath)) {
                        prevPath = [];
                    }
                    let newPath = [...prevPath, newPosition];
                    const lastPosition = prevPath[prevPath.length - 1];
                    if (drawPath.length === 0) {
                        if (lastPosition) {
                            const distance = calculateDistance(lastPosition, newPosition);
                            setTotalDistance((prevDistance) => {
                                const newDistance = prevDistance + distance;
                                return newDistance;
                            });
                        }
                        return newPath
                    } else {
                        if (passPathRef.current.length < drawPath.length) {
                            const closePoint = drawPath[passPathRef.current.length];
                            const distanceClosePoint = calculateDistance(newPosition, closePoint)
                            if (distanceClosePoint <= tolerance) {
                                setPassPath((prevPassPath) => {
                                    let newPassPath = [...prevPassPath, closePoint]
                                    return newPassPath
                                })
                            }
                        }
                        if (lastPosition) {
                            const distance = calculateDistance(lastPosition, newPosition);
                            setTotalDistance((prevDistance) => {
                                const newDistance = prevDistance + distance;
                                return newDistance;
                            });
                        }
                        return newPath;
                    }
                });
                countIndex++;
            } else {
                clearInterval(test);
            }
        }, 3000);
    };

    useEffect(() => {
        passPathRef.current = passPath;
        if (passPathRef.current.length > 0 && (passPathRef.current.length < drawPath.length - 1)) {
            if (navigation[passPathRef.current.length - 1] !== '직진') {
                textToSpeech(navigation[passPathRef.current.length - 1]);
            }
        }
    }, [passPath]);

    const stopTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setTracking(false);
        stopTimer();
    };

    useEffect(() => {
        if (location.state.drawPath.length > 1) {
            setDrawPath(location.state.drawPath);
            setWalkMode(false);
            setPassPath(location.state.path);
            setDrawId(location.state.drawId);
            setGroupId(location.state.groupDraw);
            setRegionNumber(location.state.regionNumber);
            setGroupDraw(location.state.groupDraw);
            setColor(location.state.color);
            setGroupId(location.state.groupId);
            setDrawDistance(location.state.drawDistance);
            setLevel(location.state.level);
        }
    }, [location.state.drawPath]);

    useEffect(() => {
        if (location.state.path.length > 1) {
            setPath(location.state.path);
        }
    }, [location.state.path]);

    useEffect(() => {
        if (isPaused) {
            stopTimer();
            stopTracking();
        } else {
            if (drawPath.length > 1 || location.state.drawPath < 1) {
                startTimer();
                const navi = PathNavigation(drawPath);
                setNavigation(navi.resultArray);
                startTracking();
            }
        }
    }, [isPaused, drawPath]);

    useEffect(() => {
        if (path.length >= 1) {
            setPathLoading(false);
        }
    }, [path]);

    useEffect(() => {
        // Function to handle distance check and point awarding
        const handleDistanceCheck = () => {
            if (totalDistance - lastPointDistance >= 0.5) {
                setLastPointDistance(totalDistance);
                updateUserPoints(userID, 1);
                // Show popup message for 1 second
                setShowPointPopup(true);
                setTimeout(() => {
                    setShowPointPopup(false);
                }, 1000);
            }
        };

        // Call the function whenever totalDistance changes
        handleDistanceCheck();
    }, [totalDistance]);

    const startTimer = () => {
        if (timerRef.current === null) {
            timerRef.current = setInterval(() => {
                setTime((prevTime) => (prevTime + 1));
            }, 1000);
        }
    };

    const stopTimer = () => {
        clearInterval(timerRef.current);
        timerRef.current = null;
    };

    const formatTime = (seconds) => {
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor((seconds % 3600) / 60);
        const secs = seconds % 60;
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const calculateDistance = (coord1, coord2) => {
        const toRad = (x) => (x * Math.PI / 180);
        const R = 6371;
        const dLat = toRad(coord2.latitude - coord1.latitude);
        const dLng = toRad(coord2.longitude - coord1.longitude);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(coord1.latitude)) * Math.cos(toRad(coord2.latitude)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const findCloseCoord = (currentPosition) => {
        let closeCoord = null;
        let minDistance = Infinity;
        drawPath.forEach((point) => {
            const distance = calculateDistance(currentPosition, point);
            if (distance < minDistance) {
                minDistance = distance;
                closeCoord = point;
            }
        });
        return closeCoord;
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const icon3Path = isExpanded ? "./icon/mdi--arrow-down-drop.svg" : "./icon/mdi--arrow-drop-up.svg";

    async function updateUserPoints(userId, pointsToAdd) {
        const { data: currentUser, error: fetchError } = await supabase
            .from('user')
            .select('point')
            .eq('user_id', userId)
            .single();

        if (fetchError) {
            console.error('Error fetching user points:', fetchError);
            return;
        }

        const newPoints = currentUser.point + pointsToAdd;

        const { data, error } = await supabase
            .from('user')
            .update({ point: newPoints })
            .eq('user_id', userId);

        if (error) {
            console.error('Error updating user points:', error);
        } else {
            console.log('User points updated:', data);
        }
    }

    function activitySave() {
        const endTime = new Date();
        if (groupDraw) {
            navigate('/group_activity_save', {
                state: {
                    path: path,
                    time: time,
                    distance: totalDistance,
                    startTime: location.state.startTime,
                    endTime: endTime,
                    drawId: drawId,
                    drawPath: drawPath,
                    passPath: passPath,
                    currentPosition: currentPosition,
                    walkMode: walkMode,
                    color: color,
                    groupId: groupId,
                    regionNumber: regionNumber,
                    drawDistacne: drawDistance
                }
            })
        } else {
            navigate('/Activity_Save', {
                state: {
                    path: path,
                    time: time,
                    distance: totalDistance,
                    startTime: location.state.startTime,
                    endTime: endTime,
                    drawId: drawId,
                    drawPath: drawPath,
                    passPath: passPath,
                    currentPosition: currentPosition,
                    walkMode: walkMode,
                    color: color,
                    level: level
                }
            });
        }
    }

    const handleARCapture = () => {
        setPoints(points + 1);
        setIsARMode(false);
        startTracking();
    };

    useEffect(() => {
        if (isARMode) {
            const video = videoRef.current;
            if (navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices.getUserMedia({ video: true })
                    .then((stream) => {
                        video.srcObject = stream;
                    })
                    .catch((error) => {
                        console.error("Error accessing webcam: ", error);
                    });
            }
        }
    }, [isARMode]);

    // 아바타 URL 가져오기
    useEffect(() => {
        const fetchAvatarUrl = async () => {
            const url = await fetchAvatar(userID); // 아바타 URL 가져오기
            if (url) {
                setAvatarUrl(url); // 아바타 URL 설정
            }
        };
        fetchAvatarUrl();
    }, [userID]);

    if (isARMode) {
        return (
            <div className="ar-container">
                <video ref={videoRef} autoPlay className="ar-camera-view" />
                <div className="ar-overlay">
                    <img src={avatarUrl} alt="AR" className="ar-image" onClick={handleARCapture} /> {/* 아바타 URL 사용 */}
                </div>
                <div className="ar-info">
                    <div>AR 모드 활성화</div>
                    <div>AR 이미지를 클릭하세요!</div>
                </div>
            </div>
        );
    }

    if (pathLoading) {
        return (
            <div className="BeforeStart_container">
                <img className='start_loadimg' src="./images/logo.png" alt="" />
                <div className='start_loadmessage'>당신의 산책을 <br /> 시작하는 중...</div>
            </div>
        );
    }

    return (
        <div className="Start_container">
            {showPointPopup && (
                <div className="point-popup">
                    1 포인트 획득!
                </div>
            )}
            {isPaused && <div className="close-button" onClick={handleCloseClick}>CLOSE</div>}
            <MapDiv className='e118_443'><MyMap path={path} drawPath={drawPath} center={currentPosition} passPath={passPath} walkMode={walkMode} color={color} avatarUrl={avatarUrl} /></MapDiv> {/* 아바타 URL 전달 */}
            <div className={`start_expanded_content ${isExpanded ? 's_expanded' : 's_collapsed'}`}>
                <img className={`s_icon3 ${isExpanded ? 's_icon3-expanded' : 's_icon3-collapsed'}`} src={icon3Path} alt="Icon 3" onClick={toggleExpand} />
                {isExpanded && (
                    <>
                        <div className="start_label_distance">Km</div>
                        <div className="start_value_distance">{totalDistance.toFixed(2)}</div>
                        <div className="start_label_time">시간</div>
                        <div className="start_value_time">{formatTime(time)}</div>
                        {!isPaused ? (
                            <div className="pause_button" onClick={togglePause}>
                                <div className="button_circle"></div>
                                <div className="button_bar1"></div>
                                <div className="button_bar2"></div>
                            </div>
                        ) : (
                            <div className="button-container">
                                <div className="start_button1" onClick={activitySave}>
                                    <div className="button-label-end">종료</div>
                                </div>
                                <div className="start_button2" onClick={restart}>
                                    <div className="button-label-restart">재시작</div>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
