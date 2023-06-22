export type BinaryString = string;
export type BinaryArray = boolean[];

export type Button = number[];
export type Buttons = { [letter: string]: Button };

export type StatusGraph = { [button: string]: BinaryString };
export type StatusesGraph = { [status: BinaryString]: StatusGraph };

export type Node = {
  status: BinaryString;
  buttons_pressed: string[];
  old_statuses: BinaryString[];
};

export function convertBinaryStringToArray(status: BinaryString): BinaryArray {
  return status.split("").map((s) => (s === "1" ? true : false));
}

export function convertBinaryArrayToString(status: BinaryArray): BinaryString {
  return status.map((b) => (b ? "1" : "0")).join("");
}

export function pressButton(
  status: BinaryString,
  button: Button
): BinaryString {
  const status_array = convertBinaryStringToArray(status);
  for (const index of button) {
    status_array[index] = !status_array[index];
  }
  const new_status = convertBinaryArrayToString(status_array);
  return new_status;
}

export function getAllLedsStatuses(n_leds: number) {
  const statuses: BinaryString[] = [];
  const possible_permutations = 2 ** n_leds;
  for (let i = 0; i < possible_permutations; i++) {
    statuses.push(i.toString(2).padStart(n_leds, "0"));
  }
  return statuses;
}

export function createStatusesGraph(
  statuses: BinaryString[],
  buttons: Buttons
) {
  const statuses_graph: StatusesGraph = {};
  for (const status of statuses) {
    const status_graph: StatusGraph = {};
    for (const button of Object.keys(buttons)) {
      status_graph[button] = pressButton(status, buttons[button]);
    }
    statuses_graph[status] = status_graph;
  }
  return statuses_graph;
}

export function searchPathsFromAllZeroToAllOne(
  n_leds: number,
  buttons: Buttons,
  statuses_graph: StatusesGraph,
  max_solution_length: number
) {
  const start_node = "0".repeat(n_leds);
  const end_node = "1".repeat(n_leds);

  const solutions: Node[] = [];
  const node_queue: Node[] = [
    { status: start_node, buttons_pressed: [], old_statuses: [start_node] },
  ];

  while (true) {
    if (solutions.length > 10000) break;
    if (!node_queue.length) break;
    const current_node = node_queue.shift()!;
    if (current_node.buttons_pressed.length > max_solution_length) break;

    for (const button of Object.keys(buttons)) {
      const next_status = statuses_graph[current_node.status][button];
      if (current_node.old_statuses.includes(next_status)) {
        // found cycle
        continue;
      }

      // const new_buttons_pressed = [...current_node.buttons_pressed, `${button} (${next_status})`];
      const new_buttons_pressed = [...current_node.buttons_pressed, button];
      const new_old_statuses = [...current_node.old_statuses, next_status];
      const new_node = {
        status: next_status,
        buttons_pressed: new_buttons_pressed,
        old_statuses: new_old_statuses,
      };

      if (next_status === end_node) {
        solutions.push(new_node);
      } else {
        node_queue.push(new_node);
      }
    }
  }

  return solutions;
}
