const fs = require("fs");
exports.deleteFile = async (path) => {
  if (await fs.existsSync(path)) await fs.unlinkSync(path);
};
