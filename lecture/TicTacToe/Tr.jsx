import React, { memo } from 'react';
import Td from './Td';

const Tr = memo(({ rowIndex, rowData, dispatch }) => {
    return (
        <tr>
            {Array(rowData.length).fill().map((td, i) => (<Td rowIndex={rowIndex} columnIndex={i} columnData={rowData[i]} dispatch={dispatch} />))}
        </tr>
    );
});

export default Tr;