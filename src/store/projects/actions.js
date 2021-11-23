import { api } from "../../utils/api";

export const addMemberToProject = async ({ state }, payload) => {
  const { newMember, cb } = payload;

  let checkIfMember = state.projects.activeProject.members.filter(
    (m) => m._id === newMember._id
  );

  if (checkIfMember.length > 0) {
    cb(1); //callback with error: user already member
    return;
  }
  const oldMembers = state.projects.activeProject.members.map((m) => m._id);
  const updatedProject = {
    // name: state.projects.activeProject.name,
    // createdBy: state.projects.activeProject.createdBy._id,
    members: [...oldMembers, newMember._id],
  };

  try {
    const res = await api.put(
      `/projects/${state.projects.activeProject._id}`,
      updatedProject
    );
    if (res.data.success) {
      state.projects.activeProject.members.push(newMember);
      cb(); //callback with no error
    }
  } catch (err) {
    console.log(err);
    cb(2); //callback with error: thrown error
  }
};

export const resetActiveProject = ({ state }) => {
  state.projects.activeProject = null;
  state.projects.projectLoading = false;
  state.projects.projectError = null;
  state.lists.lists = [];
};

export const getActiveProject = async ({ state }, id) => {
  state.projects.projectLoading = true;
  try {
    const projectRes = await api.get(`/projects/${id}`);
    if (projectRes.data.success) {
      state.projects.projectLoading = false;
      state.projects.projectError = null;
      state.projects.activeProject = projectRes.data.data;
    } else {
      state.projects.projectError = projectRes.data.error;
    }
  } catch (err) {
    state.projects.projectLoading = false;
    state.projects.projectError = "Can't fetch data right now";
  }
};

export const getProjects = async ({ state }) => {
  state.projects.projectsLoading = true;
  try {
    const projectsRes = await api.get(`/projects`);
    if (projectsRes.data.success) {
      state.projects.projectsLoading = false;
      state.projects.projectsError = null;
      state.projects.projects = projectsRes.data.data;
    } else {
      state.projects.projectsError = projectsRes.data.error;
    }
  } catch (err) {
    state.projects.projectsLoading = false;
    state.projects.projectsError = "Can't fetch data right now";
  }
};

export const addProject = async ({ state, actions }, payload) => {
  const { form, cb } = payload;
  state.projects.projectsLoading = true;
  try {
    const projectsRes = await api.post(`/projects`, form);
    if (projectsRes.data.success) {
      state.projects.projectsLoading = false;
      state.projects.projectsError = null;
      actions.projects.getProjects();
      cb();
    } else {
      state.projects.projectsError = projectsRes.data.error;
    }
  } catch (err) {
    state.projects.projectsLoading = false;
    state.projects.projectsError = "Can't fetch data right now";
  }
};

export const updateProject = async ({ state, actions }, payload) => {
  const { updatedProps, cb } = payload;

  try {
    const res = await api.put(
      `/projects/${state.projects.activeProject._id}`,
      updatedProps
    );
    if (res.data.success) {
      let tempProject = {
        ...state.projects.activeProject,
        ...updatedProps,
      };
      state.projects.activeProject = tempProject;

      cb(); //callback with no error
    }
  } catch (err) {
    console.log(err);

    cb(2); //callback with error: thrown error
  }
};
