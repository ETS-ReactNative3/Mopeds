import React from 'react';

const Select = props => {
  const { label, name, className = '', options, value = '' } = props;
  // Note: onChange only exists below to shutup some warnings - still dependent on form onChange
  return (
    <div className={`form-group ${className}`}>
      <label htmlFor={`select${name}`}>{label}</label>
      <select id={`select${name}`} className="form-control" name={name} value={value} onChange={() => null}>
        <option>---</option>
        {options.map(option => {
          return (
            <option key={`opt${option}`}>{option}</option>
          )
        })}
      </select>
    </div>
  );
};

export default Select;