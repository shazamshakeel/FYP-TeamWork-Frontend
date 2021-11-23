import React from "react";
import styled from "styled-components";
import { Draggable } from "react-beautiful-dnd";
import { Link, useLocation } from "react-router-dom";
import ProjectCardMembers from "../ProjectCardMembers";
import LabelPill from "../LabelPill";

const TaskStyled = styled.div`
  width: 245px;
  min-height: 50px;
  border-radius: 8px;
  margin: 10px 0px;
  padding: 15px;
  background: var(--white);

  .task-labels {
    width: 100%auto;
    display: flex;
    flex-wrap: wrap;
    gap: 5px;
    margin: 10px 0px;
  }

  .task-cover-container {
    width: 100%;
    height: 130px;
    background: var(--bgGrey);
    border-radius: 8px;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-bottom: 15px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .task-footer {
    display: flex;
  }
`;

export default function Task({ task, index }) {
  const location = useLocation();

  function openTask() {
    console.log(location);
    alert(task._id);
  }

  return (
    <Draggable draggableId={task._id} index={task.position} onClick={openTask}>
      {(provided) => (
        <TaskStyled
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
        >
          {task.coverPhoto !== "" && (
            <Link to={`${location.pathname}?task=${task._id}`}>
              <div className="task-cover-container">
                <img src={task.coverPhoto} alt="task cover"/>
              </div>
            </Link>
          )}

          <Link to={`${location.pathname}?task=${task._id}`}>{task.title}</Link>
          {task.labels.length > 0 && (
            <div className="task-labels">
              {task.labels.map((label) => (
                <LabelPill label={label} key={label._id} />
              ))}
            </div>
          )}

          <div className="task-footer">
            <div>
              <ProjectCardMembers members={task.members} />
            </div>
            <div>
              <div>{/* TODO: comments and attachment number go here */}</div>
            </div>
          </div>
        </TaskStyled>
      )}
    </Draggable>
  );
}
