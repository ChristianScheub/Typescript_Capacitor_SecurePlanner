import React, { useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import Datenschutz from "./modules/legal/datenschutz";
import Impressum from "./modules/legal/impressum";
import Container_Settings from "./custom_components/notNotesRelated/settings/container_settings";
import Container_EncryptionKeyModal from "./custom_components/notNotesRelated/encryption_modal/container-encryption-modal";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import NavBarContainer from "./custom_components/notNotesRelated/navBar/container-navBar";
import Container_ViewNote from "./custom_components/handleNotes/viewNote/container-viewNote";
import Container_EditNote from "./custom_components/handleNotes/editNote/container-editNote";
import Container_EditTodo from "./custom_components/handleNotes/editToDoElement/container-editToDo";

import "./i18n";

const App: React.FC = () => {
  const [encryptionKey, setEncryptionKey] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <div>
      {!encryptionKey ? (
        <div>
          <Router>
            <Routes>
              <Route path="/datenschutzHome" element={<Datenschutz />} />
              <Route
                path="/"
                element={
                  <Container_EncryptionKeyModal onSubmit={setEncryptionKey} />
                }
              />
              <Route path="/settingsHome" element={<Container_Settings />} />
              <Route path="/impressumHome" element={<Impressum />} />
            </Routes>
          </Router>
        </div>
      ) : (
        <div
          className="App"
          style={{
            display: "flex",
            flexDirection: "column",
            minHeight: "100vh",
            backgroundColor: "#1E1E1E",
            color: "white",
          }}
        >
          <div style={{ marginTop: "8vh" }}>
            <Router>
              <Routes>
                <Route path="/datenschutz" element={<Datenschutz />} />
                <Route path="/impressum" element={<Impressum />} />

                <Route path="/settings" element={<Container_Settings />} />

                <Route
                  path="/edit/:noteId"
                  element={<Container_EditNote encryptionKey={encryptionKey} />}
                />

                <Route
                  path="/edit/:noteId/NOICE"
                  element={<Container_EditTodo encryptionKey={encryptionKey}/>}
                />

                <Route
                  path="/edit/:noteId/:toDoItemId"
                  element={<Container_EditTodo encryptionKey={encryptionKey}/>}
                />

                <Route
                  path="/"
                  element={
                    <Container_ViewNote
                      encryptionKey={encryptionKey}
                      searchQuery={searchQuery}
                    />
                  }
                />
                <Route
                  path="/edit/new"
                  element={<Container_EditNote encryptionKey={encryptionKey} />}
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