// const React = require('react');
// const { useState, useRef } = React;
// const History = require('./History');

import React, { useState, useRef, memo } from 'react';
import History from './History';


function getNumbers() {  // 숫자 네개를 겹치지 않게 뽑는 함수(문제용 숫자)
    const candidate = [1, 2, 3, 4, 5, 6, 7, 8, 9];
    const array = [];
    for (let i = 0; i < 4; i++) {
        const chosen = candidate.splice(Math.floor(Math.random() * (9 - i)), 1)[0];
        array.push(chosen);
    }

    return array;
}


// 함수형 컴포넌트 (React Hooks)
const NumberBaseball = () => {
    // state지정 방법: [state, setState] = React.useState(초기화할 값)
    const [number, setNumber] = useState(getNumbers());  // 문제용 숫자
    const [input, setInput] = useState('');  // 입력값
    const [result, setResult] = useState('');  // 입력 결과
    const [histories, setHistories] = useState([]);  // 입력값과 결과 기록

    // ref지정 방법: React.useRef(초기값) 지정 후 실제 태그에서 ref속성 지정
    const refInput = useRef(null);

    const submitHandler = (e) => {
        e.preventDefault();  // form태그의 기본속성인 action 이벤트 방지

        if (input.split('').includes('0')) { // 입력값 유효성검사
            alert('0은 입력할 수 없습니다!');
            return;
        }

        if (input === number.join('')) { // 정답일 경우
            setResult('홈런!');
            setHistories((prevHistories) => {
                return [...prevHistories, { history: input, result: '홈런~!' }];  // 기존 배열은 그대로 두고 새 배열을 만들어 스테이트 세팅
            });
            alert(`홈런! 리겜!!`);
            setInput('');
            setNumber(getNumbers());
            setHistories([]);
        } else {  // 오답일 경우
            const inputArray = input.split('').map((v) => parseInt(v));
            let strike = 0;
            let ball = 0;
            if (histories.length >= 9) {  // 10번 이상 실패
                alert(`아쉽구만요 정답은 ${number.join('')} 입니다!`);
                setInput('');
                setNumber(getNumbers());
                setHistories([]);
            } else {  // 10번 미만 시도
                for (let i = 0; i < 4; i++) {  // 4자리 중 한자리씩 각각 확인
                    if (inputArray[i] === number[i]) {  // 같은 숫자에 순서까지 같으면 스트라이크
                        strike++;
                    } else if (number.includes(inputArray[i])) {  // 숫자가 포함되어있으면 볼
                        ball++;
                    }
                }
                setHistories((prevHistories) => {
                    return [...prevHistories, { history: input, result: `${strike}S ${ball}B` }];
                });
                setInput('');
                setResult('');
            }
        }

        refInput.current.focus();  // 끝나면 ref걸어놓은 인풋태그에 포커스 (중간에 current주의)
    }

    const changeHandler = (e) => {  // 인풋창 입력 시 핸들러
        setInput(e.target.value);
    };

    return (
        <>
            <form onSubmit={submitHandler}>
                <input minLength={4} maxLength={4} placeholder={'4자리 숫자'} value={input} onChange={changeHandler} ref={refInput} />
                <button type="submit">확인</button>
            </form>
            <div>
                {result}
            </div>
            <div>
                남은기회: {10 - histories.length}
            </div>
            <ol>
                {
                    histories.map((history, index) => (  // 리액트 배열 반복문. 배열.forEach((컴포넌트, 인덱스) => {}) 과 동일 /// 중괄호 안쓰고 그냥 넘기면 return 안적어줘도 됨
                        <History key={history.history + history.result} history={history} index={index} />
                    )
                    )
                }
            </ol>

            <br />
        </>
    );
}

// module.exports = NumberBaseball;

export default NumberBaseball;