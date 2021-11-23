import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { useHistory, useLocation } from "react-router-dom";
import { api } from "../../utils/api";
import Spinner from "../Spinner";
import { useOvermind } from "../../store";

import TaskTitle from "./TaskTitle";
import DescriptionBox from "../DescriptionBox";
import UnsplashSearch from "../UnsplashSearch";
import AssignMember from "./AssignMember";
import LabelSelect from "../LabelSelect";
import Comments from "./Comments";
import Attachments from "./Attachments";

const TaskModalStyled = styled.div`
  position: fixed;
  top: 0px;
  left: 0px;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow: auto;

  .task-modal {
    width: 660px;
    padding: 24px;
    margin-top: 70px;
    background: var(--white);
    border-radius: 8px;
    box-shadow: var(--bs2);
    position: relative;
    .close-btn {
      position: absolute;
      top: 10px;
      right: 10px;
      width: 32px;
      height: 32px;
      background: var(--blue);
      color: var(--white);
      font-size: 1.1rem;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }

    .cover-image {
      width: 100%;
      height: 130px;
      border-radius: 8px;
      background: var(--bgGrey);
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }
    }

    .main-container {
      width: 100%;
      min-height: 200px;
      display: flex;
      gap: 24px;
      .main {
        flex: 1;
        height: 100%;
      }
      aside {
        width: 150px;
        height: 100%;

        .actions-header {
          display: flex;
          gap: 10px;
          align-items: center;
          color: var(--textGrey);
          font-size: 0.8rem;
          margin: 24px 0px;
        }
      }
    }
  }
`;

