import React from 'react';

export default function GlobalContent (props) {
  return(
    <div style={{
      padding: '20px',
      background: '#fff',
    }}>
      {props.children}
    </div>
  )
}
