import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';

class SectionHeader extends Component {

  goBack(e) {
    e.preventDefault();
    this.props.history.goBack();
  }

  render() {
    const { title, hasBack = false, button, sectionLevel = '1' } = this.props;
    const HeaderLevel = `h${sectionLevel}`;
    return (
      <div className="section-header mb-2">
        <div className="row">
          <div className="col-sm-8 col-md-9">
            <HeaderLevel>
              {hasBack &&
                <a href="#" className="back mr-3" onClick={e => this.goBack(e)}>
                  <FontAwesomeIcon icon={faArrowAltCircleLeft} size="sm" />
                </a>
              }
              {title}
            </HeaderLevel>
          </div>
          {button &&
            <div className="header-button col-sm-4 col-md-3">
              <button className="btn btn-secondary col-sm" onClick={button.action}>{button.title}</button>
            </div>
          }
        </div>
      </div>
    );
  }

}

export default withRouter(SectionHeader);
