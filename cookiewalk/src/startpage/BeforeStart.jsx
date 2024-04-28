import './BeforeStart.css'
import { Link } from "react-router-dom";

export default function BeforeStart(){
    return(
        <div className="BeforeStart_container">
            <div><img className='e118_437' src="./icon/arrow.svg"/></div>
            <div><img className='e118_439' src="./icon/setting.svg"/></div>
            
            {/* 지도 넣는 곳 */}
            <div><img className="e118_427" src="./images/image 229_4174.png" alt="map" /></div>

            <div><img className="route" src="./icon/route.svg"/></div>
            <span className="e118_432">루트</span>

            {/* 중간막대 */}
            <div className="e118_431"></div>
            

            <span className="e118_434">미완성 경로</span>
            <div className="e118_435"></div>
            <div className="e118_436"></div>
            
            <span className="e118_433">시작</span>
            <div className="e118_426"></div>
        </div>
    );
}