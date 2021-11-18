const user = localStorage.getItem("TeamWork-user");

export const state = {
  user: user ? JSON.parse(user) : null,
  userLoading: false,
  userError: null,
};
