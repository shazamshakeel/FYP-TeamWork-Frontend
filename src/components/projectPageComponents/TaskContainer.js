import React from "react";
import styled from "styled-components";
import Task from "./Task";
import NewTaskButton from "./NewTaskButton";
import ListTitle from "./ListTitle";

const TaskContainerStyled = styled.div`
  min-width: 245px;
  /* min-height: 100px; */
  height: 100%;
  padding-bottom: 50px;
  overflow-x: hidden;
  overflow-y: auto;
  margin: 0px 10px;
`;

export default function TaskContainer({ list }) {
  return (
    <TaskContainerStyled>
      <ListTitle title={list.title} listId={list._id} />
      <div>
        {list.tasks.map((task, index) => (
          <Task task={task} key={task._id} index={task.position} />
        ))}
      </div>
      <NewTaskButton listId={list._id} />
    </TaskContainerStyled>
  );
}
