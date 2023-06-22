"use client";

import { useEffect, useState } from "react";
import {
  BinaryString,
  Button,
  Buttons,
  Node,
  createStatusesGraph,
  getAllLedsStatuses,
  pressButton,
  searchPathsFromAllZeroToAllOne,
} from "../functions/graph_generator";

const initial_buttons: Buttons = {
  A: [0, 2],
  B: [1, 2],
  C: [1],
};

export default function Home() {
  const [n_leds, setNLeds] = useState(3);
  const [buttons, setButtons] = useState<Buttons>(initial_buttons);
  const [max_solution_length, setMaxSolutionLength] = useState(4);
  const [game_status, setGameStatus] = useState<BinaryString>("0".repeat(3));
  const [solutions, setSolutions] = useState<Node[]>();
  useEffect(() => {
    setSolutions(getSolutions());
  }, []);
  useEffect(() => {
    setGameStatus("0".repeat(n_leds));
  }, [n_leds]);

  function addNewButton(s: string) {
    const new_button: Button = s
      .replace(" ", "")
      .split(",")
      .map((a) => Number(a));

    for (const n of new_button) {
      if (isNaN(n) || n < 0 || n > n_leds) {
        alert("Wrong string, write like `0, 1, 2`");
        return;
      }
    }

    const new_button_letter = String.fromCharCode(
      65 + Object.keys(buttons).length
    );
    setButtons((prev_buttons) => {
      return { ...prev_buttons, [new_button_letter]: new_button };
    });
  }

  function removeButton(button: string) {
    setButtons((prev_buttons) => {
      const buttons_keys = Object.keys(prev_buttons);
      const new_buttons = { ...prev_buttons };

      for (const b of buttons_keys) {
        if (b.charCodeAt(0) < button.charCodeAt(0)) continue;
        if (b.charCodeAt(0) == button.charCodeAt(0)) continue;

        new_buttons[String.fromCharCode(b.charCodeAt(0) - 1)] = prev_buttons[b];
      }

      delete new_buttons[buttons_keys.at(-1)!];
      return new_buttons;
    });
  }

  function getButtonsElem() {
    const elem = [];

    for (const button of Object.keys(buttons)) {
      elem.push(
        <li key={button}>
          <button onClick={() => removeButton(button)}>remove</button>
          <button
            onClick={() => {
              setGameStatus((prev_game_status) =>
                pressButton(prev_game_status, buttons[button])
              );
            }}
          >
            press
          </button>
          {button}:{buttons[button].join(", ")}
        </li>
      );
    }

    return (
      <div>
        Buttons:
        <ul>{elem}</ul>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // @ts-ignore
            addNewButton(e.target.new_button.value);
          }}
        >
          Add Button with indexes separated by commas:
          <br />
          <input id="new_button" />
          <button type="submit">ADD</button>
        </form>
        <div>
          Game Status: {game_status}{" "}
          <button onClick={() => setGameStatus("0".repeat(n_leds))}>
            Reset
          </button>
          {game_status === "1".repeat(n_leds) && "YOU WIN"}{" "}
        </div>
      </div>
    );
  }

  function getSolutions() {
    const statuses = getAllLedsStatuses(n_leds);
    const statuses_graph = createStatusesGraph(statuses, buttons);

    const new_solutions = searchPathsFromAllZeroToAllOne(
      n_leds,
      buttons,
      statuses_graph,
      max_solution_length
    );

    console.table(new_solutions);
    return new_solutions;
  }

  function getSolutionsElem() {
    const elem = solutions?.map((s) => (
      <tr key={s.buttons_pressed.join(" -> ")}>
        <td>{s.buttons_pressed.join(" -> ")}</td>
        <td>{s.old_statuses.join(" -> ")}</td>
      </tr>
    ));

    return (
      <div>
        <button onClick={() => setSolutions(getSolutions())}>
          Get Solutions
        </button>
        <br />
        Solutions Found ({solutions?.length ?? "No Solutions Found"}):
        <table>
          <tr>
            <th>Button Sequence</th>
            <th>Status Sequence</th>
          </tr>
          {elem}
        </table>
      </div>
    );
  }

  return (
    <main>
      <label>
        N leds
        <input
          type="number"
          value={n_leds}
          onChange={(e) => setNLeds(Number(e.target.value))}
          min={1}
        />
      </label>
      {getButtonsElem()}
      <label>
        Max solution Length
        <input
          type="number"
          value={max_solution_length}
          onChange={(e) => setMaxSolutionLength(Number(e.target.value))}
          min={1}
        />
      </label>
      {getSolutionsElem()}
    </main>
  );
}
