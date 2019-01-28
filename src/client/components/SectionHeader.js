import React, { Component } from 'react';
import { Link } from "react-router-dom";

export default class SectionHeader extends Component {

  render() {
    const { title, hasBack = false, button } = this.props;
    return (
      <div className="container">
        <div className="row">
          <div className="col-sm">
            <h1>
              {hasBack &&
                <Link className="back" to="/">&lt; &lt;</Link>
              }
              {title}
            </h1>
          </div>
          {button &&
            <div className="col-sm text-right">
              <button className="btn btn-secondary" onClick={button.action}>{button.title}</button>
            </div>
          }
        </div>
      </div>
    );
  }

}
