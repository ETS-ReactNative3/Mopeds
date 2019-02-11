import React, { Component } from 'react';
import { HashRouter, Link } from "react-router-dom";
import { API } from '../App';
import SectionHeader from '../components/SectionHeader';
import MopedTable from '../components/MopedTable';

export default class Customers extends Component {

  customerTableConfig = {
    tableHeader: true,
    rowClick: (customer) => this.customerClick(customer),
    columns: [
      {
        key: 'idCustomers',
        title: 'Customer ID'
      },
      {
        key: 'nameFirst',
        title: 'First Name'
      },
      {
        key: 'nameLast',
        title: 'Last Name'
      },
      {
        key: 'address',
        title: 'Address'
      },
      {
        key: 'city',
        title: 'City'
      },
      {
        key: 'state',
        title: 'State'
      },
      {
        key: 'zip',
        title: 'Zip Code'
      }
    ]
  };

  constructor(props) {
    super(props);
    this.state = {
      data: [{ wow: 'test' }],
      showForm: false
    };
  }

  componentDidMount() {
    this.getCustomers();
  }

  getCustomers() {
    this.setState({ isLoading: true });
    fetch(`${API}/customers`)
      .then(response => {
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => this.setState({ data, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
  }

  addCustomerForm() {
    this.props.history.push(`/customers/add`)
  }

  customerClick(customer) {
    this.props.history.push(`/customers/${customer.idCustomers}`)
  }

  render() {
    const { data, isLoading, showForm } = this.state;
    return (
      <div className={isLoading ? 'loading' : ''}>
        <SectionHeader title="Customers" button={{ action: () => this.addCustomerForm(), title: "Add Customer" }} />
        {data &&
          <MopedTable data={data} config={this.customerTableConfig} />
        }
      </div>
    );
  }

}
