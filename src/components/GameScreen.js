import React from 'react';

const GameScreen = ({ width, height, marginTop, marginLeft, className }) => {
    const containerStyle = {
      width : width+"px",
      height : height+"px",
      marginTop : marginTop+"px",
      marginLeft : marginLeft+"px",
      position: 'absolute'      
    };
  
    return (
      <div class={className} style={containerStyle}>
      
      </div>
    );
  };

export default GameScreen;