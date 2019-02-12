import React from 'react';

const TextInput = props => {
  const { label = false, name, className = '', placeholder, value = '', onChange = undefined, plainText = false, readOnly = false } = props;
  return (
    <div className={`form-group ${className}`}>
      {label &&
        <label htmlFor={`tinput${name}`}>{label}</label>
      }
      {plainText &&
        <p className="form-control-plaintext font-weight-bold">
          {value}
          <input type="hidden" name={name} id={`tinput${name}`} value={value} />
        </p>
      }
      {!plainText &&
        <input type="text" className="form-control" id={`tinput${name}`} placeholder={placeholder ? placeholder : undefined} name={name} value={value} readOnly={readOnly} onChange={onChange} />
      }
    </div>
  );
};

export default TextInput;