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

  render () {
    if (!this.state.userDefined) {
      return (
        // Landing Page
        <div>
          <LandingPage />
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
