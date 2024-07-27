const formatAndListTasks = ["prettier --write", "eslint --fix"];

export default {
  "*.{css,html,js,jsx,svelte,ts,tsx}": [...formatAndListTasks],
  "*.{json,md}": formatAndListTasks,
};
