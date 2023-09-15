import React from 'react';

const CenteredDiv = ({ children, width, height }) => {
  const containerStyle = {
    width : (width)+"px",
    height : (height)+"px",
  };

  return (
    <div class="flex bg-gray-950" style={containerStyle}>
      {children}
    </div>
  );
};


export default CenteredDiv;