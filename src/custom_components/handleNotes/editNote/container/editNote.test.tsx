import { render, fireEvent, screen, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter as Router } from "react-router-dom";
import EditNoteContainer from "./container-editNote";
import {
  encryptAndStore,
  decryptFromStorage,
} from "../../../services/encryptionEngine/encryptionEngine";
import { act } from 'react';

vi.mock("../../../services/toDoListHandler/toDoListHandler", () => ({
  default: {
    loadToDoList: vi.fn(),
    saveToDoList: vi.fn(),
    getCategories: vi.fn(() => []),
    sortToDoList: vi.fn((list) => list),
    generateUniqueToDoId: vi.fn(() => 1),
  }
}));

vi.mock("../../../services/progressToDoListService/progressToDoListService", () => ({
  default: {
    calculateProgress: vi.fn(() => 75),
    calculateProgressForNextNDays: vi.fn(() => 50),
    calculateProgressForCategory: vi.fn(() => 60),
  }
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const mockEncryptionKey = "some-encryption-key";

const mockedNavigate = vi.fn();
vi.mock("react-router-dom", async () => ({
  ...await vi.importActual("react-router-dom"),
  useParams: () => ({ noteId: "22" }),
  useNavigate: () => mockedNavigate,
}));

beforeEach(async () => {
  vi.clearAllMocks();
  localStorage.clear();
});

interface Note {
  id: string;
  content: string;
  title: string;
  date: Date;
  additionalInfo: string;
}

describe("EditNote Component", () => {
  it("renders without crashing", () => {
    render(
      <Router>
        <EditNoteContainer encryptionKey={mockEncryptionKey} />
      </Router>
    );
    
    expect(screen.getByTestId("noteTitleTest")).toBeInTheDocument();
  });

  it("renders with empty title and content initially", () => {
    render(
      <Router>
        <EditNoteContainer encryptionKey={mockEncryptionKey} />
      </Router>
    );
    
    const titleInput = screen.getByTestId("noteTitleTest") as HTMLInputElement;
    const contentTextArea = screen.getByTestId("noteTextTest") as HTMLTextAreaElement;
    
    expect(titleInput.value).toBe("");
    expect(contentTextArea.value).toBe("");
  });

  it("handles input changes correctly", async () => {
    render(
      <Router>
        <EditNoteContainer encryptionKey={mockEncryptionKey} />
      </Router>
    );
    
    const titleInput = screen.getByTestId("noteTitleTest") as HTMLInputElement;
    const contentTextArea = screen.getByTestId("noteTextTest") as HTMLTextAreaElement;
    
    await act(async () => {
      fireEvent.change(titleInput, { target: { value: "New Title" } });
      fireEvent.change(contentTextArea, { target: { value: "New Content" } });
    });

    expect(titleInput.value).toBe("New Title");
    expect(contentTextArea.value).toBe("New Content");
  });

  it("renders the component structure", () => {
    render(
      <Router>
        <EditNoteContainer encryptionKey={mockEncryptionKey} />
      </Router>
    );
    
    expect(screen.getByTestId("noteTitleTest")).toBeInTheDocument();
    expect(screen.getByTestId("noteTextTest")).toBeInTheDocument();
  });
  
});