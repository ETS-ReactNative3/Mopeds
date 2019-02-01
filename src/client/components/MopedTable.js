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
        {config.tableHeader &&
          <this.MopedTableHeader />
        }
        <tbody>
          {data.map(item => {
            return (
              <tr onClick={() => { return config.rowClick ? config.rowClick(item) : null; }} className={config.rowClick ? 'row-click' : ''} key={`item${item.idCustomers}`}>
                {config.columns.map(column => {
                  return (<td key={column.key}>{item[column.key]}</td>)
                })}
              </tr>
            )
          })}
        </tbody>
      </table>
    );
  }

}
