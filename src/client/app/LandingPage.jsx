import React from 'react';

const LandingPage = (props) => {

  return (
    <div>
      <form>
        <input type='button' value='Find' onClick={props.setAttendee}></input>
        <input type='button' value='Create' onClick={props.setNomad}></input>
      </form>
    </div>
  )

}

module.exports = LandingPage;
