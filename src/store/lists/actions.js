import { api } from "../../utils/api";

export const updateTaskInList = ({ state }, payload) => {
  const { listId, updatedTask } = payload;

  state.lists.lists.map((list) => {
    if (list._id === listId) {
      let tasks = list.tasks.map((task) => {
        if (task._id === updatedTask._id) {
          task = updatedTask;
        }
        return task;
      });
      list.tasks = tasks;
    }

    return list;
  });
};

export const getLists = async ({ state }, payload) => {
  const { id } = payload;
  state.lists.listsLoading = true;
  try {
    const res = await api.get(`/lists/${id}`);

    if (res.data.success) {
      state.lists.lists = res.data.data;
    } else {
      console.log("Error getting lists");
    }
    state.lists.listsLoading = false;
  } catch (err) {
    console.log(err);
    state.lists.listsLoading = false;
  }
};

export const createNewList = async ({ state }, payload) => {
  try {
    const res = await api.post(`/lists`, payload);

    if (res.data.success) {
      state.lists.lists.push(res.data.data);
    } else {
      console.log("Error creating list");
    }
  } catch (err) {
    console.log(err);
  }
};

export const deleteList = async ({ state }, id) => {
  try {
    const res = await api.delete(`/lists/${id}`);

    if (res.data.success) {
      state.lists.lists = state.lists.lists.filter((l) => l._id !== id);
    } else {
      console.log("Error deleting list");
    }
  } catch (err) {
    console.log(err);
  }
};

export const updateListTitle = async ({ state }, payload) => {
  const { id, title } = payload;
  try {
    const res = await api.put(`/lists/${id}`, { title });

    if (res.data.success) {
      let listsCopy = [...state.lists.lists];
      listsCopy.map((l) => {
        if (l._id === id) {
         l.title = title;
        }
      });
      state.lists.lists = listsCopy;
    } else {
      console.log("Error deleting list");
    }
  } catch (err) {
    console.log(err);
  }
};

export const addTaskToList = async ({ state }, payload) => {
  state.lists.newTaskLoading = true;
  try {
    const res = await api.post(`/tasks`, payload);

    if (res.data.success) {
      let listsCopy = [...state.lists.lists];
      listsCopy.forEach((list) => {
        if (list._id === payload.listId) {
          console.log(2222, res.data.data);
          list.tasks.push(res.data.data);
        }
      });

      state.lists.lists = listsCopy;
    }
    state.lists.newTaskLoading = false;
  } catch (err) {
    state.lists.newTaskLoading = false;
    console.log(err);
  }
};

export const reorderTasks = async ({ state }, payload) => {
  const { destination, source, draggableId } = payload;
  console.log({ destination, source, draggableId });
  let listsCopy = [...state.lists.lists];
  // let removed;

  let movingTask = {
    ...state.lists.lists
      .filter((list) => list._id === source.droppableId)[0]
      .tasks.filter((task) => task._id === draggableId)[0],
  };

  //remove task from its list
  listsCopy.map((list) => {
    if (list._id === source.droppableId) {
      list.tasks = list.tasks.filter((task) => task._id !== draggableId);
    }
    return list;
  });

  //give new position numbers to tasks inside list where the task is removed
  listsCopy.map((list) => {
    if (list._id === source.droppableId) {
      list.tasks.map((task, index) => {
        task.position = index;
        return task;
      });
    }
    return list;
  });

  //add task to other list at position
  listsCopy.map((list) => {
    if (list._id === destination.droppableId) {
      movingTask.listId = destination.droppableId;
      list.tasks.splice(destination.index, 0, movingTask);
    }
    return list;
  });

  //give new position numbers to tasks inside list where the task is added
  listsCopy.map((list) => {
    if (list._id === destination.droppableId) {
      let tasksCopy = [...list.tasks];
      tasksCopy.map((task, index) => {
        task.position = index;
        return task;
      });
      list.tasks = tasksCopy;
    }
    return list;
  });

  //ajax here
  let newTasks = [];

  listsCopy.forEach((list) => {
    list.tasks.forEach((task) => {
      newTasks.push({
        _id: task._id,
        listId: task.listId,
        position: task.position,
      });
    });
  });

  let listsCopy2 = JSON.parse(JSON.stringify(listsCopy));
  let newLists = listsCopy2.map((list) => {
    let tempTasks = [];
    list.tasks.forEach((task) => {
      tempTasks.push(task._id);
    });
    list.tasks = tempTasks;
    return list;
  });

  try {
    const res = await api.put(`/tasks/reorder`, {
      tasks: newTasks,
      lists: newLists,
    });

    if (res.data.success) {
      state.lists.lists = listsCopy;
    } else {
      console.log("Error reordering tasks");
    }
  } catch (err) {
    console.log(err);
  }
  //if successful run code below
  state.lists.lists = listsCopy;
};
