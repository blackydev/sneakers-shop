const shoesSizes = ["", "7.5", "8", "8.5", "9", "9.5", "10", ""]; // EU shoes size

module.exports = [
  {
    shoes: {
      type: String,
      enum: [...shoesSizes],
      maxlength: 256,
    },
    number: {
      type: Number,
      required: true,
      min: 0,
    },
  },
];
