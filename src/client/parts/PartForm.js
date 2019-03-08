import React, { Component } from 'react';
import SectionHeader from '../components/SectionHeader';
import TextInput from '../components/form/TextInput';
import { mopedPOST, mopedPUT } from '../Utils';

export default class PartForm extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    if (this.props.part) {
      this.setState({ ...this.state, ...this.props.part, part: this.props.part });
    }
  }

  componentWillReceiveProps(newProps) {
    if (newProps.part !== this.props.part) {
      const basicPart = { vendor: undefined, price: undefined, quantity: undefined }
      Object.assign(basicPart, newProps.part);
      this.setState({ part: newProps.part, ...basicPart });
    }
  }

  handleSubmit(event) {
    event.preventDefault();
    const body = {
      jobId: this.props.jobId,
      personId: this.props.idPerson
    };
    const action = this.props.part ? '/editPart' : '/addPartToJob';
    const mopedMethod = this.props.part ? mopedPUT : mopedPOST;
    const addPartFields = [
      'vendor',
      'price',
      'quantity'
    ];
    if (this.state.part) {
      body.idParts = this.state.part.idParts
    }
    addPartFields
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

  deleteFunc() {
    alert('delete!?');
  }

  doneFunc() {
    if (this.props.doneFunc) {
      this.props.doneFunc();
    } else {
      this.cancelFunc();
    }
  }

  render() {
    const { cancelFunc = () => this.cancelFunc() } = this.props;
    const { isLoading, part, vendor, price, quantity } = this.state;
    return (
      <div className={isLoading ? 'loading col-sm-12' : 'col-sm-12'}>
        <SectionHeader title={part ? 'Edit Part' : 'Add Part'} sectionLevel='3' button={{ action: () => cancelFunc(), title: 'Close', type: 'close' }} />
        <div className="row">
          <form className="col-md-11 mx-auto" onSubmit={event => this.handleSubmit(event)}>
            <div className="form-row">
              <TextInput label="Vendor" name="vendor" className="col-md-6" value={vendor} onChange={event => this.handleChange(event)} />
              <TextInput label="Price" name="price" className="col-md-6" value={price} onChange={event => this.handleChange(event)} />
            </div>
            <div className="form-row">
              <TextInput label="Quantity" name="quantity" className="col-md-6" value={quantity} onChange={event => this.handleChange(event)} />
            </div>
            <div className="button-group">
              <button type="submit" className="btn btn-primary">{part ? 'Save' : 'Add'}</button>
              {cancelFunc &&
                <button type="button" className="btn btn-secondary" onClick={() => cancelFunc()}>Cancel</button>
              }
              {part &&
                <button type="button" className="btn btn-danger btn-right" onClick={() => this.deleteFunc()}>Delete Part</button>
              }
            </div>
          </form>
        </div>
      </div>
    );
  }

}
