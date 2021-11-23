import React from "react";
import styled from "styled-components";
import ProjectCardMember from "./ProjectCardMember";

const ProjectCardMembersStyled = styled.div`
  margin-top: 10px;
  display: flex;
  align-items: center;
  gap: 5px;
  .num-of-others {
    color: var(--textGrey);
    font-size: 0.8rem;
  }
`;

export default function ProjectCardMembers({ members }) {
  let numOfMembersToShow = 3;

  return (
    <ProjectCardMembersStyled>
      {members.map((m, i) => {
        if (i < numOfMembersToShow) {
          return <ProjectCardMember member={m} key={i} />;
        }
      })}

      {members.length > numOfMembersToShow && (
        <span className="num-of-others">
          + {members.length - numOfMembersToShow} others
        </span>
      )}
    </ProjectCardMembersStyled>
  );
}
