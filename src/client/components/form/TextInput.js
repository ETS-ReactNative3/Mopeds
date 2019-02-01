import React, { Component } from 'react';

export default class TextInput extends Component {

  render() {
    const { label, name, className = '', placeholder = false, value = '' } = this.props;
    return (
      <div className={`form-group ${className}`}>
        <label htmlFor={`tinput${name}`}>{label}</label>
        <input type="text" className="form-control" id={`tinput${name}`} placeholder={placeholder ? placeholder : label} name={name} defaultValue={value} />
      </div>
    );
  }

}

