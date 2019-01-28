import React, { Component } from 'react';
import { HashRouter, Route, Link } from "react-router-dom";
import Customers from './Customers';

export default class MomsBuickRouter extends Component {

  getJobs({ match }) {
    return (
      <div>
        <h2>Jobs</h2>
        <Link to="/">Back</Link>
      </div>
    );
  }

  render() {
    return (
      <HashRouter>
        <main>
          <nav>
            <Link to="/customers">Customers</Link>
            <Link to="/jobs">jobs</Link>
          </nav>
          <section className="content">
            <Route path="/customers" component={Customers} />
            <Route path="/jobs" component={this.getJobs} />
          </section>
        </main>
      </HashRouter>
    );
  }

}