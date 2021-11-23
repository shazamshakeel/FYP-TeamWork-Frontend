import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useOvermind } from "../store";
import Button from "../styles/Button";
import ProjectCard from "../components/ProjectCard";
import Spinner from "../components/Spinner";
import NewProjectModal from "../components/NewProjectModal";

const ProjectsStyled = styled.div`
  width: 100%;
  height: 100%;
  overflow: auto;
  background: var(--bgGreyLight);

  .inner-container {
    max-width: 1140px;
    margin: 60px auto 40px;
    padding: 0px 20px;
  }

  .header {
    width: 100%100px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .projects-container {
    margin-top: 40px;
    display: flex;
    flex-wrap: wrap;
    gap: 40px;
  }
`;

export default function Projects() {
  const {
    state: { projects: projectsState },
    actions: { projects: projectActions },
  } = useOvermind();

  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    projectActions.resetActiveProject();
    projectActions.getProjects();
  }, []);

  return (
    <ProjectsStyled>
      <div className="inner-container">
        <div className="header">
          <span>All Projects</span>
          <Button onClick={() => setShowModal(true)} style={{ height: "30px" }}>
            + Add
          </Button>
        </div>

        <div className="projects-container">
          {!projectsState.projectsLoading && !projectsState.projectsError ? (
            projectsState.projects.map((project) => {
              return <ProjectCard key={project._id} project={project} />;
            })
          ) : (
            <Spinner style={{ margin: "0px auto" }} />
          )}

          {projectsState.projectsError && !projectsState.projectsLoading && (
            <span>{projectsState.projectsError}</span>
          )}
        </div>
      </div>

      <NewProjectModal show={showModal} closeModal={() => setShowModal(false)} />
    </ProjectsStyled>
  );
}
