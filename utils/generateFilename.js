const path = require("path");
const generateFilename = (filename) => {
  const fileExt = path.extname(filename);
  let basename = path.basename(filename, fileExt);

  basename = basename.trim().replace(/ /g, "-");
  if (basename.length > 240) basename = basename.substring(0, 240);

  const number = getUniqueNumber();
  return basename + "-" + number + fileExt;
};

const getUniqueNumber = () => {
  const number = new Date().getTime() - 1659709986000;
  return number.toString(36);
};

module.exports = generateFilename;
