import React, { useState, useRef, useEffect } from 'react';

const imgCoords = { 바위: '0px', 가위: '-142px', 보: '-284px' };
const scores = { 바위: -1, 가위: 0, 보: 1 }
const computerChoice = (imgCoord) => {
    return Object.entries(imgCoords).find(function (v) {
        return v[1] === imgCoord;
    })[0];
}

const RockScissorsPaper = () => {
    const [imgCoord, setImgCoord] = useState(imgCoords.바위);
    const [result, setResult] = useState('');
    const [score, setScore] = useState(0);

    const interval = useRef(null);

    /***
     * 컴포넌트 lifeCycle 메서드 (훅스 말고 클래스에서만 사용가능)
     */
    // const componentDidMount = () => {  // 컴포넌트 최초 렌더링 직후 실행됨. 비동기를 많이 사용
    //     changeHand();
    // }
    // const componentDidUpdate = () => {  // 컴포넌트 리 랜더링 직후 실행됨
    // }
    // const componentWillUnmount = () => {  // 컴포넌트가 제거되기 직전 실행됨. 비동기 제거를 많이 사용
    //     clearInterval(interval.current);
    // }

    /**
     * 훅스에서는 useEffect가 클래스에서의 lifeCycle 메서드 역할을 한다.
     */
    useEffect(() => {
        interval.current = setInterval(changeHand, 1000);
        return () => { // componentWillUnmount 역할
            clearInterval(interval.current);
        }
    }, [imgCoord]);  // 두번째 파라미터(배열)에 아무것도 안넣으면 한번 실행됨(componentDidMount), 배열안에 state를 넣으면 그 stete가 변할때마다 useEffect가 실행됨(componentDidUpdate)

    const changeHand = () => {
        if (imgCoord === imgCoords.바위) {
            setImgCoord(imgCoords.가위)
        } else if (imgCoord === imgCoords.가위) {
            setImgCoord(imgCoords.보)
        } else if (imgCoord === imgCoords.보) {
            setImgCoord(imgCoords.바위)
        }
    }


    const onClickBtn = (userChoice) => (e) => {  // 핸들러. dom에서 핸들러에 파라미터를 넣고싶으면 이런식으로 화살표함수를 두번쓰면 됨(고차함수)
        clearInterval(interval);
        const myScore = scores[userChoice];
        const computerScore = scores[computerChoice(imgCoord)];
        const diff = myScore - computerScore;

        if (diff === 0) { // 비김
            setResult('비겼습니다');
        } else if ([-1, 2].includes(diff)) {
            setResult('이겼습니다!');
            setScore((prevScore) => { return prevScore + 1; });
        } else {
            setResult('졌습니다ㅠ')
            setScore((prevScore) => { return prevScore - 1; });
        }

        setTimeout(() => {
            interval.current = setInterval(changeHand, 500)
        }, 1000);
    }

    return (
        <>
            <div id="computer" style={{ background: `url(https://en.pimg.jp/023/182/267/1/23182267.jpg) ${imgCoord} 0` }}></div>
            <div>
                <button id="rock" className="btn" onClick={onClickBtn('바위')}>바위</button>
                <button id="scissors" className="btn" onClick={onClickBtn('가위')}>가위</button>
                <button id="paper" className="btn" onClick={onClickBtn('보')}>보</button>
            </div>
            <div>{result}</div>
            <div>현재 점수: {score}점</div>
        </>
    );
}

export default RockScissorsPaper;