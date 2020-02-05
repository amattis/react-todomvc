import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import Header from "./Header";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders with or without an addTodo function", () => {
  act(() => {
    render( <Header /> , container);
  });
  expect(container.querySelector("h1").textContent).toBe("todos");

  const onAddTodo = jest.fn();
  act(() => {
    render( <Header onAddTodo={onAddTodo} /> , container);
  });
  const input = document.querySelector(".new-todo");
  expect(input.value).toBe("");
});
