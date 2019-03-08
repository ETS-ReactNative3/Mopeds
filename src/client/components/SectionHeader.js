import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

class SectionHeader extends Component {

  goBack(e) {
    e.preventDefault();
    this.props.backFunc ?
      this.props.backFunc(e) :
      this.props.history.goBack();
  }

  render() {
    const { title, hasBack = false, button, sectionLevel = '1', className = '' } = this.props;
    const HeaderLevel = `h${sectionLevel}`;
    const classString = `section-header mb-2 ${className}`;
    const headerClass = button ? button.type === 'close' ? 'col-sm-11' : 'col-sm-8 col-md-9' : 'col-sm-12';
    return (
      <div className={classString}>
        <div className="row">
          <div className={headerClass}>
            <HeaderLevel>
              {hasBack &&
                <button className="btn back" onClick={e => this.goBack(e)}>
                  <span className="icon"></span>
                </button>
              }
              {title}
            </HeaderLevel>
          </div>
          {button && button.type !== 'close' &&
            <div className="header-button col-sm-4 col-md-3">
              <button className="btn btn-secondary col-sm" onClick={button.action}>{button.title}</button>
            </div>
          }
          {button && button.type === 'close' &&
            <div className="header-button col-sm-1">
              <button type="button" className="close" aria-label="Close" onClick={button.action}>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
          }
        </div>
      </div>
    );
  }

}

export default withRouter(SectionHeader);
