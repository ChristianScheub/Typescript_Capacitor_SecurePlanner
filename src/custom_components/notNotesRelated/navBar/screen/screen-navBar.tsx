import React from "react";
import { Navbar, Container, Button, Form } from "react-bootstrap";
import { FaTrash, FaAngleLeft } from "react-icons/fa";
import { MdOutlineSettings } from "react-icons/md";
import { TFunction } from "i18next";
import './screen-navbar.css';

interface NavBarViewProps {
  tempSearch: string;
  showBackButton: boolean;
  showDeleteBtn: boolean;
  showSettingsButton: boolean;
  onBackClick: () => void;
  onDeleteClick: () => void;
  onSettingsClick: () => void;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSearchSubmit: (e: React.FormEvent) => void;
  t: TFunction;
}

const NavBarView: React.FC<NavBarViewProps> = ({
  tempSearch,
  showBackButton,
  showDeleteBtn,
  showSettingsButton,
  onBackClick,
  onDeleteClick,
  onSettingsClick,
  onSearchChange,
  onSearchSubmit,
  t,
}) => {
  return (
    <Navbar
      variant="dark"
      className="navbarElement width100 justify-content-between backgroundColorNotFocused shadow"
    >
      <Container className="navbarContainer">
        {showBackButton ? (
          <div className="backBtnDiv">
            <Button
              onClick={onBackClick}
              data-testid="back-button"
              className="navbarBackBtn"
            >
              <FaAngleLeft size="2em" />
            </Button>
            {showDeleteBtn && (
              <Button
                onClick={onDeleteClick}
                data-testid="delete-note-button"
                className="navbarDeleteNoteBtn"
              >
                <FaTrash size="1em" className="navbar_trashIcon" />
              </Button>
            )}
          </div>
        ) : (
          <Form onSubmit={onSearchSubmit}>
            <input
              type="search"
              aria-label="Search"
              placeholder={t("navbar_searchForm")}
              onChange={onSearchChange}
              data-testid="navbar_searchForm"
              value={tempSearch}
              className="backgroundColorOnGrey navbarSearchInput"
            />
          </Form>
        )}
          {showSettingsButton && (
            <Button
              variant="link"
              onClick={onSettingsClick}
              className="navbarSettingsBtn"
            >
              <MdOutlineSettings className="iconColor" size="1.5em" />
            </Button>
          )}
      </Container>
    </Navbar>
  );
};

export default NavBarView;