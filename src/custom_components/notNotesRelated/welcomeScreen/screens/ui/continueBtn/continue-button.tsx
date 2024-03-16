import React from 'react';
import './continue-button.css';

interface ContinueButtonProps {
  onClick: () => void;
  textBtn: String;
}

const ContinueButton: React.FC<ContinueButtonProps> = ({ onClick, textBtn }) => {
  return (
    <div id="div-welcome-btn">
          <button onClick={onClick}><b>{textBtn}</b></button>
    </div>
  );
};

export default ContinueButton;