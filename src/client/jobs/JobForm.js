import React, { Component } from 'react';
import SectionHeader from '../components/SectionHeader';
import TextInput from '../components/form/TextInput';
import { mopedPUT, mopedPOST } from '../Utils';

export default class JobForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      customerId: props.customerId
    };
  }

  componentDidMount() {
    if (this.props.job) {
      this.setState({ ...this.state, ...this.props.job });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const body = {};
    const action = this.props.job ? '/editJob' : '/addJob';
    const mopedMethod = this.props.job ? mopedPUT : mopedPOST;
    const addJobFields = [
      'customerId',
      'idPerson',
      'description',
      'idJobs'
    ];
    addJobFields
      .map(field => body[field] = this.state[field]);

    this.setState({ isLoading: true });
    mopedMethod(action, body)
      .then(() => {
        this.setState({ isLoading: false });
        this.doneFunc();
      })
      .catch(error => {
        this.setState({ isLoading: false });
        alert('error ', error);
      });
  }

  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  cancelFunc() {
    this.props.history.push(`/jobs`)
  }

  doneFunc() {
    if (this.props.doneFunc) {
      this.props.doneFunc();
    } else {
      this.cancelFunc();
    }
  }

  render() {
    const { job, cancelFunc = () => this.cancelFunc() } = this.props;
    const { customerId, description, idPerson, isLoading } = this.state;
    const isSubForm = !!this.props.customerId;
    const sectionLevel = isSubForm ? '3' : '1';
    let className = isSubForm ? 'col-sm-12' : '';
    className += isLoading ? ' loading' : '';
    return (
      <div className={className}>
        {!job &&
          <SectionHeader
            sectionLevel={sectionLevel}
            title='Add Job'
            button={isSubForm ? { action: () => cancelFunc(), title: 'Close', type: 'close' } : undefined}
          />
        }
        <div className="row">
          <form className="col-md-11 mx-auto" onSubmit={event => this.handleSubmit(event)}>
            <div className="form-row">
              <TextInput label="Customer ID" name="customerId" className="col-md-6" value={customerId} onChange={event => this.handleChange(event)} readOnly={isSubForm ? true : undefined} />
              <TextInput label="Person ID" name="idPerson" className="col-md-6" value={idPerson} onChange={event => this.handleChange(event)} />
            </div>
            <div className="form-group">
              <TextInput label="Job Description" name="description" value={description} onChange={event => this.handleChange(event)} />
            </div>
            <div className="button-group">
              <button type="submit" className="btn btn-primary">{job ? 'Save' : 'Add'}</button>
              {cancelFunc &&
                <button type="button" className="btn btn-secondary" onClick={() => cancelFunc()}>Cancel</button>
              }
            </div>
          </form>
        </div>
      </div>
    );
  }

}
