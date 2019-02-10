import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { API } from './MomsBuickApp';
import SectionHeader from './components/SectionHeader';
import MopedTable from './components/MopedTable';

export default class Jobs extends Component {

  jobsTableConfig = {
    tableHeader: true,
    text: {
      noResults: "No Jobs Found"
    },
    // rowClick: (customer) => this.customerClick(customer),
    columns: [
      {
        key: 'idCustomers',
        title: 'Customer ID'
      },
      {
        key: 'idJobs',
        title: 'Job ID'
      },
      {
        key: 'idPerson',
        title: 'Person ID'
      },
      {
        key: 'description',
        title: 'Description'
      }
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [{ wow: 'test' }],
      showForm: false
    };
  }

  componentDidMount() {
    this.getJobs();
  }

  getJobs() {
    this.setState({ isLoading: true });
    fetch(`${API}/jobs`)
      .then(response => {
        console.log('fetched: ', response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => this.setState({ data, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
  }


  render() {
    const { data, isLoading, name, showForm } = this.state;
    console.log('render ', data, isLoading);
    return (
      <div className={isLoading ? 'loading' : ''}>
        <SectionHeader title="Jobs" />
        {data &&
          <MopedTable data={data} config={this.jobsTableConfig} />
        }
      </div>
    );
  }

}
