import React, { Component } from 'react';
import { Link } from "react-router-dom";
import { API } from './MomsBuickApp';
import SectionHeader from './components/SectionHeader';

// form: custLastName, custFirstName, custAddress, custCity, custState, custZip

const addCustomerFields = [
  {
    key: 'custFirstName',
    title: 'Customer First Name'
  },
  {
    key: 'custLastName',
    title: 'Customer Last Name'
  },
  {
    key: 'custAddress',
    title: 'Customer Address'
  },
  {
    key: 'custCity',
    title: 'Customer City'
  },
  {
    key: 'custState',
    title: 'Customer State'
  },
  {
    key: 'custZip',
    title: 'Customer Zip'
  },
];

export default class Customers extends Component {

  constructor(props) {
    console.log('initi');
    super(props);
    this.state = {
      data: [{ wow: 'test' }],
      showForm: false
    };
  }

  componentDidMount() {
    console.log('componentDidMount');
    this.getCustomers();
  }

  getCustomers() {
    this.setState({ isLoading: true });
    fetch(`${API}/customers`)
      .then(response => {
        console.log('fetched: ', response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(data => this.setState({ data, isLoading: false }))
      .catch(error => this.setState({ error, isLoading: false }));
  }

  toggleAddForm() {
    this.setState({ showForm: !this.state.showForm })
  }

  handleSubmit(event) {
    const body = {};
    event.preventDefault();
    this.setState({ isLoading: true });
    addCustomerFields
      .map(field => body[field.key] = this.state[field.key]);

    console.log('submitting:');
    console.dir(body);
    fetch(`${API}/addCustomer`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(body)
    })
      .then(response => {
        console.log('post response: ', response);
        if (response.ok) {
          return response.json();
        } else {
          throw new Error('Something went wrong ...');
        }
      })
      .then(() => {
        this.setState({ isLoading: false });
        alert('saved');
        this.getCustomers();
      })
      .catch(error => {
        this.setState({ isLoading: false });
        alert('error ', error);
      });
  }

  handleChange(event) {
    this.setState({ [`${event.target.name}`]: event.target.value });
  }

  render() {
    const { data, isLoading, name, showForm } = this.state;
    console.log('render ', data, isLoading);
    return (
      <div className={isLoading ? 'loading' : ''}>
        <SectionHeader title="Customers" button={{ action: () => this.toggleAddForm(), title: "Add Customer" }} />

        {showForm &&
          <form onSubmit={event => this.handleSubmit(event)}>
            {addCustomerFields.map(field => (
              <label>
                {field.title}:
                <input type="text" name={field.key} value={this.state[field.key]} onChange={(event) => this.handleChange(event)} />
              </label>
            ))}
            <input type="submit" value="Submit" />
          </form>
        }

        {data &&
          <table className="table">
            <tbody>
              {data.map(function (item, key) {
                return (
                  <tr key={key}>
                    <td>{item.idCustomers}</td>
                    <td>{item.nameFirst}</td>
                    <td>{item.nameLast}</td>
                    <td>{item.address}</td>
                    <td>{item.city}</td>
                    <td>{item.state}</td>
                    <td>{item.zip}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        }
      </div>
    );
  }

}
