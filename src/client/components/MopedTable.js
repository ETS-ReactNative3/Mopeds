import React, { Component } from 'react';
import TextInput from '../components/form/TextInput';

export default class MopedTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    };
  }

  searchInput = event => {
    this.setState({ searchText: event.target.value });
    const text = event.target.value.toString().toLowerCase();
    let resultData;
    let showClearButton;
    console.log('searchInput: ', text);

    if (!text.length) {
      resultData = this.props.data;
      showClearButton = false;
    } else {
      // Search!
      resultData = this.filterTableData(text);
      showClearButton = true;
    }
    console.log('set table data to: ', resultData);
    this.setState({ data: resultData, showClearButton });
  }

  filterTableData = text => {
    const initialData = this.props.data;
    const filteredData = initialData.filter(row => {
      const vals = Object.values(row);
      let lowerVals = vals.map(val => val && val.length && val.toLowerCase());
      lowerVals = lowerVals.join('|');
      return !(lowerVals.indexOf(text) === -1);
    });
    return filteredData;
  }

  clearSearch = () => {
    this.searchInput({ target: { value: '' } });
  }

  MopedTableHeader = () => {
    const { config, searchable } = this.props;
    const { searchText, showClearButton } = this.state;
    return (
      <thead>
        {searchable &&
          <tr className="searchRow"><td colSpan={config.columns.length}>
            <div>
              <TextInput className="mb-0 text-right" placeholder="Search" onChange={this.searchInput} value={searchText} name="searchText" />
              {showClearButton &&
                <button className="close" onClick={this.clearSearch}><span aria-hidden="true">&times;</span></button>
              }
            </div>
          </td></tr>
        }
        <tr>
          {config.columns.map(column => {
            return (<th key={column.key}>{column.title}</th>)
          })}
        </tr>
      </thead>
    );
  }

  render() {
    const { config } = this.props;
    const { data } = this.state;
    return (
      <table className="table table-striped">
        {config.tableHeader &&
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
            <tr><td colSpan={config.columns.length}>{config.text && config.text.noResults ? config.text.noResults : 'No Data'}</td></tr>
          }
        </tbody>
      </table>
    );
  }

}
