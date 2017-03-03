'use strict';
import React, { PropTypes as T } from 'react';
import { connect } from 'react-redux';
import _ from 'lodash';
import c from 'classnames';

import Header from '../components/header';
import Footer from '../components/footer';
import LoadingGlobal from '../components/loading-global';

var App = React.createClass({
  displayName: 'App',

  propTypes: {
    routes: T.array,
    children: T.object
  },

  render: function () {
    const pageClass = _.get(_.last(this.props.routes), 'pageClass', '');

    return (
      <div className={c('page', pageClass)}>
        <Header />
        <main className='page__body' role='main'>
          {this.props.children}
        </main>
        <Footer />
        <LoadingGlobal />
      </div>
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

module.exports = connect(selector, dispatcher)(App);
