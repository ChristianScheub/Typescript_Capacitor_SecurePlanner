import React, { useState } from "react";
import WelcomeScreen from "../screens/screen-welcome1";
import WelcomeScreen2 from "../screens/screen-welcome2";
import WelcomeScreen3 from "../screens/screen-welcome3";
import WelcomeScreen4 from "../screens/screen-welcome4";
import "./welcomeContainer.css";
import { useSwipeable } from "react-swipeable";


interface WelcomeContainerProps {
  closeOverlay: () => void;
}

const WelcomeContainer: React.FC<WelcomeContainerProps> = ({ closeOverlay }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const totalScreens = 4;

  const nextScreen = () => setCurrentScreen((current) => (current + 1) % totalScreens);
  const prevScreen = () => setCurrentScreen(current => {
    if (current === 0) return current;
    return (current - 1 + totalScreens) % totalScreens;
  });
  

  const handlers = useSwipeable({
    onSwipedLeft: () => nextScreen(),
    onSwipedRight: () => prevScreen(),
    trackMouse: true,
    trackTouch: true,
  });

  return (
    <div {...handlers} className="welcome-container">
      
      <div className={`screen ${currentScreen === 3 ? "slide-in" : currentScreen === 4 ? "slide-out" : "hide"}`}>
        <WelcomeScreen4 closeOverlay={closeOverlay}/>
      </div>
      <div className={`screen ${currentScreen === 2 ? "slide-in" : currentScreen === 3 ? "slide-out" : "hide"}`}>
        <WelcomeScreen3 onNext={nextScreen} isActivate={currentScreen===2} />
      </div>
      <div className={`screen ${currentScreen === 1 ? "slide-in" : currentScreen === 2 ? "slide-out" : "hide"}`}>
        <WelcomeScreen2 onNext={nextScreen} />
      </div>
      <div className={`screen ${currentScreen === 0 ? "slide-in" : "slide-out"}`}>
        <WelcomeScreen onNext={nextScreen} />
      </div>
      
    </div>
  );
};

export default WelcomeContainer;