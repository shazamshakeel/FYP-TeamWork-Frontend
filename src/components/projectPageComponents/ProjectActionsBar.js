import React, { useEffect, useState } from "react";
import styled from "styled-components";
import VisibilitySelect from "../VisibilitySelect";
import MembersBar from "../MembersBar";
import { SelectButton } from "../../styles/SelectButton";
import { useOvermind } from "../../store";

const ProjectActionsBarStyled = styled.div`
  width: 100%;
  height: 40px;
  padding: 0px 24px;
  display: flex;
  align-items: center;
`;

export default function ProjectActionsBar({ project, toggleMenu }) {
  let members = [];
  if (project) {
    members = [project.createdBy, ...project.members];
  }

  const {
    actions: { projects: projectsActions },
  } = useOvermind();

  function setVisibilityHandler(val) {
    console.log(val);
    projectsActions.updateProject({
      updatedProps: {
        visibility: val,
      },
      cb: (code) => {
        if (code) {
          console.log("some error happened");
          return;
        }
        console.log("Update successful");
      },
    });
  }

  return (
    <ProjectActionsBarStyled>
      <VisibilitySelect
        visibility={project?.visibility ? project.visibility : "Public"}
        changeVisibility={setVisibilityHandler}
      />
      <MembersBar members={members} />
      <SelectButton style={{ marginLeft: "auto" }} onClick={toggleMenu}>
        <div className="icon">
          <span className="material-icons">more_horiz</span>
        </div>
        <span>Show Menu</span>
      </SelectButton>
    </ProjectActionsBarStyled>
  );
}
