import React, { Component } from 'react';
import TextInput from '../components/form/TextInput';
import Select from '../components/form/Select';

export default class MopedTable extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data
    };
  }

  searchInput = event => {
    this.setState({ searchText: event.target.value });
    const { isPager } = this.state;
    const text = event.target.value.toString().toLowerCase();
    let resultData;
    let showClearButton;

    if (!text.length) {
      resultData = this.props.data;
      showClearButton = false;
    } else {
      // Search!
      resultData = this.filterTableData(text);
      showClearButton = true;
    }
    if (isPager) {
      this.setState({ currentPage: 1 });
    }
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
    const { searchText, showClearButton } = this.state;
    return (
      <div className="searchHeader col-sm-8 col-md-9">
        <TextInput className="mb-0" placeholder="Search" onChange={this.searchInput} value={searchText} name="searchText" />
        {showClearButton &&
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
    const handleChange = (event) => {
      const pageLimit = event.target.value === 'All' ? data.length : event.target.value - 0;
      const isPager = pageLimit < data.length;
      this.setState({ tableCount: pageLimit, currentPage: 1, isPager });
    }
    return (
      <div className="col-sm-4 col-md-3">
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
    return (
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
    const { config } = this.props;
    const { currentPage = 1, data, isPager, tableCount = data.length } = this.state;
    if (isPager) {
      const rowStart = (currentPage - 1) * tableCount;
      const rowLimit = isPager ? tableCount : data.length;
      return data.slice(rowStart, rowStart + rowLimit);
    }
    return data;
  }

  render() {
    const { config } = this.props;
    const { isPager } = this.state;
    const displayData = this.getPageData();

    return (
      <table className="table table-striped">
        {(config.tableHeader || config.searchable || config.pager) &&
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
          {displayData && displayData.length > 0 && displayData.map((item, idx) => {
            return (
              <tr onClick={() => { return config.rowClick ? config.rowClick(item) : null; }} className={config.rowClick ? 'row-click' : ''} key={`row${idx}`}>
                {config.columns.map(column => {
                  return (<td key={column.key}>{item[column.key]}</td>)
                })}
              </tr>
            )
          })}
          {(!displayData || !displayData.length) &&
            <tr><td colSpan={config.columns.length}>{config.text && config.text.noResults ? config.text.noResults : 'No Data'}</td></tr>
          }
        </tbody>
        {config.pager && isPager &&
          <this.MopedTablePager />
        }
      </table>
    );
  }
}
