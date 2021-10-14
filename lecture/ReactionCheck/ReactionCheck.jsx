import React, { useState, useRef, memo } from 'react';

// let timeout = null;
// let startTime = null;
// let endTime = null;

const ReactionCheck = () => {  // 컴포넌트
    // state : setState로 값 변경 시 자동으로 화면이 다시 렌더링됨
    const [status, setStatus] = useState('ready');
    const [message, setMessage] = useState('클릭해서 준비');
    const [result, setResult] = useState([]);
    // ref (dom 접근)
    const screenRef = useRef(null);
    // ref (변수로 활용) : state와 다르게 ref는 값을 바꿔도 다시 렌더링되지 않음
    const timeout = useRef(null);  
    const startTime = useRef(null);
    const endTime = useRef(null);

    const onClickScreen = () => {  // 스크린 클릭 핸들러
        if (status === 'ready') {  // 대기(빨강)
            setStatus('set');
            setMessage('색이 바뀌면 클릭하세요');
            timeout.current = setTimeout(() => {  // 비동기함수라서 준비상태에서 눌러도 클릭하세요로 변함. 그래서 timeout변수에다가 저장한 후 나중에 clearTimeout으로 제거해야 함
                setStatus('go')
                setMessage('지금이니!')
                startTime.current = new Date();  // 시작시간 기록
            }, Math.floor(Math.random() * 2000) + 2000  // 2~4초 후 시작
            );
        } else if (status === 'set') {  // 준비(주황)
            setStatus('ready');
            setMessage('성급하시군요~다시 준비하세요');
            clearTimeout(timeout.current);
        }
        else if (status === 'go') {  // 시작(초록)
            endTime.current = new Date();  // 클릭시간 기록
            setStatus('ready');
            setMessage('클릭해서 준비');
            setResult((prevState) => {
                return [...prevState, endTime.current - startTime.current]
            }
            );
        }
    }

    const onReset = () => {  // 리셋 버튼 핸들러
        setResult([]);
    }

    const showAverageTime = () => {  /* 3항연산자로, 조건에 따라 태그를 떼거나 붙임*/
        return (
            result.length === 0 ?
                null :
                <>
                    <div>
                        시도: {result.length}회<br />현재 반응속도: {result[result.length - 1] / 1000}초<br />평균 반응속도: {result.reduce((a, c) => a + c) / result.length / 1000}초
                    </div>
                    <button onClick={onReset}>리셋</button>
                </>
        );
    }

    return (
        <>
            <div id="screen" className={status} onClick={onClickScreen} ref={screenRef}>
                {message}
            </div>
            {showAverageTime()}
        </>
    );
}

export default ReactionCheck;

