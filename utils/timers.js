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

function setDaysInterval(callback, days) {
  let msInDay = 86400 * 1000;

  let dayCount = 0;
  setInterval(function () {
    dayCount++;

    if (dayCount === days) {
      dayCount = 0;
      callback.apply(this, []);
    }
  }, msInDay);
}

module.exports = { setDaysTimeout, setDaysInterval };
