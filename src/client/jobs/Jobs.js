import React, { Component } from 'react';
import { API } from '../App';
import SectionHeader from '../components/SectionHeader';
import MopedTable from '../components/MopedTable';

export default class Jobs extends Component {

  jobsTableConfig = {
    tableHeader: true,
    text: {
      noResults: "No Jobs Found"
    },
    pager: true,
    searchable: true,
    rowClick: (job) => this.jobClick(job),
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
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => this.setState({ data, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
  }

  jobClick(job) {
    this.props.history.push(`/jobs/${job.idJobs}`)
  }

  render() {
    const { data, isLoading, name, showForm } = this.state;
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
