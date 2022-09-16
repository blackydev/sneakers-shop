import React from "react";
import { Link } from "react-router-dom";
import Joi from "joi-browser";
import Form from "./common/form";
import userService from "../services/userService";

export default class RegisterForm extends Form {
  state = {
    data: {},
    errors: {},
    serverError: null,
  };

  inputs = [
    {
      name: "email",
      label: "Email",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
    },
  ];

  async doSubmit() {
    const { data } = this.state;
    try {
      await userService.register(data);
      window.location.href = "/";
    } catch (ex) {
      if (ex.response && ex.response.status === 400) {
        const serverError = ex.response.data;
        this.setState({ serverError });
      }
    }
  }

  schemas = {
    email: Joi.string().min(5).max(255).required().label("Email"),
    password: Joi.string().min(10).max(64).required().label("Password"),
  };

  render() {
    const { serverError } = this.state;
    return (
      <div
        className="text-dark bg-light rounded-4 p-4"
        style={{ width: "22rem" }}
      >
        <h2 className="pb-3 px-3 text-center fs-3 position-relative">
          Register Your Account
          <Link to="/">
            <button
              className="d-inline btn-close position-absolute fs-6"
              style={{ top: "0px", right: "0px" }}
              aria-label="close"
            />
          </Link>
        </h2>

        <div>
          {this.inputs.map((input) => {
            return (
              <div className={`my-2 text-dark`} key={input.name}>
                {this.renderInput(input.name, input.label, input.type)}
              </div>
            );
          })}
        </div>
        {serverError && (
          <div className="alert alert-danger" role="alert">
            {serverError}
          </div>
        )}
        <Link to="/login" className="link-dark fw-light">
          Login to existing account
        </Link>
        <div className="d-flex justify-content-center mt-4 fs-bolder">
          {this.renderButton({
            label: `Register`,
            color: "dark",
            size: "lg",
          })}
        </div>
      </div>
    );
  }
}
