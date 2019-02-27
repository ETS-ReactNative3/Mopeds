import React, { Component } from 'react';
import SectionHeader from '../components/SectionHeader';
import PartForm from '../parts/PartForm';
import MopedTable from '../components/MopedTable';
import { mopedGET } from '../Utils';

export default class JobDetail extends Component {
  jobId = this.props.match.params.jobId;
  partsTableConfig = {
    tableHeader: true,
    text: {
      noResults: "No Parts Found"
    },
    pageRows: 5,
    rowClick: (part) => this.partClick(part),
    columns: [
      { key: 'idParts', title: 'Part ID' },
      { key: 'idPerson', title: 'Person ID' },
      { key: 'vendor', title: 'Vendor' },
      { key: 'price', title: 'Price', format: 'amount' },
      { key: 'quantity', title: 'Quantity', format: 'count' },
      { key: 'status', title: 'Status' },
      { key: 'dateCreated', title: 'Date Created', format: 'date-time' },
      { key: 'dateUpdated', title: 'Date Updated', format: 'date-time' },
      { key: 'orderNumber', title: 'Order Number' }
    ]
  };
  tasksTableConfig = {
    tableHeader: true,
    text: {
      noResults: "No Tasks Found"
    },
    pageRows: 5,
    // rowClick: (part) => this.partClick(part),
    columns: [
      { key: 'idTasks', title: 'Task ID' },
      { key: 'idPerson', title: 'Person ID' },
      { key: 'startDate', title: 'Start Date', format: 'date-time' },
      { key: 'endDate', title: 'End Date', format: 'date-time' },
      { key: 'comments', title: 'Comments' }
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
    this.getJobTasks();
  }

  getJob() {
    this.setState({ isLoading: true });
    mopedGET(`/job?jobId=${this.jobId}`)
      .then(data => {
        const jobData = this.convertJobSql(data);
        this.setState({ data: jobData, isLoading: false });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  getJobParts() {
    this.setState({ isLoading: true });
    mopedGET(`/partsByJob?jobId=${this.jobId}`)
      .then(data => {
        this.setState({ parts: data, isLoading: false });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  getJobTasks() {
    this.setState({ isLoading: true });
    mopedGET(`/tasksByJob?jobId=${this.jobId}`)
      .then(data => {
        this.setState({ tasks: data, isLoading: false });
      })
      .catch(error => this.setState({ error, isLoading: false }));
  }

  partClick(part) {
    this.setState({ part });
    this.showPartForm();
  }

  convertJobSql(data) {
    return {
      customerId: data[0].idCustomers,
      description: data[0].description,
      personId: data[0].idPerson
    }
  }

  addPartForm() {
    if (this.state.part) {
      this.showPartForm();
      this.setState({ part: undefined });
    }
    setTimeout(() => this.showPartForm(), 1);
  }
  showPartForm() {
    this.setState({ showPartForm: !this.state.showPartForm });
  }
  doneJobForm() {
    this.showPartForm();
    this.getJobParts();
  }

  render() {
    const { data, isLoading, parts, part = undefined, showEdit, showPartForm, tasks } = this.state;
    return (
      <div className={isLoading ? 'loading' : ''}>
        {data &&
          <SectionHeader
            title={`Job ${this.jobId}`}
            hasBack={true}
          />
        }
        {data && !showEdit &&
          <div className="col-md-12 mx-auto">
            {data.description}
            {parts &&
              <div className="row mt-4">
                <div className="col-md-12">
                  <SectionHeader title="Parts" sectionLevel="2" button={{ action: () => this.addPartForm(), title: "Add Part" }} />
                  {!showPartForm &&
                    <MopedTable data={parts} config={this.partsTableConfig} />
                  }
                  {showPartForm &&
                    <PartForm jobId={this.jobId} part={part} personId='1' cancelFunc={() => this.showPartForm()} doneFunc={() => this.doneJobForm()} />
                  }
                </div>
              </div>
            }
            {tasks && !showPartForm &&
              <div className="row mt-3">
                <div className="col-md-12">
                  <SectionHeader title="Tasks" sectionLevel="2" />
                  <MopedTable data={tasks} config={this.tasksTableConfig} />
                </div>
              </div>
            }
          </div>
        }
      </div>
    );
  }

}
