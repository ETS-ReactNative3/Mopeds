import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import SectionHeader from '../components/SectionHeader';
import ReportCalendar from './ReportCalendar';

export default class Reports extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCalendarClick(date) {
    this.props.history.push(`/reports/${date}`)
  }

  render() {
    const { isLoading } = this.state;
    return (
      <div className={isLoading ? 'loading' : ''}>
        <SectionHeader title="Reports" />
        <div className="row">
          <div className="button-group col-sm">
            <Link to="/reports/today" className="btn btn-secondary">Today</Link>
            <Link to="/reports/yesterday" className="btn btn-primary">Yesterday</Link>
          </div>
        </div>
        <SectionHeader title="Report Calendar" sectionLevel='2' className='mt-4' />
        <div className="row">
          <div className="col-sm m-2">
            <ReportCalendar onClick={(d) => this.handleCalendarClick(d)} />
          </div>
        </div>
      </div>
    );
  }

}
