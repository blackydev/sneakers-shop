const fs = require("fs");
const deleteFile = async (path) => {
    if (await fs.existsSync(path))
        await fs.unlinkSync(path);
}
exports.deleteFile = deleteFile;