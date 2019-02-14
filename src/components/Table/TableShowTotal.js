import React from 'react';

const TableShowTotal = ({total, page, page_count}) => {
  const precent = total % page_count;
  const totalPage = Math.floor(total / page_count);
  const spanStyle = {marginRight:'20px', color: '#888'};
  return(
    <p>
      <span style={spanStyle}>{total}条记录</span>
      <span style={spanStyle} >{page}/{(precent ? totalPage + 1 : totalPage)}页</span>
    </p>
  )
};

export default TableShowTotal;
