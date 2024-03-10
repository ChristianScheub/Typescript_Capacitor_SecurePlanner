import React from 'react';
import './continue-button.css';

interface ContinueButtonProps {
  onClick: () => void;
  textBtn: String;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ onClick, textBtn }) => {
  return (
    <div style={{width:"100vw",textAlign:"right",position:"absolute",bottom:"8vh"}}>
          <button onClick={onClick}><b>{textBtn}</b></button>
    </div>
  );
};

export default ContinueButton;
