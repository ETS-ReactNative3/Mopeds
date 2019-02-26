import React, { Component } from 'react';
import { API } from '../App';
import SectionHeader from '../components/SectionHeader';
import TextInput from '../components/form/TextInput';
import TextArea from '../components/form/TextArea';

export default class ScanForm extends Component {

  constructor(props) {
    super(props);
    this.state = { ...this.props.scanResult };
  }

  handleSubmit(event) {
    if (this.props.scanStatus === 'scanIn') {
      this.doneFunc();
    } else {
      const body = {};
      event.preventDefault();

      const addJobDescriptionFields = [
        'jobId',
        'techId',
        'taskId',
        'comment'
      ];
      addJobDescriptionFields
        .map(field => body[field] = this.state[field]);

      this.setState({ isLoading: true });
      fetch(`${API}/scanOut`, {
        method: 'PUT',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body)
      })
        .then(response => {
          if (response.ok) {
            return response.json();
          } else {
            throw new Error('Something went wrong ...', response);
          }
        })
        .then(() => {
          this.setState({ isLoading: false });
          this.doneFunc();
        })
        .catch(error => {
          this.setState({ isLoading: false });
          alert('error ', error);
        });
    }
  }

  // React form boiler-plate - seems silly, but needed to update entered values in the "state" of this Component
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  doneFunc() {
    this.props.doneFunc();
  }

  render() {
    const { scanStatus, scanResult } = this.props;
    const { comment } = this.state;
    return (
      <div>
        <div className="row">
          <form className="col-md-11 mx-auto" onSubmit={event => this.handleSubmit(event)} onChange={event => this.handleChange(event)}>
            <div className="form-row">
              <TextInput label="Tech ID" name="techId" className="col-md-6" value={scanResult.techId} plainText />
              <TextInput label="Job ID" name="jobId" className="col-md-6" value={scanResult.jobId} plainText />
            </div>
            {scanStatus === 'scanOut' &&
              <div className="form-row">
                <TextArea label="Comments" name="comment" value={comment} className="col-md-12" />
              </div>
            }
            <button type="submit" className="btn btn-primary col-sm col-md-2">{scanStatus === 'scanOut' ? 'Save' : 'Ok'}</button>
          </form>
        </div>
      </div>
    );
  }

}
