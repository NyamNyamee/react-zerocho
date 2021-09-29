const React = require('react');
const { useState, useRef } = React;

// 함수형 컴포넌트 (React Hooks)
const WordRelay = () => {
    // state지정 방법: [state, setState] = React.useState(초기화할 값)
    const [word, setWord] = useState('이인부');
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');

    // ref지정 방법: React.useRef(초기값) 지정 후 실제 태그에서 ref속성 지정
    const refInput = useRef(null);

    const submitHandler = (e) => {
        e.preventDefault();  // form태그의 기본속성인 action 이벤트 방지
        if (word[word.length - 1] === input[0] && input.length > 1) {  // 정답일 때
            setWord(input);
            setInput('');
            setResult(`[${input}] 정답입니다!`);
        } else {  // 오답일 때
            setInput('');
            setResult(`[${input}] 틀렸습니다! :(`);
        }

        refInput.current.focus();  // 끝나면 ref걸어놓은 인풋태그에 포커스 (중간에 current주의)
    }

    const changeHandler = (e) => {
        setInput(e.target.value);
    };

    return (
        <>
            <div>문제: {word}</div>
            <form onSubmit={submitHandler}>
                <input type="text" value={input} onChange={changeHandler} ref={refInput} />
                <button type="submit">확인</button>
            </form>
            <div>
                {result}
            </div>
            <br />
        </>
    );
}

module.exports = WordRelay;