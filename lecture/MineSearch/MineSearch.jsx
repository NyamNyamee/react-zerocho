import React, { useReducer, useEffect, createContext, useMemo } from 'react';
import Table from './Table';
import Form from './Form';

// data code 선언
export const CODE = {
    OPENED: 0,
    NORMAL: -1,
    QUESTION: -2,
    FLAG: -3,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    MINE_CLICKED: -6,
    MINE: -7,
}

// state 선언
const initialState = {
    tableData: [],
    timer: 0,
    result: '',
    halted: false,
}

// 테이블 데이터 생성 작업
const plantMine = (row, col, mine) => {
    console.log(`${row}x${col}/${mine} plantMine()`);
    if (mine > row * col) {
        alert('지뢰 개수가 너무 많습니다');
        return;
    }
    const candidate = Array(row * col).fill().map((arr, i) => { // row*col 길이의 배열을 만들고 그 안에 반복문(map)으로 값을 채워넣음
        return i;
    });

    const shuffle = [];
    while (candidate.length > row * col - mine) {
        const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
        shuffle.push(chosen);
    }

    const data = [];
    for (let i = 0; i < row; i++) {
        const rowData = [];
        data.push(rowData);

        for (let j = 0; j < col; j++) {
            rowData.push(CODE.NORMAL);
        }
    }

    for (let k = 0; k < shuffle.length; k++) {
        const ver = Math.floor(shuffle[k] / col);
        const hor = shuffle[k] % col;
        data[ver][hor] = CODE.MINE;
    }

    // console.log(data);
    return data;
}

// action.type 선언
export const START_GAME = 'START_GAME';
export const OPEN_CELL = 'OPEN_CELL';
export const CLICK_MINE = 'CLICK_MINE';
export const SET_CELL_FLAG = 'SET_CELL_FLAG';
export const SET_CELL_QUESTION = 'SET_CELL_QUESTION';
export const SET_CELL_NORMAL = 'SET_CELL_NORMAL';

// reducer 설정
const reducer = (state, action) => {
    switch (action.type) {
        case START_GAME:
            return {
                ...state,
                tableData: plantMine(action.row, action.col, action.mine),
                halted: false,
            }
        case OPEN_CELL: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            tableData[action.row][action.col] = CODE.OPENED;
            return {
                ...state,
                tableData,
            }
        }
        case CLICK_MINE: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            tableData[action.row][action.col] = CODE.MINE_CLICKED;
            return {
                ...state,
                tableData,
                halted: true,
            }
        }
        case SET_CELL_FLAG: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if (tableData[action.row][action.col] === CODE.MINE) {  // 깃발을 꼽았는데 그자리가 지뢰라면
                tableData[action.row][action.col] = CODE.FLAG_MINE;
            } else {
                tableData[action.row][action.col] = CODE.FLAG;
            }

            return {
                ...state,
                tableData,
            }
        }
        case SET_CELL_QUESTION: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if (tableData[action.row][action.col] === CODE.FLAG_MINE) {  // 깃발을 꼽았는데 그자리가 깃발이 꼽힌 지뢰 자리라면
                tableData[action.row][action.col] = CODE.QUESTION_MINE;
            } else {
                tableData[action.row][action.col] = CODE.QUESTION;
            }

            return {
                ...state,
                tableData,
            }
        }
        case SET_CELL_NORMAL: {
            const tableData = [...state.tableData];
            tableData[action.row] = [...state.tableData[action.row]];
            if (tableData[action.row][action.col] === CODE.QUESTION_MINE) {  // 깃발을 꼽았는데 그자리가 물음표가 꼽힌 지뢰 자리라면
                tableData[action.row][action.col] = CODE.MINE;
            } else {
                tableData[action.row][action.col] = CODE.NORMAL;
            }

            return {
                ...state,
                tableData,
            }
        }
        default:
            return state;
    }
}

// context 생성
export const TableContext = createContext({
    tableData: [],
    dispatch: () => { },
});

// component 생성
const MineSearch = () => {
    const [state, dispatch] = useReducer(reducer, initialState);

    const value = useMemo(() => {
        return (
            { tableData: state.tableData, dispatch }
        );
    }, [state.tableData]);

    return (  // context로 묶어주면 자식 컴포넌트에서 value에 해당하는 props를 바로 사용할 수 있다
        <TableContext.Provider value={value}>
            <Form />
            <div>경과 시간(초): {state.timer}</div>
            <Table />
            <div>{state.result}</div>
        </TableContext.Provider>
    );
}

export default MineSearch;