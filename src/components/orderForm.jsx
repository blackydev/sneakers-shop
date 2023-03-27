import React from "react";
import Joi from "joi-browser";
import _ from "lodash";
import Form from "./common/form";
import orderService from "../services/orderService";
import cartService from "../services/cartService";
import deliveryService from "../services/deliveryService";
export default class OrderForm extends Form {
  state = {
    data: {},
    errors: {},
    deliveries: [],
  };

  inputs = [
    {
      name: "name",
      label: "Name *",
      colSize: "6",
    },
    {
      name: "email",
      label: "Email *",
      type: "email",
      colSize: "6",
    },
    {
      name: "address",
      label: "Address *",
      colSize: "8",
    },
    {
      name: "zip",
      label: "ZIP *",
      colSize: "4",
    },
    {
      name: "city",
      label: "City *",
      colSize: "6",
    },
    {
      name: "phone",
      label: "Phone *",
      colSize: "6",
    },
    {
      name: "company",
      label: "Company",
      colSize: "12",
    },
  ];

  async componentDidMount() {
    const { data: deliveries } = await deliveryService.getDeliveries();
    deliveries.map((e) => (e.name += ` - ${e.price} zł`));

    this.setState({ deliveries });
  }

  async doSubmit() {
    const { deliveryId } = this.state.data;
    const customer = _.pick(this.state.data, [
      "name",
      "email",
      "address",
      "zip",
      "city",
      "phone",
      "company",
    ]);
    try {
      const { data: order } = await orderService.postOrder(
        customer,
        deliveryId,
      );
      cartService.removeCartId();
      const { data: p24Link } = await orderService.pay(order._id);
      window.location.assign(
        "https://sandbox.przelewy24.pl" + "/trnRequest/" + p24Link,
      );
    } catch (ex) {
      console.log(ex);
    }
  }

  schemas = {
    name: Joi.string().min(3).max(256).required().label("Name"),
    email: Joi.string().email().min(5).max(255).required().label("Email"),
    address: Joi.string().min(5).max(255).required().label("Address"),
    zip: Joi.string().min(3).max(12).required().label("ZIP"),
    city: Joi.string().min(1).max(28).required().label("City"),
    phone: Joi.string().required().min(5).max(16).label("Phone"),
    company: Joi.string().allow("").max(255).label("company"),
    deliveryId: Joi.string().required(),
  };

  render() {
    const { deliveries, data } = this.state;
    const { productsPrice } = this.props;
    const currDelivery = deliveries.find(({ _id }) => data.deliveryId === _id);
    if (currDelivery) var price = currDelivery.price;
    else price = 0;

    return (
      <>
        <h3 className="fw-bold">Customer</h3>
        <div className="row">
          {this.inputs.map((input) => {
            return (
              <div
                className={`col-${input.colSize} my-2 text-dark`}
                key={input.name}>
                {this.renderInput(input.name, input.label, input.type)}
              </div>
            );
          })}
        </div>
        <div className="my-4">
          <h3 className="fw-bold">Delivery</h3>
          <div className="mt-3">
            {this.renderRadio("deliveryId", deliveries)}
          </div>
        </div>
        <div className="d-flex justify-content-center my-3">
          {this.renderButton({
            label: `${Math.round((productsPrice + price) * 100) / 100} zł`,
            size: "lg",
            color: "dark",
          })}
        </div>
      </>
    );
  }
}
