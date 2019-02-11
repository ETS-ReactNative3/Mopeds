import React, { Component } from 'react';
import { HashRouter, Route, Link } from "react-router-dom";
import 'bootstrap';
import $ from 'jquery';
import './main.scss';
import Customers from './customers/Customers';
import CustomerForm from './customers/CustomerForm';
import CustomerDetail from './customers/CustomerDetail';
import Jobs from './Jobs';
import Scan from './scan/Scan';

export const API = '/api';

export default class App extends Component {

  componentDidMount() {
    // hide collapsible menu on link click
    $('.navbar a').on('click', function () {
      $('.navbar-collapse').collapse('hide');
    });
  }

  render() {
    return (
      <HashRouter>
        <main className="d-flex flex-column h-100">
          <div className="flex-shrink-0">
            <header>
              <nav className="navbar navbar-expand-md navbar-dark fixed-top bg-dark">
                <Link to="/" className="navbar-brand">Mopeds</Link>
                <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarCollapse" aria-controls="navbarCollapse" aria-expanded="false" aria-label="Toggle navigation">
                  <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarCollapse">
                  <ul className="navbar-nav mr-auto">
                    <li className="nav-item">
                      <Link to="/customers" className="nav-link">Customers</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/jobs" className="nav-link">Jobs</Link>
                    </li>
                    <li className="nav-item">
                      <Link to="/scan" className="nav-link">Scan</Link>
                    </li>
                  </ul>
                </div>
              </nav>
            </header>

            <div id="content" className="container mb-1">
              <Route exact path="/customers/:customerId(\d+)" component={CustomerDetail} />
              <Route exact path="/customers/add" component={CustomerForm} />
              <Route exact path="/customers" component={Customers} />
              <Route path="/jobs" component={Jobs} />
              <Route path="/scan" component={Scan} />
            </div>
          </div>
          <footer className="footer mt-auto py-1 bg-dark">
            <div className="container text-right">
              <button className="btn btn-sm btn-link" onClick={() => location.href = "/public/index.htm"}>Original Test Page</button>
            </div>
          </footer>
        </main>
      </HashRouter>
    );
  }

}

