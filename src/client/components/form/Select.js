import React from 'react';

const Select = props => {
  const { className = '', inline = false, label, name, onChange = undefined, options, showEmptyOption = true, value = '' } = props;
  return (
    <div className={`form-group ${className} ${inline ? 'form-inline' : ''}`}>
      <label htmlFor={`select${name}`}>{label}</label>
      <select id={`select${name}`} className="form-control" name={name} value={value} onChange={onChange}>
        {showEmptyOption &&
          <option>---</option>
        }
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