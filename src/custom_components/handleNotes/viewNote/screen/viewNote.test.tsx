import { act } from 'react';
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import ViewNoteContainer from "../container/container-viewNote";
import { BrowserRouter as Router } from "react-router-dom";
import { encryptAndStore } from "../../../services/encryptionEngine/encryptionEngine";

const mockEncryptionKey = "some-encryption-key";
const mockSearchQuery = "";

describe("ViewNote Component", () => {
  beforeEach(async () => {
    localStorage.clear();
    await encryptAndStore(
      '{"title":"TestTitel","date":"2023-12-09T20:10:56.534Z","content":"TeschtTescht"}',
      mockEncryptionKey,
      "1"
    );
    await encryptAndStore(
      '{"title":"second","date":"2023-12-09T20:10:56.534Z","content":""}',
      mockEncryptionKey,
      "2"
    );

    await act(async () => {
      render(
        <Router>
          <ViewNoteContainer
            encryptionKey={mockEncryptionKey}
            searchQuery={mockSearchQuery}
          />
        </Router>
      );
    });
  });

  test("should render notes from local storage", async () => {
    await waitFor(() => {
      expect(screen.getByText("TestTitel")).toBeInTheDocument();
      expect(screen.getByText("second")).toBeInTheDocument();

      const styleCard1 = window.getComputedStyle(screen.getByText("TestTitel"));
      expect(styleCard1.marginLeft).toBe("1vw");

      const styleCard2 = window.getComputedStyle(screen.getByText("second"));
      expect(styleCard2.marginLeft).toBe("2vw");
    });
  });

  test("should navigate to edit page on note click", async () => {
    await waitFor(() => {
      expect(screen.getByText("TestTitel")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByText("TestTitel"));
      expect(window.location.pathname).toBe("/edit/1");
    });
  });

  test("should navigate to add note page on add button click", async () => {
    waitFor(() => {
      expect(screen.getByTestId("floating-btn")).toBeInTheDocument();
    });

    await act(async () => {
      fireEvent.click(screen.getByTestId("floating-btn"));
      expect(window.location.pathname).toContain("/edit");
    });
  });
});
