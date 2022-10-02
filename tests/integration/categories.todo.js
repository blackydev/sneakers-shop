const request = require("supertest");
const { Category } = require("../../models/category");
const mongoose = require("mongoose");

const createCategory = async () => {
  const category = new Category({ name: "movies" });
  await category.save();
  return category;
};

const deleteCategories = async () => {
  await Category.deleteMany({});
};

module.exports = {
  createCategory,
  deleteCategories,
};