export default function TaskModal({ taskId }) {
  const {
    actions: { lists: listsActions },
    state: { user: userState },
  } = useOvermind();

  const [taskState, setTaskState] = useState(null);
  const [taskLoading, setTaskLoading] = useState(true);
  const location = useLocation();
  const history = useHistory();

  //loading state
  const [addingNewComment, setAddingNewComment] = useState(false);
  const [updatingComment, setUpdatingComment] = useState(false);
  //////

  useEffect(() => {
    async function getTaskData() {
      if (!taskId) return;
      try {
        const res = await api.get(`/tasks/${taskId}`);

        if (res.data.success) {
          res.data.data.comments.sort(function (a, b) {
            return new Date(b.createdAt) - new Date(a.createdAt);
          });
          setTaskState(res.data.data);
          setTaskLoading(false);
        } else {
          //TODO: Handle unsuccessful response
          console.log("Handle unsuccessful response");
          setTaskLoading(false);
        }
      } catch (err) {
        console.log(err);
        setTaskLoading(false);
      }
    }
    getTaskData();
  }, [taskId]);

  function closeModal() {
    history.push(location.pathname);
  }

  function descriptionChangeHandler(val) {
    updateAjaxCall({ description: val });
  }

  function coverChangeHandler(val) {
    updateAjaxCall({ coverPhoto: val });
  }

  function onTitleChangeHandler(val) {
    updateAjaxCall({ title: val });
  }

  function addMemberHandler(member) {
    updateAjaxCall({
      members: [...taskState.members.map((m) => m._id), member._id],
    });
  }

  function removeMemberHandler(memberId) {
    let newMembers = taskState.members.filter(
      (member) => member._id !== memberId
    );

    updateAjaxCall({
      members: newMembers,
    });
  }

  function addLabelHandler(val) {
    updateAjaxCall({
      labels: [...taskState.labels, val],
    });
  }

  function removeLabelHandler(id) {
    let nweLabels = taskState.labels.filter((label) => label._id !== id);

    updateAjaxCall({
      labels: nweLabels,
    });
  }

  async function addCommentHandler(text) {
    let newComment = {
      text,
      createdBy: userState.user._id,
      taskId: taskState._id,
    };

    try {
      setAddingNewComment(true);
      const res = await api.post(`/comments`, newComment);
      if (res.data.success) {
        let newComment = res.data.data;
        updateAjaxCall(
          {
            comments: [...taskState.comments.map((c) => c._id), newComment._id],
          },
          () => {
            setAddingNewComment(false);
          }
        );
      } else {
        //TODO: handle notification for unsuccessful update
        setAddingNewComment(false);
        console.log("TODO: handle notification for unsuccessful update");
      }
    } catch (err) {
      //TODO: handle notification for unsuccessful update
      setAddingNewComment(false);
      console.log(err);
    }
  }

  async function updateCommentHandler(newComment) {
    try {
      setUpdatingComment(newComment.id);
      const res = await api.put(`/comments/${newComment.id}`, {
        text: newComment.text,
      });
      if (res.data.success) {
        let updatedComment = res.data.data;
        console.log(updatedComment);
        let taskStateCopy = { ...taskState };
        let newComments = taskStateCopy.comments.map((comment) => {
          if (comment._id === updatedComment._id) {
            return updatedComment;
          }
          return comment;
        });
        taskStateCopy.comments = newComments;
        setTaskState(taskStateCopy);
        setUpdatingComment(false);
      } else {
        //TODO: handle notification for unsuccessful update
        setUpdatingComment(false);
        console.log("TODO: handle notification for unsuccessful update");
      }
    } catch (err) {
      //TODO: handle notification for unsuccessful update
      setUpdatingComment(false);
      console.log(err);
    }
  }

  async function deleteCommentHandler(id) {
    try {
      const res = await api.delete(`/comments/${id}`);
      if (res.data.success) {
        let updatedComment = res.data.data;

        let taskStateCopy = { ...taskState };
        let newComments = taskStateCopy.comments.filter((comment) => {
          if (comment._id !== id) {
            return comment;
          }
        });
        taskStateCopy.comments = newComments;

        updateAjaxCall({ comments: [...newComments.map((c) => c._id)] }, () => {
          setTaskState(taskStateCopy);
        });
      } else {
        //TODO: handle notification for unsuccessful update
        console.log("TODO: handle notification for unsuccessful update");
      }
    } catch (err) {
      //TODO: handle notification for unsuccessful update
      console.log(err);
    }
  }

  function uploadAttachmentHandler(attachment) {
    updateAjaxCall({
      attachments: [...taskState.attachments, attachment],
    });
  }

  function deleteAttachmentHandler(id) {
    let newAttachments = taskState.attachments.filter((att) => att._id !== id);
    updateAjaxCall({
      attachments: newAttachments,
    });
  }

  async function updateAjaxCall(props, cb) {
    try {
      const res = await api.put(`/tasks/${taskState._id}`, props);
      if (res.data.success) {
        let updatedTask = res.data.data;
        updatedTask.comments.sort(function (a, b) {
          return new Date(b.createdAt) - new Date(a.createdAt);
        });
        setTaskState(updatedTask);
        listsActions.updateTaskInList({
          listId: updatedTask.listId._id,
          updatedTask: updatedTask,
        });
        if (cb) {
          cb();
        }
      } else {
        //TODO: handle notification for unsuccessful update
        console.log("1 could not update task");
      }
    } catch (err) {
      //TODO: handle notification for unsuccessful update
      console.log("2 could not update task");
    }
  }

  //TODO: Handle if task does not exist
  if (!taskState && !taskLoading) {
    return (
      <TaskModalStyled onClick={closeModal}>
        <div className="task-modal" onClick={(e) => e.stopPropagation()}>
          <h4>Task not found</h4>
        </div>
      </TaskModalStyled>
    );
  }

  if (taskLoading) {
    return (
      <TaskModalStyled onClick={closeModal}>
        <div
          className="task-modal"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <Spinner />
        </div>
      </TaskModalStyled>
    );
  }

  return (
    <TaskModalStyled onClick={closeModal}>
      <div className="task-modal" onClick={(e) => e.stopPropagation()}>
        <div className="close-btn" onClick={closeModal}>
          <span className="material-icons">close</span>
        </div>

        {taskState.coverPhoto !== "" && (
          <div className="cover-image">
            <img src={taskState.coverPhoto} />
          </div>
        )}

        <div className="main-container">
          <div className="main">
            <TaskTitle
              title={taskState.title}
              listTitle={taskState.listId.title}
              onTitleChange={onTitleChangeHandler}
            />
            <DescriptionBox
              description={taskState.description}
              onSave={descriptionChangeHandler}
            />

            <Attachments
              onUploadedAttachment={uploadAttachmentHandler}
              attachments={taskState.attachments}
              onDelete={deleteAttachmentHandler}
            />

            <Comments
              comments={taskState.comments}
              onAddComment={addCommentHandler}
              onUpdateComment={updateCommentHandler}
              addingNewComment={addingNewComment}
              updatingComment={updatingComment}
              onDelete={deleteCommentHandler}
            />
          </div>
          <aside>
            <div className="actions-header">
              <span className="material-icons">account_circle</span>
              Actions
            </div>
            <div
              style={{ display: "flex", flexDirection: "column", gap: "10px" }}
            >
              <UnsplashSearch
                btnStyle={{ width: "100%" }}
                selectPhoto={coverChangeHandler}
              />

              <LabelSelect
                btnStyle={{ width: "100%" }}
                labels={taskState.labels}
                onAddLabel={addLabelHandler}
                onRemoveLabel={removeLabelHandler}
              />

              <AssignMember
                members={taskState.members}
                addMember={addMemberHandler}
                removeMember={removeMemberHandler}
              />
            </div>
          </aside>
        </div>
      </div>
    </TaskModalStyled>
  );
}
