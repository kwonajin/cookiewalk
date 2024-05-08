import react from 'react';
import { Container as MapDiv, NaverMap, Marker, useNavermaps } from 'react-naver-maps'

function MyMap() {
  // instead of window.naver.maps
  const navermaps = useNavermaps()

  return (
    <NaverMap
      defaultCenter={new navermaps.LatLng(37.3595704, 127.105399)}
      defaultZoom={15}
    >
      <Marker
        defaultPosition={new navermaps.LatLng(37.3595704, 127.105399)}
      />
    </NaverMap>
  )
}

export default function draw_map(){
    
  return(
    <div>
      <MapDiv style={{width:'500px' ,height: '500px'}}><MyMap/></MapDiv>
    </div>
  )

}