
const drawPath = [
{latitude: 35.1334537, longitude: 129.1014169},
{latitude: 35.133471, longitude: 129.1018953},
{latitude: 35.1335055, longitude: 129.1023737},
{latitude: 35.1337586, longitude: 129.1025144},
{latitude: 35.1340463, longitude: 129.1024722},
{latitude: 35.1342074, longitude: 129.1024582},
{latitude: 35.1344814, longitude: 129.1024271},
{latitude: 35.134769, longitude: 129.1027367},
{latitude: 35.1348496, longitude: 129.1031729},
{latitude: 35.1348496, longitude: 129.1034965},
{latitude: 35.1345357, longitude: 129.1035711},
{latitude: 35.1341675, longitude: 129.1036556},
]


export const PathNavigation = (drawPath) => {
  // 두점의 백터를 구하는 함수
  const vector = (start , end ) => ({
    x : end.longitude - start.longitude,
    y : end.latitude - start.latitude
  });
  // 두 백터 내적 구하는 함수
  const dotProduct = (v1, v2) => v1.x * v2.x + v1.y * v2.y

  // 백터의 크기 구하는 공식
  const magnitude = (v) => Math.sqrt(v.x * v.x + v.y* v.y);


  // 두 백터 사이의 각도 구하기
  const angleBetweenVectors = (v1, v2) =>{
    const dot = dotProduct(v1, v2);
    const mag1 = magnitude(v1);
    const mag2 = magnitude(v2);
    const cosTheta = dot / (mag1 * mag2);
    return Math.acos(cosTheta) * (180 / Math.PI); //라디안에서 도로 단위 변환하기
  }
  
  //백터 외적
  const crossProduct = (v1, v2) => v1.x * v2.y - v1.y * v2.x;

  //왼쪽 오른쪽 방향 구하기
  const turnDirection = (v1, v2) => {
    const cross = crossProduct(v1, v2);
    if (cross > 0) return '좌회전';
    if (cross < 0) return '우회전';
    return '직진';
  };

  //좌표 거리 구하기
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

  const directionsArray = ['시작']
  const angleArray = ['0']
  const distanceArray=[]
  for(let i = 1 ; i < drawPath.length -1  ; i++){
    const v1 = vector(drawPath[i-1], drawPath[i]);
    const v2 = vector(drawPath[i], drawPath[i+1]);
    const direction= turnDirection(v1,v2)
    const angle = angleBetweenVectors(v1, v2)
    angleArray.push(angle.toFixed(4))

    if( angle > 45){
      directionsArray.push(direction)
    }else{
      directionsArray.push('전환없음')
    }
  }
  for(let j =0 ; j< drawPath.length -1 ; j++){
    const distance = calculateDistance(drawPath[j], drawPath[j+1])
    distanceArray.push(distance.toFixed(5))
  }
  console.log(directionsArray)
  console.log(angleArray)
  console.log(distanceArray)
  return { directionsArray, angleArray};
}; 