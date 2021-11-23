import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams, useLocation } from "react-router-dom";
import { useOvermind } from "../store";
import ProjectActionsBar from "../components/projectPageComponents/ProjectActionsBar";
import Spinner from "../components/Spinner";
import BardSlideMenu from "../components/projectPageComponents/ProjectSlideMenu";
import ListsContainer from "../components/projectPageComponents/ListsContainer";
import TaskModal from "../components/taskModal/TaskModal";

const ProjectStyled = styled.div`
  padding-top: 24px;
  height: 100%;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  overflow: hidden;
`;

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function Project() {
  const location = useLocation();
  const { id } = useParams();
  const query = useQuery();

  const [showMenu, setShowMenu] = useState(false);
  const [taskModalId, setTaskModalId] = useState(null);

  const {
    state: { projects: projectsState },
    actions: { projects: projectsActions },
  } = useOvermind();

  useEffect(() => {
    projectsActions.getActiveProject(id);
  }, []);

  useEffect(() => {
    let taskId = query.get("task");
    setTaskModalId(taskId);
  }, [location.search]);

  function toggleMenuHandler() {
    setShowMenu(!showMenu);
  }

  return (
    <ProjectStyled>
      {projectsState.projectLoading && (
        <div style={{ textAlign: "center" }}>
          <Spinner />
        </div>
      )}
      {!projectsState.projectLoading && (
        <>
          <ProjectActionsBar
            project={projectsState.activeProject}
            toggleMenu={toggleMenuHandler}
          />

          <ListsContainer />
        </>
      )}

      {taskModalId && <TaskModal taskId={taskModalId} />}

      <BardSlideMenu
        project={projectsState.activeProject}
        show={showMenu}
        toggleMenu={toggleMenuHandler}
      />
    </ProjectStyled>
  );
}
