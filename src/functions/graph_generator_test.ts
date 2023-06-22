import {
  Buttons,
  createStatusesGraph,
  getAllLedsStatuses,
  searchPathsFromAllZeroToAllOne,
} from "./graph_generator";

const n_leds = 6;
const buttons: Buttons = {
  A: [0, 2],
  B: [1, 2],
  C: [1],
  D: [3, 4],
  E: [3, 5],
  F: [4],
};
const max_solution_lenght = 8;

const statuses = getAllLedsStatuses(n_leds);
const statuses_graph = createStatusesGraph(statuses, buttons);

console.log("statuses:", statuses);
console.log("statuses graph:", statuses_graph);

const solutions = searchPathsFromAllZeroToAllOne(
  n_leds,
  buttons,
  statuses_graph,
  max_solution_lenght
);
console.table(solutions);
