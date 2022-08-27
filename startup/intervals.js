const auth = require("../controllers/delivery/auth");


function setDaysTimeout(callback, days) {
    let msInDay = 86400 * 1000;

    let dayCount = 0;
    let timer = setInterval(function () {
        dayCount++;

        if (dayCount === days) {
            clearInterval(timer);
            callback.apply(this, []);
        }
    }, msInDay);
}

module.exports = async function async() {
    await auth.init();
    setDaysTimeout(async function () {
        await auth.update();
    }, 29);
};

