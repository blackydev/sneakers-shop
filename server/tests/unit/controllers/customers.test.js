const _ = require("lodash");
const { Product } = require("../../../models/product");
const { createCustomer } = require("../../../controllers/orders/customers");

describe("carts", () => {
  describe("createCart", () => {
    let name, email, address, zip, city, phone;

    beforeEach(() => {
      name = "Jan Kowalski";
      email = "jankowalski@jakismail.xd";
      address = "Wiczesława 97";
      zip = "32-203";
      city = "Jaworzno";
      phone = "+48123456789";
    });

    exec = () => {
      const customer = {
        name: name,
        email: email,
        address: address,
        zip: zip,
        city: city,
        phone: phone,
      };
      return JSON.parse(JSON.stringify(customer));
    };

    it("should return customer if is valid", async () => {
      const jsonCart = exec();
      const result = await createCustomer(jsonCart);

      expect(result).toMatchObject({
        name: name,
        email: email,
        address: address,
        zip: zip,
        city: city,
        phone: phone,
      });
    });

    it("should return customer if is invalid", async () => {
      zip = "1";
      const jsonCart = exec();
      const result = await createCustomer(jsonCart);

      expect(_.isError(result)).toBeTruthy();
    });

    it("should return customer if is empty", async () => {
      zip = null;
      const jsonCart = exec();
      const result = await createCustomer(jsonCart);

      expect(_.isError(result)).toBeTruthy();
    });
  });
});
