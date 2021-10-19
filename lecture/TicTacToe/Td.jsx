import React, { useCallback, memo } from 'react';
import { CLICK_CELL } from './TicTacToe';

const Td = memo(({ rowIndex, columnIndex, columnData, dispatch }) => {
    const onClickTd = useCallback(() => {
        if (columnData) { // 이미 데이터가 존재하면 리턴
            return;
        }
        // 액션 생성해서 디스패치에 담아 날림 -> 리듀서에서 처리할거임
        dispatch({ type: CLICK_CELL, row: rowIndex, cell: columnIndex });
    }, [columnData]);

    return (
        <td onClick={onClickTd}>{columnData}</td>
    );
});

export default Td;