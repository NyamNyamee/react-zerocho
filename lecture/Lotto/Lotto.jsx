import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import Ball from './Ball';


const getWinNumbers = () => {
    console.log('getWinNumbers()');
    const candidate = Array(45).fill().map((v, i) => i + 1);
    const shuffle = [];
    while (candidate.length > 0) {
        shuffle.push(candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0]);
    }

    const bonusNumber = shuffle[shuffle.length - 1];
    const winNumbers = shuffle.slice(0, 6).sort((p, c) => p - c);

    return [...winNumbers, bonusNumber];
}

const Lotto = () => {
    const lottoNumbers = useMemo(() => getWinNumbers(), []);  // useMemo를 사용하면 첫번째 파라미터인 콜백함수에서 받아온 리턴값을 메모리에 저장해놓을수있어서 불필요한 함수 반복호출을 방지함
    const [winNumbers, setWinNumbers] = useState(lottoNumbers);
    const [winBalls, setWinBalls] = useState([]);
    const [bonus, setBonus] = useState(null);
    const [redo, setRedo] = useState(false);

    const timeouts = useRef([]);

    useEffect(() => {
        console.log('useEffect');
        for (let i = 0; i < winNumbers.length - 1; i++) {
            timeouts.current[i] = setTimeout(() => {
                setWinBalls((prevState) => {
                    return [...prevState, winNumbers[i]];
                });
            }, (i + 1) * 1000);
        }
        timeouts.current[6] = setTimeout(() => {
            setBonus(winNumbers[6]);
            setRedo(true);
        }, 7000);

        return () => { // componentWillUnmount 역할
            timeouts.current.forEach(timeout => { clearTimeout(timeout); });
        }
    }, [timeouts.current]); // 두번쨰 파라미터가 빈 배열이면 클래스에서 componentDidMount 역할  // 배열에 state를 넣으면 componentDidMount, componetDidUpdate 역할

    const onClickRedo = useCallback(() => {  // useCallback 사용시 메모리에 이 함수가 저장되어 화면이 다시 렌더링되도 이 함수는 다시 실행되지 않음. useCallback함수에서 사용되는 state는 두번째 인자 배열안에 넣어야 한다
        console.log('onClickRedo()');
        setWinNumbers(getWinNumbers());
        setWinBalls([]);
        setBonus(null);
        setRedo(false);
        timeouts.current = [winNumbers];
    }, []);

    return (
        <>
            <div>당첨숫자</div>
            <div id="result">
                {winBalls.map((v) => <Ball key={v} number={v} />)}
            </div>
            <div>보너스숫자</div>
            {bonus && <Ball number={bonus} />}
            {redo && <button onClick={onClickRedo}>재시도</button>}
        </>
    );
}

export default Lotto;