import React from 'react';

const TextArea = props => {
  const { label, name, className = '', onChange = undefined, placeholder = false, value = '', readOnly = false } = props;
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={`tainput${name}`}>{label}</label>
      <textarea className="form-control" id={`tainput${name}`} placeholder={placeholder ? placeholder : label} name={name} defaultValue={value} onChange={onChange} readOnly={readOnly} />
    </div>
  );
};

export default TextArea;