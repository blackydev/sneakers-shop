const status = {
  data: [
    {
      code: -10,
      name: "returned",
    },
    {
      code: -1,
      name: "interrupted",
    },
    {
      code: 1,
      name: "pending",
    },
    {
      code: 10,
      name: "paid",
    },
    {
      code: 20,
      name: "accepted",
    },
    {
      code: 30,
      name: "shipped",
    },
  ],

  getByNumber(number) {
    const status = this.data.find(({ code }) => code === parseInt(number));
    return status ? status : null;
  },

  getByName(name_) {
    const status = this.data.find(({ name }) => name === name_);
    return status ? status : null;
  },

  doesExist(number) {
    if (this.getByNumber(number)) return true;
    return false;
  },
};

module.exports = status;
