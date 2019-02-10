import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class MopedTable extends Component {

  MopedTableHeader = () => {
    const { config } = this.props;
    return (
      <thead>
        <tr>
          {config.columns.map(column => {
            return (<th key={column.key}>{column.title}</th>)
          })}
        </tr>
      </thead>
    );
  }

  render() {
    const { data, config } = this.props;
    return (
      <table className="table">
        {config.tableHeader && data && data.length > 0 && 
          <this.MopedTableHeader />
        }
        <tbody>
          {data && data.length > 0 && data.map((item, idx) => {
            return (
              <tr onClick={() => { return config.rowClick ? config.rowClick(item) : null; }} className={config.rowClick ? 'row-click' : ''} key={`row${idx}`}>
                {config.columns.map(column => {
                  return (<td key={column.key}>{item[column.key]}</td>)
                })}
              </tr>
            )
          })}
          {(!data || !data.length) && 
            <tr><td colSpan={config.columns.length}>{config.text.noResults ? config.text.noResults : 'No Data'}</td></tr>
          }
        </tbody>
      </table>
    );
  }

}
