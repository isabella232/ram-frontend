'use strict';
import React, { PropTypes as T } from 'react';
import c from 'classnames';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import _ from 'lodash';
import { hashHistory } from 'react-router';

import { t, getLanguage } from '../../utils/i18n';

import { Modal, ModalHeader, ModalBody, ModalFooter } from '../modal';

const ScenarioCreateModal = React.createClass({
  propTypes: {
    revealed: T.bool,
    onCloseClick: T.func,

    scenarioForm: T.object,
    scenarioList: T.array,

    saveScenario: T.func,
    resetForm: T.func,
    _showGlobalLoading: T.func,
    _hideGlobalLoading: T.func
  },

  getInitialState: function () {
    return {
      errors: {
        name: null,
        roadNetworkSource: null
      },
      data: {
        name: '',
        description: '',
        roadNetworkSource: 'clone',
        roadNetworkSourceScenario: this.props.scenarioList[0].id,
        roadNetworkSourceFile: {
          file: null,
          size: 0,
          uploaded: 0
        }
      }
    };
  },

  xhr: null,

  componentWillReceiveProps: function (nextProps) {
    // console.log('nextProps.scenarioForm', nextProps.scenarioForm);
    // if (this.props.scenarioForm.processing && !nextProps.scenarioForm.processing) {
    //   this.props._hideGlobalLoading();
    // }

    // if (this.props.scenarioForm.action === 'edit' &&
    //     this.props.scenarioForm.processing &&
    //     !nextProps.scenarioForm.processing &&
    //     !nextProps.scenarioForm.error) {
    //   if (this.props.finishingSetup) {
    //     hashHistory.push(`${getLanguage()}/projects/${nextProps.scenarioData.project_id}`);
    //   } else {
    //     this.onClose();
    //   }
    //   return;
    // }
  },

  componentWillUnmount: function () {
    this.props.resetForm();
    if (this.xhr) {
      this.xhr.abort();
    }
  },

  onClose: function () {
    this.props.resetForm();
    this.setState(this.getInitialState());
    this.props.onCloseClick();
  },

  onFileSelected: function (event) {
    // Store file reference
    const file = event.target.files[0];
    let roadNetworkSourceFile = {
      file,
      size: file.size,
      uploaded: 0
    };

    let data = Object.assign({}, this.state.data, {roadNetworkSourceFile});
    this.setState({data});
  },

  checkErrors: function () {
    let control = true;
    let errors = this.getInitialState().errors;

    if (this.state.data.name === '') {
      errors.name = true;
      control = false;
    }

    if (this.state.data.roadNetworkSource === 'new' && !this.state.data.roadNetworkSourceFile.file) {
      errors.roadNetworkSource = true;
      control = false;
    }

    this.setState({errors});
    return control;
  },

  onSubmit: function (e) {
    e.preventDefault && e.preventDefault();

    if (this.checkErrors()) {
      var payload = {
        name: this.state.data.name,
        description: this.state.data.description || null
      };
      // On create we only want to send properties that were filled in.
      payload = _.pickBy(payload, v => v !== null);

      if (this.state.data.roadNetworkSource === 'clone') {
        payload = {
          roadNetworkSourceScenario: this.state.data.roadNetworkSourceScenario
        };

        // Submit

      } else if (this.state.data.roadNetworkSource === 'new') {
        // Get presigned url
        // Upload file
        // Submit

      }

      // this.props._showGlobalLoading();

      // if (this.props.finishingSetup) {
      //   payload = {
      //     scenarioName: this.state.data.name
      //   };
      //   if (this.state.data.description) {
      //     payload.scenarioDescription = this.state.data.description;
      //   }
      // }

      // this.props.saveScenario(this.props.scenarioData.project_id, payload);
    }
  },

  onFieldChange: function (field, e) {
    let data = Object.assign({}, this.state.data, {[field]: e.target.value});
    this.setState({data});
  },

  renderError: function () {
    let error = this.props.scenarioForm.error;

    if (!error) {
      return;
    }

    if (error.statusCode === 409) {
      return <p>The name is already in use.</p>;
    } else {
      return <p>{error.message || error.error}</p>;
    }
  },

  render: function () {
    let processing = this.props.scenarioForm.processing;

    return (
      <Modal
        id='modal-scenario-metadata'
        className='modal--small'
        onCloseClick={this.onClose}
        revealed={this.props.revealed} >

        <ModalHeader>
          <div className='modal__headline'>
            <h1 className='modal__title'>{t('Create new scenario')}</h1>
            <div className='modal__description'>
              <p>{t('Name and describe your new scenario.')}</p>
            </div>
          </div>
        </ModalHeader>
        <ModalBody>

          {this.renderError()}

          <form className={c('form', {'disable': processing})} onSubmit={this.onSubmit}>
            <div className='form__group'>
              <label className='form__label' htmlFor='scenario-name'>{t('Scenario name')}</label>
              <input type='text' className='form__control form__control--medium' id='scenario-name' name='scenario-name' placeholder={t('Untitled scenario')} value={this.state.data.name} onChange={this.onFieldChange.bind(null, 'name')} />

              {this.state.errors.name ? <p className='form__error'>{t('A Scenario name is required.')}</p> : null }

              <p className='form__help'>Keep it short and sweet.</p>
            </div>

            <div className='form__group'>
              <label className='form__label' htmlFor='scenario-desc'>{t('Description')} <small>({t('optional')})</small></label>
              <textarea ref='description' className='form__control' id='scenario-desc' rows='2' placeholder={t('Say something about this scenario')} value={this.state.data.description} onChange={this.onFieldChange.bind(null, 'description')}></textarea>
            </div>

            <div className='form__group'>
              <label className='form__label'>Road network</label>

              <label className='form__option form__option--inline form__option--custom-radio'>
                <input type='radio' name='road-network' id='road-network-clone' value='clone' onChange={this.onFieldChange.bind(null, 'roadNetworkSource')} checked={this.state.data.roadNetworkSource === 'clone'}/>
                <span className='form__option__text'>{t('Clone from scenario')}</span>
                <span className='form__option__ui'></span>
              </label>
              <label className='form__option form__option--inline form__option--custom-radio'>
                <input type='radio' name='road-network' id='road-network-new' value='new' onChange={this.onFieldChange.bind(null, 'roadNetworkSource')} checked={this.state.data.roadNetworkSource === 'new'}/>
                <span className='form__option__text'>{t('Upload new')}</span>
                <span className='form__option__ui'></span>
              </label>
            </div>

            {this.state.data.roadNetworkSource === 'clone' ? (
            <div className='form__group form__group--attached'>
              <label className='form__label visually-hidden' htmlFor='road-network-clone-options'>{t('Clone from scenario')}</label>
              <select name='road-network-clone-options' id='road-network-clone-options' className='form__control' value={this.state.data.roadNetworkSourceScenario} onChange={this.onFieldChange.bind(null, 'roadNetworkSourceScenario')}>
                {this.props.scenarioList.map(scenario => <option key={scenario.id} value={scenario.id}>{scenario.name}</option>)}
              </select>
            </div>
            ) : null}

            {this.state.data.roadNetworkSource === 'new' ? (
            <div className='form__group form__group--attached'>
              <label className='form__label visually-hidden' htmlFor='road-network-new-file'>{t('New road network')}</label>
              <input type='file' name='road-network-new-file' id='road-network-new-file' className='form__control--upload' ref='file' onChange={this.onFileSelected} />
              {this.state.errors.roadNetworkSource ? <p className='form__error'>{t('A file is required.')}</p> : null }
            </div>
            ) : null}

          </form>
        </ModalBody>
        <ModalFooter>
          <button className='mfa-xmark' type='button' onClick={this.onClose}><span>{t('Cancel')}</span></button>
          <button className='mfa-tick' type='submit' onClick={this.onSubmit}><span>{t('Create')}</span></button>
        </ModalFooter>
      </Modal>
    );
  }
});

export default ScenarioCreateModal;
