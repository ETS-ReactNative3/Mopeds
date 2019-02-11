import React, { Component } from 'react';

export default class TextInput extends Component {

  render() {
    const { label, name, className = '', placeholder = false, value = '', plainText = false, readOnly = false } = this.props;
    return (
      <div className={`form-group ${className}`}>
        <label htmlFor={`tinput${name}`}>{label}</label>
        {plainText &&
          <p className="form-control-plaintext font-weight-bold">
            {value}
            <input type="hidden" name={name} id={`tinput${name}`} value={value} />
          </p>
        }
        {!plainText &&
          <input type="text" className="form-control" id={`tinput${name}`} placeholder={placeholder ? placeholder : label} name={name} defaultValue={value} readOnly={readOnly} />
        }
      </div>
    );
  }

}

