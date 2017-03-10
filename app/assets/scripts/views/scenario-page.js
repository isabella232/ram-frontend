'use strict';
import React, { PropTypes as T } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';

import Breadcrumb from '../components/breadcrumb';
import ScenarioHeaderActions from '../components/scenario/scenario-header-actions';


var ScenarioPage = React.createClass({
  propTypes: {
    params: T.object
  },

  render: function () {
    return (
      <section className='inpage inpage--hub'>
        <header className='inpage__header'>
          <div className='inner'>
            <div className='inpage__headline'>
              <Breadcrumb />
              <h1 className='inpage__title'>Scenario name</h1>
            </div>
            <ScenarioHeaderActions />
          </div>
        </header>
        <div className='inpage__body'>
          <div className='inner'>

            Scenario data

          </div>
        </div>

      </section>
    );
  }
});

// /////////////////////////////////////////////////////////////////// //
// Connect functions

function selector (state) {
  return {
  };
}

function dispatcher (dispatch) {
  return {
  };
}

module.exports = connect(selector, dispatcher)(ScenarioPage);
