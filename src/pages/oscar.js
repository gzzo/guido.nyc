import React from 'react'

import Container from '../components/container';

import css from './oscar.module.css';


export default class OscarPage extends React.Component {
  componentDidMount() {
    this.iframe.focus();
  }

  render() {
    return (
      <Container fullscreen>
        <iframe
          className={css.iframe}
          ref={iframe => {this.iframe = iframe}}
          src="https://shopkeeper-capacity-56747.netlify.com/puzzle/oscar"
        />
      </Container>
    )
  }
}
