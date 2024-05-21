import React, { useState, useEffect, useRef } from 'react';
import './Start.css';
import { Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline } from 'react-naver-maps';
import { useLocation, useNavigate } from "react-router-dom";

function MyMap({ path, drawPath, center, onShowARImage }) {
    const navermaps = useNavermaps();

    const markerIcon = {
        content: '<div><img src="/images/logo.png" alt="icon" class="icon_size"></div>',
        size: new navermaps.Size(24, 24),
        anchor: new navermaps.Point(12, 12)
    };

    useEffect(() => {
        if (path.length > 1) {
            const lastPosition = path[path.length - 1];
            if (calculateTotalDistance(path) >= 0.05) { // 50m 이상이면
                onShowARImage(lastPosition);
            }
        }
    }, [path]);

    const calculateTotalDistance = (path) => {
        let totalDistance = 0;
        for (let i = 1; i < path.length; i++) {
            totalDistance += calculateDistance(path[i - 1], path[i]);
        }
        return totalDistance;
    };

    const calculateDistance = (coord1, coord2) => {
        const toRad = (x) => (x * Math.PI / 180);
        const R = 6371;
        const dLat = toRad(coord2.lat - coord1.lat);
        const dLng = toRad(coord2.lng - coord1.lng);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    return (
        <NaverMap
            defaultCenter={center ? new navermaps.LatLng(center.lat, center.lng) : new navermaps.LatLng(37.3595704, 127.105399)} defaultZoom={15}>
            {center && (
                <Marker icon={markerIcon} position={new navermaps.LatLng(center.lat, center.lng)} />)}
            {path.length > 1 && (
                <Polyline
                    path={path.map(p => new navermaps.LatLng(p.lat, p.lng))}
                    strokeColor='blue'
                    strokeWeight={4}
                    strokeOpacity={0.8}
                    strokeStyle="solid"
                />
            )}
            {drawPath.length > 1 && (
                <Polyline
                    path={drawPath.map(p => new navermaps.LatLng(p.latitude, p.longitude))}
                    strokeColor='red'
                    strokeWeight={4}
                    strokeOpacity={0.8}
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

    const [isExpanded, setIsExpanded] = useState(true);
    const [isPaused, setIsPaused] = useState(false);
    const [currentPosition, setCurrentPosition] = useState(location.state.currentPosition);
    const [tracking, setTracking] = useState(false);
    const watchIdRef = useRef(null);
    const [path, setPath] = useState([currentPosition]);
    const [drawPath, setDrawPath] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0);
    const [time, setTime] = useState(0);
    const timerRef = useRef(null);
    const [showARCamera, setShowARCamera] = useState(false);
    const videoRef = useRef(null);
    const [arImageVisible, setArImageVisible] = useState(false);
    const [arImageSrc, setArImageSrc] = useState('');
    const [arCameraImageSrc, setArCameraImageSrc] = useState('');
    const [arImagePosition, setArImagePosition] = useState(null);

    useEffect(() => {
        if (location.state.drawPath.length > 1) {
            setDrawPath(location.state.drawPath);
        }
    }, [location.state.drawPath]);

    useEffect(() => {
        if (!isPaused) {
            startTracking();
            startTimer();
        } else {
            stopTracking();
            stopTimer();
        }
    }, [isPaused]);

    useEffect(() => {
        if (showARCamera && videoRef.current) {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                })
                .catch(err => {
                    console.error("Error accessing the camera", err);
                });
        }
    }, [showARCamera]);

    const togglePause = () => {
        setIsPaused(!isPaused);
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
                    const newPosition = { lat: latitude, lng: longitude };
                    setCurrentPosition({ lat: latitude, lng: longitude });
                    setPath((prevPath) => {
                        const newPath = [...prevPath, newPosition];
                        const lastPosition = prevPath[prevPath.length - 1];
                        if (lastPosition) {
                            const distance = calculateDistance(lastPosition, newPosition);
                            setTotalDistance((prevDistance) => prevDistance + distance);
                        }
                        return newPath;
                    });
                },
                (error) => {
                    console.error('위치추적 실패', error);
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

    const stopTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setTracking(false);
    };

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
        const dLat = toRad(coord2.lat - coord1.lat);
        const dLng = toRad(coord2.lng - coord1.lng);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const icon3Path = isExpanded ? "./icon/mdi--arrow-down-drop.svg" : "./icon/mdi--arrow-drop-up.svg";

    const handleShowARImage = (position) => {
        setArImageVisible(true);
        setArImagePosition(position);
        setArImageSrc('../../public/images/logo.png'); // 여기에 나타날 이미지 경로를 설정
        setArCameraImageSrc('../../public/images/logo.png'); // 여기에 카메라에 나타날 이미지 경로를 설정
        alert('50m 달성! 이미지를 클릭하세요.');
        setIsPaused(true);
        setShowARCamera(true);
    };

    const handleARImageClick = () => {
        setShowARCamera(false);
        setIsPaused(false);
        setArImageVisible(false);
        alert('포인트를 획득했습니다!');
    };

    function activitySave() {
        const endTime = new Date();
        navigate('/Activity_Save', {
            state: {
                path: path,
                time: time,
                distance: totalDistance,
                startTime: location.state.startTime,
                endTime: endTime
            }
        });
    }

    return (
        <div className="Start_container">
            {isPaused && <div className="close-button" onClick={handleCloseClick}>CLOSE</div>}
            <MapDiv className='e118_443'>
                <MyMap path={path} drawPath={drawPath} center={currentPosition} onShowARImage={handleShowARImage} />
            </MapDiv>
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
            {arImageVisible && (
                <div className="ar-image-overlay">
                    <img src={arImageSrc} alt="AR Image" onClick={handleARImageClick} />
                </div>
            )}
            {showARCamera && (
                <div className="ar-camera-overlay">
                    <video ref={videoRef} className="ar-camera" />
                    <img src={arCameraImageSrc} alt="AR Image" className="ar-image" />
                </div>
            )}
        </div>
    );
}
