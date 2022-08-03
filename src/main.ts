// import "./style.css";
import "./index.css";
import { App } from "@odoo/owl";
import { Root } from "./Root";

const app = new App(Root, { dev: true });
app.mount(document.getElementById("app")!, {});

const addSpaces = (input: string, spacesToAdd: number) => {
  for (let i = 0; i < spacesToAdd; i++) {
    input += " ";
  }
  return input;
};

const recursiveAddSpaces = (input: string, spacesToAdd: number): string => {
  if (spacesToAdd === 0) {
    return input;
  }
  return recursiveAddSpaces(input + " ", spacesToAdd - 1);
};

console.log(addSpaces("Hello", 2));
console.log(recursiveAddSpaces("Hello", 2));
