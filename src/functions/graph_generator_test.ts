import {
  Buttons,
  createStatusesGraph,
  getAllLedsStatuses,
  searchPathsFromAllZeroToAllOne,
} from "./graph_generator";

const n_leds = 3;
const buttons: Buttons = {
  A: [0, 2],
  B: [1, 2],
  C: [1],
};
const max_solution_length = 4;

const statuses = getAllLedsStatuses(n_leds);
const statuses_graph = createStatusesGraph(statuses, buttons);

console.log("statuses:", statuses);
console.log("statuses graph:", statuses_graph);

const solutions = searchPathsFromAllZeroToAllOne(
  n_leds,
  buttons,
  statuses_graph,
  max_solution_length
);
console.table(solutions);
