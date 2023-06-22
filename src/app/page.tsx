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
import styles from "./page.module.css";

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
    setGameStatus("0".repeat(n_leds));
  }, [n_leds]);

  function addNewButton(s: string) {
    const new_button: Button = s
      .replace(" ", "")
      .split(",")
      .map((a) => Number(a));

    for (const n of new_button) {
      if (isNaN(n)) {
        alert("Wrong string, write like `0, 1, 2`");
        return;
      }
      if (n < 0 || n >= n_leds) {
        alert(
          "Number of buttons must be between 0 and the number of leds minus 1"
        );
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
        <tr key={button}>
          <td>
            {button} : {buttons[button].join(", ")}
          </td>
          <td>
            <button onClick={() => removeButton(button)}>remove</button>
          </td>
          <td>
            <button
              onClick={() => {
                setGameStatus((prev_game_status) =>
                  pressButton(prev_game_status, buttons[button])
                );
              }}
            >
              press
            </button>
          </td>
        </tr>
      );
    }

    return (
      <div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            // @ts-ignore
            addNewButton(e.target.new_button.value);
          }}
        >
          Add Button with indexes separated by commas: <br />
          <input id="new_button" />
          <button type="submit">ADD</button>
        </form>
        Buttons:
        <table>
          <tbody>{elem}</tbody>
        </table>
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

  async function getSolutions() {
    const statuses = getAllLedsStatuses(n_leds);
    const statuses_graph = createStatusesGraph(statuses, buttons);
    console.log(statuses_graph)

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
        <button
          onClick={() =>
            getSolutions().then((new_solutions) => setSolutions(new_solutions))
          }
        >
          Get Solutions
        </button>
        Solutions Found ({solutions?.length ?? "No Solutions Found"}):
        <table>
          <thead>
            <tr>
              <th>Button Sequence</th>
              <th>Status Sequence</th>
            </tr>
          </thead>
          <tbody>{elem}</tbody>
        </table>
      </div>
    );
  }

  return (
    <main className={styles.main}>
      <label className={styles.label}>
        N leds
        <input
          type="number"
          value={n_leds}
          onChange={(e) => setNLeds(Number(e.target.value))}
          min={1}
        />
      </label>
      {getButtonsElem()}
      <label className={styles.label}>
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
