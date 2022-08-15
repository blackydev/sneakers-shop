const _ = require("lodash");
const { Product } = require("../../../models/product");
const { createCustomerFromJSON } = require("../../../controllers/customers");

describe("carts", () => {
  describe("createCartFromJSON", () => {
    let name, lastname, email, street, zip, city, phone;

    beforeEach(() => {
      name = "Jan";
      lastname = "Kowalski";
      email = "jankowalski@jakismail.xd";
      street = "Wiczesława 97";
      zip = "32-203";
      city = "Jaworzno";
      phone = "+48123456789";
    });

    exec = () => {
      const customer = {
        name: name,
        lastname: lastname,
        email: email,
        street: street,
        zip: zip,
        city: city,
        phone: phone,
      };
      return JSON.parse(JSON.stringify(customer));
    };

    it("should return customer if is valid", async () => {
      const jsonCart = exec();
      const result = await createCustomerFromJSON(jsonCart);

      expect(result).toMatchObject({
        name: name,
        lastname: lastname,
        email: email,
        street: street,
        zip: zip,
        city: city,
        phone: phone,
      });
    });

    it("should return customer if is invalid", async () => {
      zip = "1";
      const jsonCart = exec();
      const result = await createCustomerFromJSON(jsonCart);

      expect(_.isError(result)).toBeTruthy();
    });

    it("should return customer if is empty", async () => {
      zip = null;
      const jsonCart = exec();
      const result = await createCustomerFromJSON(jsonCart);

      expect(_.isError(result)).toBeTruthy();
    });
  });
});
