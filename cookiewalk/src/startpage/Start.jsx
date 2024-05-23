import React, { useState, useEffect, useRef } from 'react';
import './Start.css';
import { Container as MapDiv, NaverMap, Marker, useNavermaps, Polyline } from 'react-naver-maps';
import { useLocation, useNavigate } from "react-router-dom";

function MyMap({ path, drawPath, center }) {
    const navermaps = useNavermaps();

    const markerIcon = {
        content: '<div><img src="/images/logo.png" alt="icon" class="icon_size"></div>',
        size: new navermaps.Size(24, 24),
        anchor: new navermaps.Point(12, 12)
    };

    return (
        <NaverMap
            defaultCenter={center ? new navermaps.LatLng(center.lat, center.lng) : new navermaps.LatLng(37.3595704, 127.105399)}
            defaultZoom={15}
        >
            {center && (
                <Marker icon={markerIcon} position={new navermaps.LatLng(center.lat, center.lng)} />
            )}
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

    const [isARMode, setIsARMode] = useState(false);
    const [points, setPoints] = useState(0);

    const videoRef = useRef(null);
    const canvasRef = useRef(null);

    useEffect(() => {
        if (location.state.drawPath.length > 1) {
            setDrawPath(location.state.drawPath);
        }
    }, [location.state.drawPath]);

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
                    const newPosition = { lat: latitude, lng: longitude };
                    setCurrentPosition({ lat: latitude, lng: longitude });
                    setPath((prevPath) => {
                        const newPath = [...prevPath, newPosition];
                        const lastPosition = prevPath[prevPath.length - 1];
                        if (lastPosition) {
                            const distance = calculateDistance(lastPosition, newPosition);
                            setTotalDistance((prevDistance) => prevDistance + distance);

                            if (totalDistance + distance >= 0.02) { // 20m
                                stopTracking();
                                setIsARMode(true);
                            }
                        }
                        return newPath;
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

    const stopTracking = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setTracking(false);
        stopTimer();
    };

    useEffect(() => {
        if (isPaused) {
            stopTimer();
            stopTracking();
        } else {
            startTimer();
            startTracking();
        }
    }, [isPaused]);

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
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(coord1.lat)) * Math.cos(toRad(coord2.lat)) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const toggleExpand = () => {
        setIsExpanded(!isExpanded);
    };

    const icon3Path = isExpanded ? "./icon/mdi--arrow-down-drop.svg" : "./icon/mdi--arrow-drop-up.svg";

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

    const handleARCapture = () => {
        setPoints(points + 1);
        setIsARMode(false);
        startTracking();
    };

    useEffect(() => {
        if (isARMode) {
            loadARModel();
        }
    }, [isARMode]);

    const loadARModel = () => {
        const script1 = document.createElement('script');
        script1.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
        script1.onload = () => {
            const script2 = document.createElement('script');
            script2.src = 'https://cdn.jsdelivr.net/npm/three/examples/js/loaders/GLTFLoader.js';
            script2.onload = () => {
                initAR();
            };
            document.body.appendChild(script2);
        };
        document.body.appendChild(script1);
    };

    const initAR = () => {
        const container = document.getElementById('arContainer');
        const canvas = document.createElement('canvas');
        canvas.style.position = 'absolute';
        canvas.style.top = 0;
        canvas.style.left = 0;
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        container.appendChild(canvas);

        const renderer = new THREE.WebGLRenderer({ canvas, alpha: true });
        renderer.setSize(window.innerWidth, window.innerHeight);

        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(70, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 1.6, 3);

        const light = new THREE.HemisphereLight(0xffffff, 0x444444);
        light.position.set(0, 20, 0);
        scene.add(light);

        const loader = new THREE.GLTFLoader();
        loader.load('/귀여운_강아지__0523000915_preview.glb', (gltf) => {
            const model = gltf.scene;
            model.position.set(0, -1.5, -5);
            scene.add(model);

            const animate = () => {
                requestAnimationFrame(animate);
                model.rotation.y += 0.01;
                renderer.render(scene, camera);
            };
            animate();
        });

        container.addEventListener('click', handleARCapture);
    };

    if (isARMode) {
        return (
            <div id="arContainer" className="ar-container">
                <video ref={videoRef} autoPlay className="ar-camera-view" />
                <div className="ar-overlay">
                    <img src="/images/logo.png" alt="AR" className="ar-image" />
                </div>
                <div className="ar-info">
                    <div>AR 모드 활성화</div>
                    <div>AR 이미지를 클릭하세요!</div>
                </div>
            </div>
        );
    }

    return (
        <div className="Start_container">
            {isPaused && <div className="close-button" onClick={handleCloseClick}>CLOSE</div>}

            <MapDiv className='e118_443'><MyMap path={path} drawPath={drawPath} center={currentPosition} /></MapDiv>

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
