import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { getInitials } from "../utils";
import ProjectCardMember from "./ProjectCardMember";
import ProjectCardMembers from "./ProjectCardMembers";

const ProjectCardStyled = styled.div`
  width: 243px;
  height: 243px;
  border-radius: 12px;
  box-shadow: var(--bs2);
  background: var(--white);
  padding: 12px;
  .cover-photo-inner {
    width: 219px;
    height: 130px;
    border-radius: 8px;
    overflow: hidden;
    margin-bottom: 15px;
    background: var(--bgGrey);
    font-size: 2rem;
    display: flex;
    justify-content: center;
    align-items: center;
    color: var(--textGrey);
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .project-name {
    text-transform: capitalize;
    a {
      color: var(--textDark);
      text-decoration: none;
      &:hover {
        color: var(--blue);
        text-decoration: underline;
      }
    }
  }

  .project-card-members {
    margin-top: 10px;
    display: flex;
    align-items: center;
    -webkit-gap: 5px;
    gap: 5px;
    .num-of-others {
      color: var(--textGrey);
      font-size: 0.8rem;
    }
  }
`;

export default function ProjectCard({ project }) {
  const { name, createdBy, members, _id, coverPhoto } = project;

  const projectInitials = getInitials(name);

  let allMembers = [createdBy, ...members];

  return (
    <ProjectCardStyled>
      <Link to={`/b/${_id}`}>
        <div className="cover-photo-inner">
          {coverPhoto !== "" ? (
            <img src={coverPhoto} alt="" />
          ) : (
            <span>{projectInitials}</span>
          )}
        </div>
      </Link>

      <div className="project-name">
        <Link to={`/b/${_id}`}>{name}</Link>
      </div>

      <ProjectCardMembers members={allMembers} />
    </ProjectCardStyled>
  );
}
