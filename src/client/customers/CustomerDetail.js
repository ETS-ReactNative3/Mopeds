import React, { Component } from 'react';
import SectionHeader from '../components/SectionHeader';
import CustomerForm from './CustomerForm';
import JobForm from '../jobs/JobForm';
import MopedTable from '../components/MopedTable';
import { mopedGET } from '../Utils';

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
      showAddJob: false,
      showEdit: false
    };
  }

  componentDidMount() {
    this.getCustomer();
    this.getCustomerJobs();
  }

  getCustomer() {
    this.setState({ isLoading: true });
    mopedGET(`/customer?custId=${this.customerId}`)
      .then(data => {
        const customerData = this.convertCustomerSql(data);
        this.setState({ data: customerData, isLoading: false });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  getCustomerJobs() {
    this.setState({ isLoading: true });
    mopedGET(`/jobsByCustomer?custId=${this.customerId}`)
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

  addJobForm() {
    this.setState({ showAddJob: !this.state.showAddJob });
  }
  doneJobForm() {
    this.getCustomerJobs();
    this.addJobForm();
  }

  jobClick(job) {
    this.props.history.push(`/jobs/${job.idJobs}`)
  }

  render() {
    const { data, isLoading, jobs, showEdit, showAddJob } = this.state;
    return (
      <div className={isLoading ? 'loading' : ''}>
        {data &&
          <SectionHeader
            title={`${data.custFirstName} ${data.custLastName}`}
            button={{ action: () => this.editCustomerForm(), title: "Edit Customer" }}
          />
        }
        {data && !showEdit &&
          <div className="row">
            <div className="col-md-12 mx-auto">
              {data.custAddress} - {data.custCity} - {data.custState} - {data.custZip}
              {jobs &&
                <div className="row mt-4">
                  <div className="col-md-12">
                    <SectionHeader title="Jobs" sectionLevel="2" button={{ action: () => this.addJobForm(), title: "Add Job" }} />
                    {!showAddJob &&
                      <MopedTable data={jobs} config={this.jobsTableConfig} />
                    }
                    {showAddJob &&
                      <JobForm customerId={this.customerId} cancelFunc={() => this.addJobForm()} doneFunc={() => this.doneJobForm()} />
                    }
                  </div>
                </div>
              }
            </div>
          </div>
        }
        {data && showEdit &&
          <CustomerForm customer={data} cancelFunc={() => this.editCustomerForm()} doneFunc={() => this.doneCustomerForm()} />
        }
      </div>
    );
  }

}
