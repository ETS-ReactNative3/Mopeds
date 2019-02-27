import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { API } from '../App';
import SectionHeader from '../components/SectionHeader';
import CustomerForm from './CustomerForm';
import MopedTable from '../components/MopedTable';

export default class CustomerDetail extends Component {
  customerId = this.props.match.params.customerId;
  jobsTableConfig = {
    tableHeader: true,
    text: {
      noResults: "No Jobs Found"
    },
    rowClick: (job) => this.jobClick(job),
    columns: [
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
      showEdit: false
    };
  }

  componentDidMount() {
    this.getCustomer();
    this.getCustomerJobs();
  }

  getCustomer() {
    this.setState({ isLoading: true });
    fetch(`${API}/customer?custId=${this.customerId}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => {
        const customerData = this.convertCustomerSql(data);
        this.setState({ data: customerData, isLoading: false });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  getCustomerJobs() {
    this.setState({ isLoading: true });
    fetch(`${API}/jobsByCustomer?custId=${this.customerId}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => {
        this.setState({ jobs: data, isLoading: false });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  convertCustomerSql(data) {
    return {
      custFirstName: data[0].nameFirst,
      custLastName: data[0].nameLast,
      custAddress: data[0].address,
      custCity: data[0].city,
      custState: data[0].state,
      custZip: data[0].zip,
      customerId: this.customerId
    }
  }

  editCustomerForm() {
    this.setState({ showEdit: !this.state.showEdit });
  }
  doneCustomerForm() {
    this.getCustomer();
    this.editCustomerForm();
  }

  jobClick(job) {
    this.props.history.push(`/jobs/${job.idJobs}`)
  }

  render() {
    const { data, isLoading, jobs, showEdit } = this.state;
    return (
      <div className={isLoading ? 'loading' : ''}>
        {data &&
          <SectionHeader
            title={`${data.custFirstName} ${data.custLastName}`}
            hasBack={true}
            button={{ action: () => this.editCustomerForm(), title: "Edit Customer" }}
          />
        }
        {data && !showEdit &&
          <div className="col-md-12 mx-auto">
            {data.custAddress} - {data.custCity} - {data.custState} - {data.custZip}
            {jobs &&
              <div className="row mt-5">
                <div className="col-md-12">
                  <SectionHeader title="Jobs" sectionLevel="2" />
                  <MopedTable data={jobs} config={this.jobsTableConfig} />
                </div>
              </div>
            }
          </div>
        }
        {data && showEdit &&
          <CustomerForm customer={data} cancelFunc={() => this.editCustomerForm()} doneFunc={() => this.doneCustomerForm()} />
        }
      </div>
    );
  }

}
