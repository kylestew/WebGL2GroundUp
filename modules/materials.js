/*
http://devernay.free.fr/cours/opengl/materials.html
*/

const emerald = {
  ambient: [0.0215, 0.1745, 0.0215],
  diffuse: [0.07568, 0.61424, 0.07568],
  specular: [0.633, 0.727811, 0.633],
  shininess: 0.6,
};

const obsidian = {
  ambient: [0.05375, 0.05, 0.06625],
  diffuse: [0.18275, 0.17, 0.22525],
  specular: [0.332741, 0.328643, 0.346435],
  shininess: 0.3,
};

const materials = {
  emerald,
  obsidian,
};
export default materials;
