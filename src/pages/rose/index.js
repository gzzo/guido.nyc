import React from 'react'
import moment from 'moment'
import _ from 'lodash'

import Layout from '../../templates/layout'

class Rose extends React.Component {
  constructor(props) {
    super(props)

    this.endDate = moment(new Date(2016, 8, 14, 23, 55))

    this.state = {
      now: moment(),
    }
  }

  componentWillMount() {
    this.interval = setInterval(this.tick, 1000)
  }

  componentWillUnmount() {
    clearInterval(this.interval)
  }

  tick = () => {
    this.setState({
      now: moment(),
    })
  }

  pluralize(num, word) {
    const phrase = `${num} ${word}`
    return num === 1 ? phrase : `${phrase}s`
  }

  daysBetween() {
    const diff = moment.duration(this.state.now.diff(this.endDate))

    const phrases = [
      {
        time: diff.years(),
        word: 'year',
      },
      {
        time: diff.months(),
        word: 'month',
      },
      {
        time: diff.days(),
        word: 'day',
      },
      {
        time: diff.hours(),
        word: 'hour',
      },
      {
        time: diff.minutes(),
        word: 'minute',
      },
      {
        time: diff.seconds(),
        word: 'second',
      },
    ]

    return _.join(
      _.map(phrases, phrase => `${this.pluralize(phrase.time, phrase.word)}`),
      ', '
    )
  }

  render() {
    return (
      <Layout>
        <h1>🌹</h1>
        <div>{this.daysBetween()}</div>
      </Layout>
    )
  }
}

export default Rose
