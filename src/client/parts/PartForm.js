import React, { Component } from 'react';
// import { withRouter } from "react-router-dom";
import { API } from '../App';
import SectionHeader from '../components/SectionHeader';
import TextInput from '../components/form/TextInput';

export default class PartForm extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.part) {
      this.setState({ ...this.state, ...this.props.part });
    }
  }

  handleSubmit(event) {
    const body = {
      jobId: this.props.jobId,
      personId: this.props.personId,
      action: 'add'
    };
    let action = 'addPartToJob';
    event.preventDefault();

    const addPartFields = [
      'vendor',
      'price',
      'quantity'
    ];
    addPartFields
      .map(field => body[field] = this.state[field]);

    if (this.props.part) {
      action = 'editPart';
      body.action = 'edit';
    }
    this.setState({ isLoading: true });
    fetch(`${API}/${action}`, {
      method: 'POST',
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

  // React form boiler-plate - seems silly, but needed to update entered values in the "state" of this Component
  handleChange(event) {
    this.setState({ [event.target.name]: event.target.value });
  }

  cancelFunc() {
    this.props.history.push(`/customers`)
  }

  doneFunc() {
    if (this.props.doneFunc) {
      this.props.doneFunc();
    } else {
      this.cancelFunc();
    }
  }

  render() {
    const { part, cancelFunc = () => this.cancelFunc() } = this.props;
    const { isLoading, vendor, price, quantity, status, orderNumber } = this.state;
    return (
      <div className={isLoading ? 'loading' : ''}>
        {!part &&
          <SectionHeader title='Add Part' sectionLevel='3' />
        }
        <div className="row">
          <form className="col-md-11 mx-auto" onSubmit={event => this.handleSubmit(event)} onChange={event => this.handleChange(event)}>
            <div className="form-row">
              <TextInput label="Vendor" name="vendor" className="col-md-6" value={vendor} />
              <TextInput label="Price" name="price" className="col-md-6" value={price} />
            </div>
            <div className="form-row">
              <TextInput label="Quantity" name="quantity" className="col-md-6" value={quantity} />
            </div>
            <div className="button-group">
              <button type="submit" className="btn btn-primary">{part ? 'Save' : 'Add'}</button>
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
