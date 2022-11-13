const { expectCt } = require("helmet");
const { validate } = require("../../../models/customer");

describe("customer", () => {
  describe("validation", () => {
    let name, email, address, zip, city, phone;

    beforeEach(() => {
      name = "Anna Czarnecka";
      email = "annaCzarnecka1337@gmail.com";
      address = "wislana 67";
      zip = "32-532";
      city = "Jaworzno";
      phone = "48987654321";
    });

    const getCustomer = () => {
      return { name, email, address, zip, city, phone };
    };

    it("should't return error if customer is valid", () => {
      const { error } = validate(getCustomer());
      expect(error).toBeFalsy();
    });

    it("should return error if name is empty", () => {
      name = undefined;
      const { error } = validate(getCustomer());
      expect(error).toBeTruthy();
    });

    it("should return error if email is empty", () => {
      email = undefined;
      const { error } = validate(getCustomer());
      expect(error).toBeTruthy();
    });

    it("should return error if address is empty", () => {
      address = undefined;
      const { error } = validate(getCustomer());
      expect(error).toBeTruthy();
    });

    it("should return error if zip is empty", () => {
      zip = undefined;
      const { error } = validate(getCustomer());
      expect(error).toBeTruthy();
    });

    it("should return error if city is empty", () => {
      city = undefined;
      const { error } = validate(getCustomer());
      expect(error).toBeTruthy();
    });
    it("should return error if phone is empty", () => {
      phone = undefined;
      const { error } = validate(getCustomer());
      expect(error).toBeTruthy();
    });
  });
});
