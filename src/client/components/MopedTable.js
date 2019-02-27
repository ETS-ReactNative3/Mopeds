import React, { Component } from 'react';
import TextInput from '../components/form/TextInput';
import Select from '../components/form/Select';
import { formatMoney } from '../Utils';

export default class MopedTable extends Component {

  constructor(props) {
    super(props);
    const stateData = { data: this.props.data };
    if (props.config.pageRows) {
      stateData.tableCount = props.config.pageRows;
      stateData.isPager = true;
    }
    this.state = stateData;
  }

  searchInput = event => {
    this.setState({ searchText: event.target.value });
    const { isPager } = this.state;
    const text = event.target.value.toString().toLowerCase();
    let resultData;
    let hasSearchResults;

    if (!text.length) {
      resultData = this.props.data;
      hasSearchResults = false;
    } else {
      // Search!
      resultData = this.filterTableData(text);
      hasSearchResults = true;
    }
    if (isPager) {
      this.setState({ currentPage: 1 });
    }
    this.setState({ data: resultData, hasSearchResults });
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
    const { config } = this.props;
    return (
      <tr>
        {config.columns.map(column => {
          return (<th key={column.key}>{column.title}</th>)
        })}
      </tr>
    );
  }

  MopedSearchHeader = () => {
    const { config } = this.props;
    const { searchText, hasSearchResults } = this.state;
    return (
      <div className="searchHeader col-sm-8 col-md-9">
        <TextInput className="mb-0" placeholder="Search" onChange={this.searchInput} value={searchText} name="searchText" />
        {hasSearchResults &&
          <button className="close" onClick={this.clearSearch}><span aria-hidden="true">&times;</span></button>
        }
      </div>
    );
  }

  MopedPagerHeader = () => {
    const { config } = this.props;
    const { data } = this.state;
    let { tableCount = 'All' } = this.state;
    const tableCountOptions = [1, 5, 10, 25, 'All'];
    tableCount = tableCountOptions.includes(tableCount) ? tableCount : 'All';
    const className = config.searchable ? 'col-sm-4 col-md-3' : 'col-sm-12';
    const handleChange = (event) => {
      const pageLimit = event.target.value === 'All' ? data.length : event.target.value - 0;
      const isPager = pageLimit < data.length;
      this.setState({ tableCount: pageLimit, currentPage: 1, isPager });
    }
    return (
      <div className={className}>
        <Select label="Show" name="tableCount" className="mb-0 pager-select justify-content-md-end" options={tableCountOptions} showEmptyOption={false} value={tableCount} inline onChange={(e) => handleChange(e)} />
      </div>
    );
  };

  MopedTablePager = () => {
    const { config } = this.props;
    const { data, currentPage, tableCount } = this.state;
    const pageCount = Math.ceil(data.length / tableCount);
    const pageIndexes = [...Array(pageCount).keys()];
    const changePage = (page, event) => {
      event.preventDefault();
      this.setState({ currentPage: page });
    }
    return (pageCount && pageCount > 1 &&
      <tfoot>
        <tr className="pagerNavRow"><td colSpan={config.columns.length}>
          <nav aria-label="Table pagination">
            <ul className="pagination justify-content-center">
              {currentPage !== 1 &&
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Previous" onClick={(e) => changePage(currentPage - 1, e)}>
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only">Previous</span>
                  </a>
                </li>
              }
              {pageIndexes.map((n, i) => {
                return (<li className="page-item" key={i}><a className="page-link" href="#" onClick={(e) => changePage(i + 1, e)}>{i + 1}</a></li>)
              })}
              {currentPage !== pageCount &&
                <li className="page-item">
                  <a className="page-link" href="#" aria-label="Next" onClick={(e) => changePage(currentPage + 1, e)}>
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only">Next</span>
                  </a>
                </li>
              }
            </ul>
          </nav>
        </td></tr>
      </tfoot>
    );
  }

  getPageData() {
    const { currentPage = 1, data, isPager, tableCount = data.length } = this.state;
    if (isPager) {
      const rowStart = (currentPage - 1) * tableCount;
      const rowLimit = isPager ? tableCount : data.length;
      return data.slice(rowStart, rowStart + rowLimit);
    }
    return data;
  }

  componentWillReceiveProps(newProps) {
    // Any time props.data changes, update state
    if (newProps.data !== this.props.data) {
      this.setState({ data: newProps.data });
    }
  }

  dataFormatter(data, format) {
    if (format === 'date') {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
      const date = data ? new Date(data) : data;
      return date ? date.toLocaleDateString('en-US', options) : data;
    }
    if (format === 'date-time') {
      const options = { year: 'numeric', month: '2-digit', day: '2-digit', timeZone: 'America/Denver', hour12: true };
      const date = data ? new Date(data) : data;
      return date ? date.toLocaleTimeString('en-US', options) : data;
    }
    if (format === 'amount') {
      return formatMoney(data);
    }
    return data;
  }

  render() {
    const { config } = this.props;
    const { hasSearchResults, isPager } = this.state;
    const displayData = this.getPageData();
    const hasResults = displayData && displayData.length > 0;

    return (
      <table className="table table-striped">
        {(hasResults || hasSearchResults) && (config.tableHeader || config.searchable || config.pager) &&
          <thead>
            {(config.searchable || config.pager) &&
              <tr>
                <td colSpan={config.columns.length}>
                  <div className="row">
                    {config.searchable &&
                      <this.MopedSearchHeader />
                    }
                    {config.pager &&
                      <this.MopedPagerHeader />
                    }
                  </div>
                </td>
              </tr>
            }
            {config.tableHeader &&
              <this.MopedTableHeader />
            }
          </thead>
        }
        <tbody>
          {hasResults && displayData.map((item, idx) => {
            return (
              <tr onClick={() => { return config.rowClick ? config.rowClick(item) : null; }} className={config.rowClick ? 'row-click' : ''} key={`row${idx}`}>
                {config.columns.map(column => {
                  return (<td key={column.key} className={column.format ? `${column.format}` : undefined}>{column.format ? this.dataFormatter(item[column.key], column.format) : item[column.key]}</td>)
                })}
              </tr>
            )
          })}
          {!hasResults &&
            <tr><td colSpan={config.columns.length}>{config.text && config.text.noResults ? config.text.noResults : 'No Data'}</td></tr>
          }
        </tbody>
        {hasResults && isPager &&
          <this.MopedTablePager />
        }
      </table>
    );
  }
}
