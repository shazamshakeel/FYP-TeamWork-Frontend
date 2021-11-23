import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useLocation, useParams, Link } from "react-router-dom";
import Logo from "../../assets/Logo192.png";
import { useOvermind } from "../../store";
import { SelectButton } from "../../styles/SelectButton";
import ProfileDropdown from "./ProfileDropdown";
import Spinner from "../Spinner";

const NavBarStyled = styled.div`
  width: 100%;
  height: 60px;
  background: var(--bgWhite);
  box-shadow: var(--bs1);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0px 1.25rem 0px 0.5rem;
  font-size: 0.9rem;

  .container {
    display: flex;
    height: 100%;
    align-items: center;
  }

  .logo {
    height: 5rem;
    width: 18rem;
    padding: 0;
    margin: 0;
  }

  .project-name {
    font-size: 1.5rem;
    color: var(--textDark);
    text-transform: capitalize;
    margin: auto;
  }

  .separator {
    width: 1px;
    height: 35px;
    border-left: var(--border-light);
    margin: 0px 24px;
  }
`;

export default function NavBar() {
  const location = useLocation();
  const {
    state: { projects: projectsState },
  } = useOvermind();

  return (
    <NavBarStyled>
      <div className="container">
        <Link to="/">
        <img src={Logo} alt="logo" className="logo"/>
        </Link>
        <div className="separator"></div>
        {projectsState.projectLoading && location.pathname.includes("/b/") && (
          <Spinner style={{ marginLeft: "100px" }} />
        )}
        {!projectsState.projectLoading && location.pathname.includes("/b/") && (
          <>
          <Link to="/">
              <SelectButton>
                <div className="icon">
                  <span className="material-icons">apps</span>
                </div>
                <span>All projects</span>
              </SelectButton>
            </Link>
            <div className="separator"></div>
            
            <span className="project-name">{projectsState?.activeProject?.name}</span>
          </>
        )}
      </div>
      <div className="container">
        {/* {project && <input type="text" placeholder="Search" />} */}
        <ProfileDropdown />
      </div>
    </NavBarStyled>
  );
}
