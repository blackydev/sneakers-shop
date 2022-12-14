const { Product } = require("../../models/product");
const { createCategory, deleteCategories } = require("./categories");

const products = [
  {
    name: "Star Wars I",
    description:
      "Set 32 years before the original trilogy, during the era of the Galactic Republic, the plot follows Jedi Master Qui-Gon Jinn and his apprentice Obi-Wan Kenobi as they try to protect Queen Padmé Amidala of Naboo in hopes of securing a peaceful end to an interplanetary trade dispute.",
    price: 10.2,
    numberInStock: 255,
    release: new Date("2002-09-12").toISOString(),
  },
  {
    name: "Star Wars IV",
    description:
      "It is a period of civil war. Rebel spaceships, striking from a hidden base, have won their first victory against the evil Galactic Empire.",
    price: 15,
    numberInStock: 55,
    release: new Date("1979-07-19").toISOString(),
  },
  {
    name: "Star Wars VI",
    description:
      " Luke Skywalker and friends travel to Tatooine to rescue their companion Han Solo from the vile Jabba the Hutt.",
    price: 12,
    numberInStock: 103,
  },
];

mockImg = "xyz.jpg";

const createProducts = async (category) => {
  const result = [];
  if (!category) category = await createCategory();
  for (const el of products) {
    const product = new Product({
      ...el,
      image: mockImg,
      category: category._id,
    });
    await product.save();
    result.push(product);
  }

  return result;
};

const deleteProducts = async () => {
  await Product.deleteMany({});
  await deleteCategories({});
};

module.exports = {
  products,
  createProducts,
  deleteProducts,
};
