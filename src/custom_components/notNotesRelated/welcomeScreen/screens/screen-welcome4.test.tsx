import { render, screen } from "@testing-library/react";
import ViewWelcomeScreen4 from "./screen-welcome4"; // Den Pfad ggf. anpassen
import SecurityLevel from "../../../enums/SecurityLevel.enum"; // Den Pfad ggf. anpassen
import { TFunction } from "i18next";

const tMock: TFunction = ((key: string) => key) as TFunction;

describe("ViewWelcomeScreen4", () => {
  it("renders the component with low", () => {
    render(
      <ViewWelcomeScreen4
        t={tMock}
        securityLevelSelected={SecurityLevel.Low}
        setSecurityLevel={jest.fn()}
        handleSubmit={jest.fn()}
        featureFlag_HighestSec={true}
        availableScreens={4}
      />
    );

    expect(screen.getByText("welcomeScreen4_Headline")).toBeInTheDocument();
    expect(screen.getByText("welcomeScreen_Complete")).toBeInTheDocument();
    expect(screen.getByText("welcomeScreen4_Option1")).toBeInTheDocument();
  });
  
   it('displays the continue button text when securityLevel is not Low', () => {
    render(
      <ViewWelcomeScreen4
        t={tMock}
        securityLevelSelected={SecurityLevel.Medium} // Verändere den SecurityLevel zu einem anderen Wert als Low
        setSecurityLevel={jest.fn()}
        handleSubmit={jest.fn()}
        featureFlag_HighestSec={true}
        availableScreens={4}
      />
    );

    expect(screen.getByText('welcomeScreen_Continue')).toBeInTheDocument();
  });
});