import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";
import "./darkModeLightMode.css";
import Datenschutz from "./modules/legal/datenschutz";
import Impressum from "./modules/legal/impressum";
import ContainerSettings from "./custom_components/notNotesRelated/settings/container/container_settings";
import ContainerEncryptionKeyModal from "./custom_components/notNotesRelated/encryption_modal/container/container-encryption-modal";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBarContainer from "./custom_components/notNotesRelated/navBar/container/container-navBar";
import ContainerViewNote from "./custom_components/handleNotes/viewNote/container/container-viewNote";
import ContainerEditNote from "./custom_components/handleNotes/editNote/container/container-editNote";
import ContainerEditTodo from "./custom_components/handleNotes/editToDoElement/container/container-editToDo";
import "./i18n";
import SecurityLevel from "./custom_components/enums/SecurityLevel.enum";
import useDarkMode from "./darkModeDetector";

const App: React.FC = () => {
  const [encryptionKey, setEncryptionKey] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  const noPasswordNeeded = (localStorage.getItem("securityLevel")===SecurityLevel.Low);
  const theme = useDarkMode();
  
  return (
    <div className={theme}>
      {!encryptionKey&&!noPasswordNeeded ? (
        <div>
          <Router>
            <Routes>
              <Route path="/datenschutzHome" element={<Datenschutz />} />
              <Route
                path="/"
                element={
                  <ContainerEncryptionKeyModal onSubmit={setEncryptionKey} />
                }
              />
              <Route path="/settingsHome" element={<ContainerSettings />} />
              <Route path="/impressumHome" element={<Impressum />} />

            </Routes>
          </Router>
        </div>
      ) : (
        <div
          className="App backgroundColor"
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh"
          }}
        >
          <div style={{ marginTop: "8vh" }}>
            <Router>
              <Routes>
                <Route path="/datenschutz" element={<Datenschutz />} />
                <Route path="/impressum" element={<Impressum />} />

                <Route path="/settings" element={<ContainerSettings />} />

                <Route
                  path="/edit/:noteId"
                  element={<ContainerEditNote encryptionKey={encryptionKey} />}
                />

                <Route
                  path="/edit/:noteId/NOICE"
                  element={<ContainerEditTodo encryptionKey={encryptionKey} />}
                />

                <Route
                  path="/edit/:noteId/:toDoItemId"
                  element={<ContainerEditTodo encryptionKey={encryptionKey} />}
                />

                <Route
                  path="/"
                  element={
                    <ContainerViewNote
                      encryptionKey={encryptionKey}
                      searchQuery={searchQuery}
                    />
                  }
                />
                <Route
                  path="/edit/new"
                  element={<ContainerEditNote encryptionKey={encryptionKey} />}
                />
              </Routes>
              <NavBarContainer setSearchQuery={setSearchQuery} />
            </Router>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;