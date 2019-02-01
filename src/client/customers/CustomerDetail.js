import React, { Component } from 'react';
import { withRouter } from "react-router-dom";
import { API } from '../MomsBuickApp';
import SectionHeader from '../components/SectionHeader';
import CustomerForm from './CustomerForm';

export default class CustomerDetail extends Component {
  customerId = this.props.match.params.customerId;

  constructor(props) {
    super(props);
    this.state = {
      showEdit: false
    };
  }

  componentDidMount() {
    this.getCustomer();
  }

  getCustomer() {
    this.setState({ isLoading: true });
    fetch(`${API}/customer?custId=${this.customerId}`)
      .then(response => {
        console.log('fetched: ', response);
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

  render() {
    const { data, isLoading, showEdit } = this.state;
    console.log('render ', data, isLoading);
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
          </div>
        }
        {data && showEdit &&
          <CustomerForm customer={data} cancelFunc={() => this.editCustomerForm()} doneFunc={() => this.doneCustomerForm()} />
        }
      </div>
    );
  }

}
