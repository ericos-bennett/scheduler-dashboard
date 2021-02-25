import React, { Component } from "react";
import classnames from "classnames";

import Loading from './Loading';
import Panel from './Panel';

const data = [
  {
    id: 1,
    label: "Total Interviews",
    value: 6
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    value: "1pm"
  },
  {
    id: 3,
    label: "Most Popular Day",
    value: "Wednesday"
  },
  {
    id: 4,
    label: "Interviews Per Day",
    value: "2.3"
  }
];

class Dashboard extends Component {

  state = { 
    loading: false,
    focused: null
  };

  panelData = data.map((el) => {
    return ( 
    <Panel
      key={el.id}
      id={el.id}
      label={el.label}
      value={el.value} 
    />
  )});

  render() {
    const dashboardClasses = classnames("dashboard");

    return this.state.loading
      ? <Loading />
      : (
        <main className={dashboardClasses}>
          {this.panelData}
        </main>
      )

  }
}

export default Dashboard;
