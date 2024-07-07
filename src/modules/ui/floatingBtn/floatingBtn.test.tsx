import { render } from "@testing-library/react";
import FloatingBtn, { ButtonAlignment } from "./floatingBtn";

describe("FloatingBtn Component", () => {
  // Gemeinsame Setup-Funktion
  const setup = (alignment: ButtonAlignment) => {
    const utils = render(
      <FloatingBtn
        alignment={alignment}
        icon={() => <div data-testid="icon" />}
        onClick={() => {}}
      />
    );
    const button = utils.getByTestId("floating-btn");
    const icon = utils.getByTestId("icon");
    const buttonStyles = window.getComputedStyle(utils.getByTestId("floating-btnDiv"));
    return { button, icon, buttonStyles, ...utils };
  };

  it("renders with centered position", () => {
    const { buttonStyles } = setup(ButtonAlignment.CENTER);
    expect(buttonStyles.getPropertyValue("left")).toBe("50%");
    expect(buttonStyles.getPropertyValue("transform")).toBe("translate(-50%, -50%)");
    expect(buttonStyles.getPropertyValue("position")).toBe("fixed");
    expect(buttonStyles.getPropertyValue("bottom")).toBe("10vw");
  });

  it("renders correct with right-aligned position", () => {
    const { buttonStyles } = setup(ButtonAlignment.RIGHT);
    expect(buttonStyles.getPropertyValue("transform")).toBe("translate(-50%, -50%)");
    expect(buttonStyles.getPropertyValue("right")).toBe("0rem");
    expect(buttonStyles.getPropertyValue("position")).toBe("fixed");
    expect(buttonStyles.getPropertyValue("bottom")).toBe("10vw");
  });

  it("renders correct with left-aligned position", () => {
    const { buttonStyles } = setup(ButtonAlignment.LEFT);
    expect(buttonStyles.getPropertyValue("transform")).toBe("translate(50%, -50%)");
    expect(buttonStyles.getPropertyValue("left")).toBe("0rem");
    expect(buttonStyles.getPropertyValue("position")).toBe("fixed");
    expect(buttonStyles.getPropertyValue("bottom")).toBe("10vw");
  });
});