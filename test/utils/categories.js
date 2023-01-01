const { Category } = require("../../models/category");

const createCategory = async (name) => {
  if (!name) name = "movies";
  const category = new Category({ name });
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
