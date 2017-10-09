import React from 'react'
import Link from 'gatsby-link'

import Container from '../components/container';
import Text from '../components/text';


class RosePage extends React.Component {
  constructor(props) {
    super(props);

    this.endDate = new Date(2016, 8, 14, 23, 55);
    
    this.state = {
      now: new Date()
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
      now: new Date()
    })
  }

  pad(n, width, z) {
    z = z || '0';
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
  }

  daysBetween(date1, date2) {
    //Get 1 day in milliseconds
    var one_day=1000*60*60*24;
    // Convert both dates to milliseconds
    var date1_ms = date1.getTime();
    var date2_ms = date2.getTime();
    // Calculate the difference in milliseconds
    var difference_ms = date2_ms - date1_ms;
    //take out milliseconds
    difference_ms = difference_ms/1000;
    var seconds = Math.floor(difference_ms % 60);
    difference_ms = difference_ms/60; 
    var minutes = Math.floor(difference_ms % 60);
    difference_ms = difference_ms/60; 
    var hours = Math.floor(difference_ms % 24);  
    var days = Math.floor(difference_ms/24);
  
    return days + ' days ' + this.pad(hours,2) + 'h ' + this.pad(minutes,2) + 'm ' + this.pad(seconds,2) + 's';
  }
  
  render() {
    return (
      <Container centered>
        <Text font="Bungee Shade" size="title">{this.daysBetween(this.state.now, this.endDate)}</Text>
      </Container>
    )
  }

}

export default RosePage;
