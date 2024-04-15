import './pause.css'

export default function pause(){
  return (
    <div className="pause-container">
      <img className="icon1" src="./icon/setting.svg" alt="Icon 1" />
      <img className="icon2" src="./images/image 229_4174.png" alt="Icon 2" />
      <div className="label1">Km</div>
      <div className="label2">시간</div>
      <div className="value1">0.00</div>
      <div className="close-button">CLOSE</div>
      <div className="bar"></div>
      <img className="icon3" src="./icon/mdi--arrow-down-drop.svg" alt="Icon 3" />
      <div className="value2">00:00:00</div>
      <div className="button-container">
        <div className="button1">
          <div className="button-label-end">종료</div>
        </div>
        <div className="button2">
          <div className="button-label-restart">재시작</div>
        </div>
      </div>
    </div>
  );
}

