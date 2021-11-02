import React, { useState, useCallback, useContext, memo } from 'react';
import { TableContext, START_GAME } from './MineSearch';

const Form = memo(() => {
    const [row, setRow] = useState(10);  // 행개수
    const [col, setCol] = useState(10);  // 열개수
    const [mine, setMine] = useState(20);  // 지뢰개수

    const { dispatch } = useContext(TableContext);

    const onChangeRow = useCallback((e) => {
        setRow(e.target.value);
    }, []);

    const onChangeCol = useCallback((e) => {
        setCol(e.target.value);
    }, []);

    const onChangeMine = useCallback((e) => {
        setMine(e.target.value);
    }, []);

    const onClickInputButton = useCallback((e) => {
        e.preventDefault();
        dispatch({ type: START_GAME, row, col, mine });
    }, [row, col, mine]);

    return (
        <form>
            <input type="number" placeholder="행수" value={row} onChange={onChangeRow} />
            <input type="number" placeholder="열수" value={col} onChange={onChangeCol} />
            <input type="number" placeholder="지뢰수" value={mine} onChange={onChangeMine} />
            <button onClick={onClickInputButton}>시작</button>
        </form>
    );
});

export default Form;