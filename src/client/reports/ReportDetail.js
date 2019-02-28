import React, { Component } from 'react';
import SectionHeader from '../components/SectionHeader';
import { mopedGET, TIME_ZONE } from '../Utils';

export default class ReportDetail extends Component {
  today = new Date();
  yesterday = new Date((new Date()).setDate(this.today.getDate() - 1));

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const reportDate = this.parseReportDate(this.props.match.params.reportDate);
    mopedGET(`/reportByDate?date=${reportDate}`);
  }

  parseReportDate(date) {
    let resultDate;
    if (date === 'today' || date === 'yesterday') {
      const dateObj = date === 'today' ? this.today : this.yesterday;
      resultDate = dateObj.toLocaleString(undefined, { timeZone: TIME_ZONE, year: 'numeric', month: '2-digit', day: '2-digit' });
      this.setState({ displayDate: resultDate });
      const dateArray = resultDate.split('/');
      return `${dateArray[2]}${dateArray[0]}${dateArray[1]}`;
    } else {
      const dateArray = date.split(/-|\./);
      this.setState({ displayDate: `${dateArray[1]}/${dateArray[2]}/${dateArray[0]}` });
      return date.replace(/-|\./g, '');
    }
  }

  render() {
    const { displayDate, isLoading } = this.state;
    return (
      <div className={isLoading ? 'loading' : ''}>
        <SectionHeader title={`Report ${displayDate}`} />
        <div className="row">
          <div className="button-group col-sm">

          </div>
        </div>
      </div>
    );
  }

}
