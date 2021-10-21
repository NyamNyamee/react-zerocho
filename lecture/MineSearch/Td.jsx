import React, { useCallback, useContext, memo } from 'react';
import { TableContext, CODE, OPEN_CELL, CLICK_MINE, SET_CELL_QUESTION, SET_CELL_FLAG, SET_CELL_NORMAL } from './MineSearch';

const Td = memo(({ rowIndex, colIndex }) => {
    // TableContext 사용
    const { tableData, dispatch } = useContext(TableContext);

    // td스타일
    const getTdStyle = (code) => {
        switch (code) {
            case CODE.NORMAL:
                return {
                    background: '#444',
                }
            case CODE.OPENED:
                return {
                    background: 'white',
                }
            case CODE.MINE:
                return {
                    background: '#444',
                }
            case CODE.MINE_CLICKED:
                return {
                    background: 'red',
                }
            case CODE.QUESTION:
                return {
                    background: 'yellow',
                }
            case CODE.QUESTION_MINE:
                return {
                    background: 'yellow',
                }
            case CODE.FLAG:
                return {
                    background: 'blue',
                }
            case CODE.FLAG_MINE:
                return {
                    background: 'blue',
                }
            default:
                return {
                    background: 'white',
                }
        }
    }

    // td텍스트
    const getTdText = (code) => {
        switch (code) {
            case CODE.NORMAL:
                return '';
            case CODE.OPENED:
                return '';
            case CODE.MINE:
                return 'X';
            case CODE.MINE_CLICKED:
                return '⁕';
            case CODE.QUESTION:
                return '?';
            case CODE.QUESTION_MINE:
                return '?⁕';
            case CODE.FLAG:
                return '!';
            case CODE.FLAG_MINE:
                return '!⁕';
            default:
                return '';
        }
    }

    // td클릭 시
    const onClickCell = useCallback(() => {
        switch (tableData[rowIndex][colIndex]) {
            // 클릭해도 그대로
            case CODE.OPENED:
            case CODE.FLAG:
            case CODE.FLAG_MINE:
            case CODE.QUESTION:
            case CODE.QUESTION_MINE:
                break;
            // 일반 칸 클릭 시
            case CODE.NORMAL:
                dispatch({
                    type: OPEN_CELL,
                    row: rowIndex,
                    col: colIndex,
                });
                break;
            // 지뢰 클릭 시
            case CODE.MINE:
                dispatch({
                    type: CLICK_MINE,
                    row: rowIndex,
                    col: colIndex,
                });
                break;
        }
    }, [tableData[rowIndex][colIndex]]);

    // td우클릭 시
    const onRightClickCell = useCallback((e) => {
        e.preventDefault();  // 브라우저 기본 우클릭 메뉴 방지
        switch (tableData[rowIndex][colIndex]) {
            // 일반, 지뢰일 때
            case CODE.NORMAL:
            case CODE.MINE:
                dispatch({
                    type: SET_CELL_FLAG,
                    row: rowIndex,
                    col: colIndex,
                });
                break;
            // 깃발일 때
            case CODE.FLAG:
            case CODE.FLAG_MINE:
                dispatch({
                    type: SET_CELL_QUESTION,
                    row: rowIndex,
                    col: colIndex,
                });
                break;
            // 물음표일 때
            case CODE.QUESTION:
            case CODE.QUESTION_MINE:
                dispatch({
                    type: SET_CELL_NORMAL,
                    row: rowIndex,
                    col: colIndex,
                });
                break;
        }
    }, [tableData[rowIndex][colIndex]]);

    return (
        <td
            style={getTdStyle(tableData[rowIndex][colIndex])}
            onClick={onClickCell}
            onContextMenu={onRightClickCell}
        >
            {getTdText(tableData[rowIndex][colIndex])}
        </td>
    );
});

export default Td;