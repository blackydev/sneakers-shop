import React, { Component } from "react";
import Input from "./input";
import Radio from "./radio";
import ImgRadio from "./imgRadio";
import Joi from "joi-browser";

export default class Form extends Component {
  state = {
    data: {},
    errors: {},
  };

  validate = () => {
    const options = { abortEarly: false };
    const { error } = Joi.validate(this.state.data, this.schemas, options);
    if (!error) return null;

    const errors = {};
    for (let item of error.details) errors[item.path[0]] = item.message;
    return errors;
  };

  validateProperty = ({ name, value }) => {
    const { error } = Joi.validate(value, this.schemas[name]);
    const { errors } = this.state;

    errors[name] = error ? error.details[0].message : null;
    this.setState({ errors });
  };

  changeValue = (input) => {
    const data = { ...this.state.data };
    data[input.name] = input.value;
    this.setState({ data });
  };

  handleChange = (e) => {
    const { target: input } = e;
    this.changeValue(input);
    this.validateProperty(input);
  };

  handleSubmit = (e) => {
    const errors = this.validate();
    this.setState({ errors: errors || {} });
    if (errors) return;

    this.doSubmit();
  };

  renderButton({ label, size = "", color = "primary" }) {
    return (
      <button
        disabled={this.validate()}
        className={`btn btn-${size} btn-${color}`}
        onClick={this.handleSubmit}
      >
        {label}
      </button>
    );
  }

  renderRadio(name, options) {
    return <Radio name={name} options={options} onChange={this.handleChange} />;
  }

  renderImgRadio(name, options) {
    return (
      <ImgRadio name={name} options={options} onChange={this.handleChange} />
    );
  }

  renderInput(name, label, type = "text") {
    const { errors } = this.state;

    return (
      <Input
        type={type}
        name={name}
        label={label}
        onChange={this.handleChange}
        error={errors[name]}
        key={name}
      />
    );
  }
}
