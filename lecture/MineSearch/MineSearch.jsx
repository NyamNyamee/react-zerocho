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
    data: {
        row: 0,
        col: 0,
        mine: 0,
    },
    timer: 0,
    result: '',
    halted: true,
    openedCount: 0,
}

// 테이블 데이터 생성 작업
const plantMine = (row, col, mine) => {
    console.log(`${row}x${col}/${mine} plantMine()`);
    if (mine > row * col) {
        throw new Error('지뢰 개수가 너무 많습니다.');
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
export const INCREMENT_TIMER = 'INCREMENT_TIMER';

// reducer 설정
const reducer = (state, action) => {
    switch (action.type) {
        case START_GAME:
            return {
                ...state,
                data: {
                    row: action.row,
                    col: action.col,
                    mine: action.mine
                },
                openedCount: 0,
                tableData: plantMine(action.row, action.col, action.mine),
                halted: false,
                timer: 0,
            }
        case OPEN_CELL: {
            const tableData = [...state.tableData];
            tableData.forEach((row, i) => {
                tableData[i] = [...row];
            });
            const checked = []; // 이미 검사된 칸을 담을 배열
            let openCount = 0; // 오픈한 칸의 개수
            // 열어재낀 칸을 감싸고 있는 칸의 지뢰 개수를 검사
            const checkAround = (row, col) => {
                // 상하좌우 없는칸은 열지않기
                if (row < 0 || row >= tableData.length || col < 0 || col >= tableData[0].length) {
                    return;
                }
                // 이미 뭔가 작업이 되어있는칸이면 중지
                if ([CODE.OPENED, CODE.FLAG, CODE.FLAG_MINE, CODE.QUESTION, CODE.QUESTION_MINE].includes(tableData[row][col])) {
                    return;
                }
                // 이미 검사된 칸이면 중지
                if (checked.includes(row + ',' + col)) {
                    return;
                } else { // 아니라면 배열에 투입
                    checked.push(row + ',' + col);
                }
                openCount += 1; // 오픈한 개수 증가
                let around = [];
                if (tableData[row - 1]) {  // 오픈한 칸의 윗줄이 있으면 검사
                    around = around.concat(
                        tableData[row - 1][col - 1],
                        tableData[row - 1][col],
                        tableData[row - 1][col + 1],
                    );
                }
                around = around.concat(  // 양옆칸 검사
                    tableData[row][col - 1],
                    tableData[row][col + 1],
                );
                if (tableData[row + 1]) {  // 오픈한 칸의 아랫줄이 있으면 검사
                    around = around.concat(
                        tableData[row + 1][col - 1],
                        tableData[row + 1][col],
                        tableData[row + 1][col + 1],
                    );
                }
                // 지뢰가 있는지 검사해서 있는 개수만큼 테이블 데이터에 저장
                const aroundCount = around.filter((v) => [CODE.MINE, CODE.FLAG_MINE, CODE.QUESTION_MINE].includes(v)).length;
                // 주변에 지뢰가 없으면 
                if (aroundCount === 0) {
                    if (row > -1) {
                        const near = [];
                        if (row - 1 > -1) {  // 오픈한 칸의 윗줄이 있으면 검사
                            near.push([row - 1, col - 1]);
                            near.push([row - 1, col]);
                            near.push([row - 1, col + 1]);
                        }
                        near.push([row, col - 1]);  // 양옆칸 검사
                        near.push([row, col + 1]);
                        if (row + 1 < tableData.length) {  // 오픈한 칸의 아랫줄이 있으면 검사
                            near.push([row + 1, col - 1]);
                            near.push([row + 1, col]);
                            near.push([row + 1, col + 1]);
                        }

                        near.forEach((v) => {
                            // if (tableData[v[0]][v[1]] !== CODE.OPENED) { // 이미 오픈된칸이 아닐때만 체크
                            if (tableData[v[0]][v[1]] === CODE.NORMAL) { // 오픈되지 않은 칸일때만 재귀함수 호출해서 연쇄적으로 오픈
                                checkAround(v[0], v[1]);
                            }
                        });
                    }
                }
                tableData[row][col] = aroundCount;
            }

            checkAround(action.row, action.col);

            let halted = false;
            let result = '';
            // console.log(state.data.row * state.data.col - state.data.mine, state.openedCount, openCount);
            if (state.data.row * state.data.col - state.data.mine === state.openedCount + openCount) {  // 게임 승리 시
                halted = true;
                result = `축하합니다! 경과시간: ${state.timer}초`;
            }

            return {
                ...state,
                tableData,
                openedCount: state.openedCount + openCount,
                halted,
                result,
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
        case INCREMENT_TIMER: {

            return {
                ...state,
                timer: state.timer + 1,
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
    const { tableData, halted, timer, result } = state;

    const value = useMemo(() => {  // context 사용 시 useMemo를 사용해줘야함
        return (
            { tableData, halted, dispatch }
        );
    }, [tableData, halted]);

    useEffect(() => {
        let timer;
        if (halted === false) {
            timer = setInterval(() => {
                dispatch({ type: INCREMENT_TIMER });
            }, 1000);
        }
        return () => {
            clearInterval(timer);
        }
    }, [halted]);

    return (  // context로 묶어주면 자식 컴포넌트에서 value에 해당하는 props를 바로 사용할 수 있다
        <TableContext.Provider value={value}>
            <Form />
            <div>플레이타임: {timer}초</div>
            <Table />
            <div>{result}</div>
        </TableContext.Provider>
    );
}

export default MineSearch;