import characters from "../../characters.json" assert { type: "json" };
import { draw } from "./drawCanvas.js";

export const handleTexts = (text) => {
  let dataBuffer = [];
  if (text === undefined || (text.at(-1) !== "。" && text.at(-1) !== "."))
    return null;
  text = text.slice(0, -1);
  characters.forEach((character) => {
    dataBuffer[character.id] = draw(character.id, text);
  });
  return dataBuffer;
};
