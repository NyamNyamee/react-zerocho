import React, { useState, useRef, useEffect, useMemo, useCallback, useReducer } from 'react';
import Table from './Table';

// 액션의 type속성을 상수화해서 export해놓고 필요한 자식 컴포넌트에서 import해서 사용한다
export const SET_WINNER = 'SET_WINNER';
export const CLICK_CELL = 'CLICK_CELL';
export const CHANGE_TURN = 'CHANGE_TURN';

// action을 실행시켜 state를 수정하는 reducer
const reducer = (state, action) => {
    switch (action.type) { // action의 type에 따라 다르게 실행
        case SET_WINNER:
            return {
                ...state,
                winner: action.winner
            }
        case CLICK_CELL:
            const tableData = [...state.tableData];
            tableData[action.row] = [...tableData[action.row]];  // immer라이브러리로 가독성 올리는게 좋음
            tableData[action.row][action.cell] = state.turn;

            return {
                ...state,
                tableData
            }
        case CHANGE_TURN:
            return {
                ...state,
                turn: state.turn === 'O' ? 'X' : 'O',
            }
    }
}

// setState (state 선언)
const initialState = {
    winner: '',
    turn: 'O',
    tableData: [
        ['', '', ''],
        ['', '', ''],
        ['', '', '']
    ]
}

const TicTacToe = () => {
    // const [winner, setWinner] = useState('');
    // const [turn, setTurn] = useState('O');
    // const [tableData, setTableData] = useState([['', '', ''], ['', '', ''], ['', '', '']]);

    const [state, dispatch] = useReducer(reducer, initialState);  // useReducer를 사용하면 useState 선언을 initialState에 한번에 해버리면 된다

    const onClickTable = useCallback(() => {  // props로 넘겨줄 함수는 useCallback 사용
        dispatch({  // dispatch에 action객체 만들어를 넣어 state변경
            type: SET_WINNER,
            winner: 'O'
        });
    }, []);

    useEffect(() => {  // tableData가 변할때마다 실행(componentDIdUpdate)
        dispatch({ type: CHANGE_TURN });
    }, [state.tableData]);

    return (
        <>
            <Table tableData={state.tableData} dispatch={dispatch} />
            {state.winner && <div>{state.winner} 팀의 승리입니다!</div>}
        </>
    );
}

export default TicTacToe;