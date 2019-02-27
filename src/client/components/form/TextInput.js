import React from 'react';

const TextInput = props => {
  const {
    className = '',
    label = false,
    name,
    placeholder = undefined,
    plainText = false,
    onChange = undefined,
    readOnly = false
  } = props;
  const inputClass = plainText ? 'form-control-plaintext font-weight-bold' : 'form-control';
  let { defaultValue = undefined, value = '' } = props;
  if (plainText) { // avoid warning where value exists but onchange doesn't
    defaultValue = value;
    value = undefined;
  }
  return (
    <div className={`form-group${className !== '' ? ` ${className}` : ''}`}>
      {label &&
        <label htmlFor={`tinput${name}`}>{label}</label>
      }
      <input
        type="text"
        className={inputClass}
        id={`tinput${name}`}
        placeholder={placeholder}
        name={name}
        value={value}
        defaultValue={defaultValue}
        readOnly={readOnly}
        onChange={onChange}
      />
    </div>
  );
};

export default TextInput;