import React, { Component } from 'react';
import SectionHeader from '../components/SectionHeader';
import TextInput from '../components/form/TextInput';
import Select from '../components/form/Select';
import { US_STATES, mopedPUT, mopedPOST } from '../Utils';

export default class CustomerForm extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.customer) {
      this.setState({ ...this.state, ...this.props.customer });
    }
  }

  handleSubmit(event) {
    event.preventDefault();

    const body = {};
    const action = this.props.customer ? '/editCustomer' : '/addCustomer';
    const mopedMethod = this.props.customer ? mopedPUT : mopedPOST;
    const addCustomerFields = [
      'custFirstName',
      'custLastName',
      'custAddress',
      'custCity',
      'custState',
      'custZip',
      'customerId'
    ];
    addCustomerFields
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
    const { customer, cancelFunc = () => this.cancelFunc() } = this.props;
    const { isLoading, custFirstName, custLastName, custAddress, custCity, custState, custZip } = this.state;
    return (
      <div className={isLoading ? 'loading' : ''}>
        {!customer &&
          <SectionHeader title='Add Customer' hasBack={true} />
        }
        <div className="row">
          <form className="col-md-11 mx-auto" onSubmit={event => this.handleSubmit(event)}>
            <div className="form-row">
              <TextInput label="First Name" name="custFirstName" className="col-md-6" value={custFirstName} onChange={event => this.handleChange(event)} />
              <TextInput label="Last Name" name="custLastName" className="col-md-6" value={custLastName} onChange={event => this.handleChange(event)} />
            </div>
            <div className="form-group">
              <TextInput label="Address" name="custAddress" placeholder="123 Main St" value={custAddress} onChange={event => this.handleChange(event)} />
            </div>
            <div className="form-row">
              <TextInput label="City" name="custCity" className="col-md-6" value={custCity} onChange={event => this.handleChange(event)} />
              <Select label="State" name="custState" className="col-md-4" options={US_STATES} value={custState} onChange={event => this.handleChange(event)} />
              <TextInput label="ZIP" name="custZip" className="col-md-2" placeholder="01234" value={custZip} onChange={event => this.handleChange(event)} />
            </div>
            <div className="button-group">
              <button type="submit" className="btn btn-primary">{customer ? 'Save' : 'Add'}</button>
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
