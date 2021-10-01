const React = require('react');

const History = (props) => {
    return (
        <li key={props.history.history + props.history.result}>
            <b>
                {props.history.history}
            </b> 
            - {props.history.result}
        </li>  // 반복문쓸때는 key 속성에 고유한 값을 줘야 한다
    );
}

module.exports = History;