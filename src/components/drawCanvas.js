import { createCanvas, loadImage, registerFont } from "canvas";
import path from "path";

import { pickImage } from "./pickImage.js";

// const fontPath = (fontName) =>
//   path.join(path.dirname(import.meta.url), "../", "fonts/", fontName);

registerFont("./src/fonts/YurukaStd.ttf", { family: "YurukaStd" });
registerFont("./src/fonts/ShangShouFangTangTi.ttf", { family: "SSFangTangTi" });

export const draw = async (id, text) => {
  const { image_path, character } = pickImage(id);
  if (!image_path || !character) {
    console.log(image_path, character);
    return;
  }

  const img = await loadImage(image_path);
  let rotate = character.defaultText.r;
  let position = {
    x: character.defaultText.x,
    y: character.defaultText.y,
  };
  let spaceSize = 1;
  let fontSize = character.defaultText.s;

  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext("2d");

  ctx.canvas.width = 296;
  ctx.canvas.height = 256;

  var hRatio = ctx.canvas.width / img.width;
  var vRatio = ctx.canvas.height / img.height;
  var ratio = Math.min(hRatio, vRatio);
  var centerShift_x = (ctx.canvas.width - img.width * ratio) / 2;
  var centerShift_y = (ctx.canvas.height - img.height * ratio) / 2;
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

  ctx.drawImage(
    img,
    0,
    0,
    img.width,
    img.height,
    centerShift_x,
    centerShift_y,
    img.width * ratio,
    img.height * ratio
  );

  ctx.font = `${fontSize}px "YurukaStd", "SSFangTangTi"`;
  ctx.lineWidth = 9;
  ctx.save();

  ctx.translate(position.x, position.y);
  ctx.rotate(rotate / 10);
  ctx.textAlign = "center";
  ctx.strokeStyle = "white";
  ctx.fillStyle = character.color;
  var lines = text.split("\n");

  for (var i = 0, k = 0; i < lines.length; i++) {
    ctx.strokeText(lines[i], 0, k);
    ctx.fillText(lines[i], 0, k);
    k += spaceSize;
  }
  ctx.restore();

  return canvas.toBuffer();
};
