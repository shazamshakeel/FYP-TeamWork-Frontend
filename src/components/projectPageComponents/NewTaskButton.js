import React, { useState, useEffect } from "react";
import styled from "styled-components";
import Button from "../../styles/Button";
import { useOvermind } from "../../store";

const NewTaskButtonStyled = styled.div`
  width: 100%;
  min-height: 32px;
  margin: 24px 0px;
  position: relative;
  z-index: 1;
  .add-task-action {
    width: 100%;
    height: 32px;
    border-radius: 8px;
    padding: 0px 12px;
    background: var(--lightBlue);
    color: var(--blue);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: space-between;
    &:hover {
      filter: brightness(90%);
    }
  }

  .new-button-form {
    border-radius: 8px;
    position: absolute;
    z-index: 1;
    top: 0;
    left: 0;
    width: 100%;
    min-height: 64px;
    background: var(--white);
    display: flex;
    flex-direction: column;
    padding: 15px;
    box-shadow: var(--bs1);
    input {
      border: none;
      font-size: 0.9rem;
      width: 100%;
      height: 32px;
      outline: none;
      color: var(--textDark);
      margin-bottom: 5px;
    }
    .new-button-form--actions {
      display: flex;
      align-items: center;
      justify-content: space-between;
      .material-icons {
        cursor: pointer;
      }
    }
  }
`;

export default function NewTaskButton({ listId }) {
  const [showForm, setShowForm] = useState(false);
  const [newTaskName, setNewTaskName] = useState("");

  const {
    state: { lists: listsState },
    actions: { lists: listsActions },
  } = useOvermind();

  function addNewTaskHandler() {
    //ajax to add new task

    if (newTaskName.trim() === "") {
      return;
    }

    let nextPosition = 0;

    if (
      listsState.lists.filter((list) => list._id === listId)[0]?.tasks.length >
      0
    ) {
      nextPosition =
        Math.max(
          ...listsState.lists
            .filter((list) => list._id === listId)[0]
            .tasks.map((task) => task.position)
        ) + 1;
    }

    listsActions.addTaskToList({
      title: newTaskName,
      listId,
      position: nextPosition,
    });

    closeForm();
  }

  function closeForm() {
    setShowForm(false);
    setNewTaskName("");
  }

  return (
    <NewTaskButtonStyled>
      <div className="add-task-action" onClick={() => setShowForm(true)}>
        <span>Add another task</span>
        <span className="material-icons">add</span>
      </div>
      {showForm && (
        <div className="new-button-form">
          <input
            type="text"
            placeholder="Enter a title for this task"
            value={newTaskName}
            onChange={(e) => setNewTaskName(e.target.value)}
          />
          <div className="new-button-form--actions">
            <Button
              disabled={newTaskName.trim() === ""}
              bg="var(--green)"
              color="#fff"
              onClick={addNewTaskHandler}
            >
              Add Task
            </Button>
            <span className="material-icons" onClick={closeForm}>
              close
            </span>
          </div>
        </div>
      )}
    </NewTaskButtonStyled>
  );
}
