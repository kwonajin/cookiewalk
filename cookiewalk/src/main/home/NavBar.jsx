import { Link } from "react-router-dom"

export default function NavBar() {
    return(
        <div className="navbar">
        <Link to="/home"><div className="home"><img className="home_home_icon" src="./icon/home.svg" alt="" /></div></Link>
        <Link to="/map"><div className="map"><img className="home_map_icon" src="./icon/map.svg" alt="" /></div></Link>
        <Link to="/BeforeStart"><div className="run"><img className="home_run_icon" src="./icon/record.svg" alt="" /></div></Link>
        <Link to="/group"><div className="group"><img className="home_group_icon" src="./icon/group.svg" alt="" /></div></Link>
        <Link to="/mypage"><div className="my"><img className="home_my_icon" src="./icon/my.svg" alt="" /></div></Link>
      </div>
    )
}