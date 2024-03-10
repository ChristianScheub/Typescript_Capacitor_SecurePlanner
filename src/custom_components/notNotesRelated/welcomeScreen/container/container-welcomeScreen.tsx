import React, { useState } from "react";
import WelcomeScreen1Container from "./SubContainer/container-welcome1";
import WelcomeScreen2Container from "./SubContainer/container-welcome2";
import WelcomeScreen3Container from "./SubContainer/container-welcome3";
import WelcomeScreen4Container from "./SubContainer/container-welcome4";
import WelcomeScreen5Container from "./SubContainer/container-welcome5";
import "./welcomeContainer.css";
import { useSwipeable } from "react-swipeable";


interface WelcomeContainerProps {
  closeOverlay: (password: string) => void;
}

const WelcomeContainer: React.FC<WelcomeContainerProps> = ({ closeOverlay }) => {
  const [currentScreen, setCurrentScreen] = useState(0);
  const [availableScreens, setAvailableScreens] = useState(5);
 

  const nextScreen = () => setCurrentScreen((current) => (current + 1) % availableScreens);
  const prevScreen = () => setCurrentScreen(current => {
    if (current === 0) return current;
    return (current - 1 + availableScreens) % availableScreens;
  });
  

  const handlers = useSwipeable({
    onSwipedLeft: () => nextScreen(),
    onSwipedRight: () => prevScreen(),
    trackMouse: true,
    trackTouch: true,
  });

  return (
    <div {...handlers} className="welcome-container">
      <div className={`screen ${currentScreen === 4 ? "slide-in" : currentScreen === 5 ? "slide-out" : "hide"}`}>
        <WelcomeScreen5Container closeOverlay={closeOverlay}/>
      </div>

      <div className={`screen ${currentScreen === 3 ? "slide-in" : currentScreen === 4 ? "slide-out" : "hide"}`}>
        <WelcomeScreen4Container closeOverlay={closeOverlay} setAvailableScreens={setAvailableScreens} availableScreens={availableScreens} setCurrentScreen={setCurrentScreen}/>
      </div>
      <div className={`screen ${currentScreen === 2 ? "slide-in" : currentScreen === 3 ? "slide-out" : "hide"}`}>
        <WelcomeScreen3Container onNext={nextScreen} isActivate={currentScreen===2} availableScreens={availableScreens} />
      </div>
      <div className={`screen ${currentScreen === 1 ? "slide-in" : currentScreen === 2 ? "slide-out" : "hide"}`}>
        <WelcomeScreen2Container onNext={nextScreen} availableScreens={availableScreens} />
      </div>
      <div className={`screen ${currentScreen === 0 ? "slide-in" : "slide-out"}`}>
        <WelcomeScreen1Container onNext={nextScreen} availableScreens={availableScreens} />
      </div>
      
    </div>
  );
};

export default WelcomeContainer;