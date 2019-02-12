import React from 'react';

const TextInput = props => {
  const { label = false, name, className = '', placeholder, value = '', onChange = undefined, plainText = false, readOnly = false } = props;
  const inputClass = plainText ? 'form-control-plaintext font-weight-bold' : 'form-control';
  return (
    <div className={`form-group${className !== '' ? ` ${className}` : ''}`}>
      {label &&
        <label htmlFor={`tinput${name}`}>{label}</label>
      }
      <input type="text" className={inputClass} id={`tinput${name}`} placeholder={placeholder ? placeholder : undefined} name={name} value={value} readOnly={readOnly} onChange={onChange} />
    </div>
  );
};

export default TextInput;