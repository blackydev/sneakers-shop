exports.generateFilename = async (fileExt, wordGenerator) => {
    if (!wordGenerator) {
        const number = await getUniqueNumber();
        return number + fileExt;
    }

    let filename = wordGenerator;
    if (filename.length > 240)
        filename = filename.substring(0, 240);
    filename = filename.trim().replace(/ /g, '-');

    const number = await getUniqueNumber();
    return filename + "-" + number + fileExt;

}

const getUniqueNumber = async () => {
    const number = await new Date().getTime() - 1659709986000;
    return number.toString(36);
}