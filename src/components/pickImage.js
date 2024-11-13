import characters from "../../characters.json" assert { type: "json" };

export const pickImage = (id) => {
  let image_path = "";
  let character = null;
  characters.forEach((char) => {
    if (char.id === id.toString()) {
      image_path = "img/" + char.img;
      character = char;
    }
  });

  return { image_path, character };
};

pickImage(1);
