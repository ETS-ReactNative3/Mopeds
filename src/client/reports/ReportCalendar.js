import React, { Component } from 'react';
import { pad2digits } from '../Utils';

export default class ReportCalendar extends Component {
  today = new Date();
  todayDate = new Date(this.today.getFullYear(), this.today.getMonth());
  days = [...Array(7).keys()];
  weeks = [...Array(6).keys()];

  constructor(props) {
    super(props);
    this.state = {
      year: this.today.getFullYear(),
      month: this.today.getMonth()
    };
  }

  handleClick(event) {
    const { month, year } = this.state;
    const dateString = `${year}-${pad2digits(month + 1)}-${pad2digits(event.target.id)}`;
    this.props.onClick(dateString);
  }

  changeMonth(delta) {
    const { month, year } = this.state;
    const currentDate = new Date(year, month);
    currentDate.setMonth(currentDate.getMonth() + delta);
    this.setState({
      year: currentDate.getFullYear(),
      month: currentDate.getMonth()
    });
  }

  render() {
    const { month, year } = this.state;
    const currentDate = new Date(year, month);
    const firstDay = currentDate.getDay();
    const isCurrentMonth = currentDate.getTime() === this.todayDate.getTime();
    const isFutureMonth = currentDate.getTime() > this.todayDate.getTime();
    const daysInMonth = (32 - new Date(year, month, 32).getDate());
    const monthTitle = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    let dayNumber = 0;
    return (
      <div className="report-calendar col-md">
        <div className="row report-calendar-header">
          <div className="mx-auto mb-1 controls">
            <button className="btn btn-sm btn-light" onClick={() => this.changeMonth(-1)}>&lt;</button>
            <div className="title mx-2 text-center">{monthTitle}</div>
            <button className="btn btn-sm btn-light" onClick={() => this.changeMonth(1)}>&gt;</button>
          </div>
        </div>
        {this.weeks.map((n, week) => {
          return (
            <div key={week} className="row">
              {this.days.map((n, day) => {
                if ((week === 0 && day < firstDay) || dayNumber >= daysInMonth) {
                  return (
                    <div key={day} className='col-sm d-none d-sm-block report-day'></div>
                  )
                } else {
                  dayNumber++;
                  const hasData = !(isCurrentMonth && dayNumber > this.today.getDate()) && !isFutureMonth;
                  const isActive = hasData ? ' active' : '';
                  return (
                    <div
                      id={dayNumber}
                      key={day}
                      className={`col-sm report-day${isActive}`}
                      onClick={hasData ? event => this.handleClick(event) : undefined}
                    >{dayNumber}</div>
                  )
                }
              })}
            </div>
          )
        })}
      </div>
    );
  }

}
