let navigator;

export const setNavigator = (navFn) => {
  navigator = navFn;
};

export const navigate = (path) => {
  if (navigator) navigator(path);
};
