import React, { useState, useRef, useEffect, useMemo, useCallback, useReducer } from 'react';
import Table from './Table';

// 유저가 클릭한 셀의 행열번호
let recentClick = [-1, -1];

// 액션의 type속성을 상수화해서 export해놓고 필요한 자식 컴포넌트에서 import해서 사용한다
export const SET_WINNER = 'SET_WINNER';
export const CLICK_CELL = 'CLICK_CELL';
export const CHANGE_TURN = 'CHANGE_TURN';
export const RESET_GAME = 'RESET_GAME';

// action을 실행시켜 state를 수정하는 reducer(비동기임)
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

            const clickedCell = [...clickedCell];
            clickedCell[0] = action.row;
            clickedCell[1] = action.cell;

            return {
                ...state,
                tableData,
                clickedCell,
            }
        case CHANGE_TURN:
            return {
                ...state,
                turn: state.turn === 'O' ? 'X' : 'O',
            }
        case RESET_GAME:
            return {
                winner: '',
                turn: 'O',
                tableData: [
                    ['', '', '', ''],
                    ['', '', '', ''],
                    ['', '', '', ''],
                    ['', '', '', ''],
                ],
                clickedCell: [-1, -1] // 유저가 클릭한 셀의 행열번호
            }
    }
}

// setState (state 선언)
const initialState = {
    winner: '',
    turn: 'O',
    tableData: [
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
        ['', '', '', ''],
    ],
    clickedCell: [-1, -1] // 유저가 클릭한 셀의 행열번호
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
        let isGameGoing = true; // 게임 진행중이면 true, 종료시 false

        if (state.clickedCell[0] < 0) {  // 유저가 아직 아무 클릭도 하지 않았을 때 리턴
            return;
        }

        if (isGameGoing) { // 진행중일때는 
            // console.log(state.clickedCell);
            // 유저가 테이블을 클릭해서 데이터를 바꿀 때마다 게임이 종료되었는지 검사
            if (state.tableData[state.clickedCell[0]][0] === state.turn && state.tableData[state.clickedCell[0]][1] === state.turn && state.tableData[state.clickedCell[0]][2] === state.turn && state.tableData[state.clickedCell[0]][3] === state.turn) { // 가로검사
                isGameGoing = false;
                console.log('가로');
            } else if (state.tableData[0][state.clickedCell[1]] === state.turn && state.tableData[1][state.clickedCell[1]] === state.turn && state.tableData[2][state.clickedCell[1]] === state.turn && state.tableData[3][state.clickedCell[1]] === state.turn) { // 세로검사
                isGameGoing = false;
                console.log('세로');
            } else if (state.tableData[0][0] === state.turn && state.tableData[1][1] === state.turn && state.tableData[2][2] === state.turn && state.tableData[3][3] === state.turn) { // 대각\검사
                isGameGoing = false;
                console.log('대각\\');
            } else if (state.tableData[0][3] === state.turn && state.tableData[1][2] === state.turn && state.tableData[2][1] === state.turn && state.tableData[3][0] === state.turn) { // 대각/검사
                isGameGoing = false;
                console.log('대각/');
            }

            if (!isGameGoing) {  // 게임 종료시
                dispatch({ type: SET_WINNER, winner: state.turn });
            } else {  // 게임 진행시
                let isDraw = true;
                state.tableData.forEach(row => {  // 무승부인지 검사 (tableData배열에 값이 전부 들어가있으면 무승부)
                    row.forEach((column) => {
                        if (!column) {
                            isDraw = false;
                        }
                    })
                });
                if (isDraw) { // 무승부일때
                    alert('무승부! 재경기');
                    dispatch({ type: RESET_GAME });
                } else { // 아직 승패가 안났을때
                    dispatch({ type: CHANGE_TURN });
                }
            }
        }
    }, [state.tableData]);

    return (
        <>
            <Table tableData={state.tableData} dispatch={dispatch} />
            {state.winner && <div>{state.winner} 팀의 승리입니다!</div>}
        </>
    );
}

export default TicTacToe;