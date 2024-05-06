import React from 'react'
import BeforeStart from './startpage/BeforeStart'
import { Container as MapDiv } from 'react-naver-maps'

const NaverMapContainer = () => {
    return (
        <MapDiv style={{ width: '100%', height: '100%', marginTop: '-30px' }}>
            <BeforeStart />
        </MapDiv>

    )
}

export default NaverMapContainer