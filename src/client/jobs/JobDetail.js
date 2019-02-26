import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { API } from '../App';
import SectionHeader from '../components/SectionHeader';
import CustomerForm from '../customers/CustomerForm';
import MopedTable from '../components/MopedTable';

export default class JobDetail extends Component {
  jobId = this.props.match.params.jobId;
  partsTableConfig = {
    tableHeader: true,
    text: {
      noResults: "No Parts Found"
    },
    pager: true,
    // rowClick: (part) => this.partClick(part),
    columns: [
      {
        key: 'idParts',
        title: 'Part ID'
      },
      {
        key: 'idPerson',
        title: 'Person ID'
      },
      {
        key: 'vendor',
        title: 'Vendor'
      },
      {
        key: 'price',
        title: 'Price'
      },
      {
        key: 'quantity',
        title: 'Quantity'
      },
      {
        key: 'status',
        title: 'Status'
      },
      {
        key: 'dateCreated',
        title: 'Date Created'
      },
      {
        key: 'dateUpdated',
        title: 'Date Updated'
      },
      {
        key: 'orderNumber',
        title: 'Order Number'
      }
    ]
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.renderJob();
  }

  renderJob() {
    this.getJob();
    this.getJobParts();
    // this.getJobComments();
  }

  getJob() {
    this.setState({ isLoading: true });
    fetch(`${API}/job?jobId=${this.jobId}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => {
        const jobData = this.convertJobSql(data);
        this.setState({ data: jobData, isLoading: false });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  getJobParts() {
    this.setState({ isLoading: true });
    fetch(`${API}/partsByJob?jobId=${this.jobId}`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => {
        this.setState({ parts: data, isLoading: false });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  convertJobSql(data) {
    return {
      customerId: data[0].idCustomers,
      description: data[0].description,
      personId: data[0].idPerson
    }
  }

  editJobForm() {
    this.setState({ showEdit: !this.state.showEdit });
  }
  doneJobForm() {
    this.renderJob();
  }

  render() {
    const { data, isLoading, parts, showEdit } = this.state;
    return (
      <div className={isLoading ? 'loading' : ''}>
        {data &&
          <SectionHeader
            title={`Job ${this.jobId}`}
            hasBack={true}
            button={{ action: () => this.editJobForm(), title: "Edit Job" }}
          />
        }
        {data && !showEdit &&
          <div className="col-md-12 mx-auto">
            {data.description}
            {parts &&
              <div className="row mt-5">
                <div className="col-md-12">
                  <SectionHeader title="Parts" sectionLevel="2" />
                  <MopedTable data={parts} config={this.partsTableConfig} />
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
