import React from 'react';
import {render} from 'react-dom';
import LandingPage from './LandingPage.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userDefined: false,
    };
  }

  setAttendee () {
    this.setState({
      userDefined: true,
      user: 'attendee'
    });
    console.log('attendee clicked', this.state.user);

  }

  setNomad () {
    this.setState({
      userDefined: true,
      user: 'nomad',
    })
    console.log('nomad clicked', this.state.user);
  }



  render () {
    if (!this.state.userDefined) {
      return (
        // Landing Page
        <div>
          <LandingPage setAttendee={this.setAttendee.bind(this)} setNomad={this.setNomad.bind(this)}/>
        </div>
      )
    } else {
      // check user type

      return (
        <div>
        Poop
        </div>
      )
    }
  }
}

render(<App/>, document.getElementById('app'));
