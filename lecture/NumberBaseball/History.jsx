// const React = require('react');
import React, { memo } from 'react';

const History = memo((props) => {  // memo로 컴포넌트를 감싸주면 클래스에서 Component대신 PureComponent를 상속받는것과 동일(최적화)
    return (
        <li key={props.history.history + props.history.result}>
            <b>
                {props.history.history}
            </b>
            - {props.history.result}
        </li>  // 반복문쓸때는 key 속성에 고유한 값을 줘야 한다
    );
});

// module.exports = History;
export default History;