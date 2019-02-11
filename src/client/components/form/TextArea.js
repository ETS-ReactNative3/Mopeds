import React, { Component } from 'react';

export default class TextArea extends Component {

  render() {
    const { label, name, className = '', placeholder = false, value = '', readOnly = false } = this.props;
    return (
      <div className={`form-group ${className}`}>
        <label htmlFor={`tainput${name}`}>{label}</label>
        <textarea className="form-control" id={`tainput${name}`} placeholder={placeholder ? placeholder : label} name={name} defaultValue={value} readOnly={readOnly} />
      </div>
    );
  }

}

