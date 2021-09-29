const React = require('react');
const { useState, useRef } = React;

// 함수형 컴포넌트 (React Hooks)
const GuGuDan = () => {
    // state지정 방법: [state, setState] = React.useState(초기화할 값)
    const [first, setFirst] = useState(Math.ceil(Math.random() * 20));
    const [second, setSecond] = useState(Math.ceil(Math.random() * 20));
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');

    // ref지정 방법: React.useRef(초기값) 지정 후 실제 태그에서 ref속성 지정
    const refInput = useRef(null);

    const submitHandler = (e) => {
        e.preventDefault();  // form태그의 기본속성인 action 이벤트 방지
        if (parseInt(input) === first * second) {  // 정답일 때
            setFirst(Math.ceil(Math.random() * 20));
            setSecond(Math.ceil(Math.random() * 20));
            setInput('');
            setResult(`${first}x${second}=${input} 정답입니다!`);
        } else {  // 오답일 때
            setInput('');
            setResult(`${input}는 오답입니다 :(`);
        }

        refInput.current.focus();  // 끝나면 ref걸어놓은 인풋태그에 포커스 (중간에 current주의)
    }

    const changeHandler = (e) => {
        setInput(e.target.value);
    };

    return (
        <>
            <div>{first} 곱하기 {second} 는?</div>
            <form onSubmit={submitHandler}>
                <input type="number" value={input} onChange={changeHandler} ref={refInput} />
                <button type="submit">확인</button>
            </form>
            <div>
                {result}
            </div>
            <br />
        </>
    );
}

module.exports = GuGuDan;