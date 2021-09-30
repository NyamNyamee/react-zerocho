const React = require('react');
const { useState, useRef } = React;

function getNumbers() {  // 숫자 네개를 겹치지 않게 뽑는 함수(문제용 숫자)
    return Math.ceil(Math.random() * 9999);
}

// 함수형 컴포넌트 (React Hooks)
const NumberBaseball = () => {
    // state지정 방법: [state, setState] = React.useState(초기화할 값)
    const [number, setNumber] = useState(getNumbers());
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [histories, setHistories] = useState([1234, 2345, 7777]);

    // ref지정 방법: React.useRef(초기값) 지정 후 실제 태그에서 ref속성 지정
    const refInput = useRef(null);

    const submitHandler = (e) => {
        e.preventDefault();  // form태그의 기본속성인 action 이벤트 방지

        setResult(number);

        refInput.current.focus();  // 끝나면 ref걸어놓은 인풋태그에 포커스 (중간에 current주의)
    }

    const changeHandler = (e) => {
        setInput(e.target.value);
    };

    return (
        <>
            <form onSubmit={submitHandler}>
                <input maxLength={4} value={input} onChange={changeHandler} ref={refInput} />
                <button type="submit">확인</button>
            </form>
            <div>
                {result}
            </div>
            <div>
                남은기회: {histories.length}
            </div>
            <ul>
                {  
                    histories.map((history) => {  // 리액트 배열 반복문. 배열.forEach((컴포넌트) => {}) 과 동일
                        return (
                            <li>{history}</li>
                        );
                    })
                }
            </ul>
            <br />
        </>
    );
}

module.exports = NumberBaseball;