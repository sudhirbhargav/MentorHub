let navigate;

export const setNavigator = (navFn) => {
  navigate = navFn;
};

export const navigateTo = (path) => {
  if (navigate) navigate(path);
};
