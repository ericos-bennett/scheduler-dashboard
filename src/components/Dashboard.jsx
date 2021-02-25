import React, { Component } from "react";
import classnames from "classnames";
import axios from 'axios';

import Loading from './Loading';
import Panel from './Panel';

import { setInterview } from "helpers/reducers";
import {
  getTotalInterviews,
  getLeastPopularTimeSlot,
  getMostPopularDay,
  getInterviewsPerDay
 } from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Interviews",
    getValue: getTotalInterviews
  },
  {
    id: 2,
    label: "Least Popular Time Slot",
    getValue: getLeastPopularTimeSlot
  },
  {
    id: 3,
    label: "Most Popular Day",
    getValue: getMostPopularDay
  },
  {
    id: 4,
    label: "Interviews Per Day",
    getValue: getInterviewsPerDay
  }
];

class Dashboard extends Component {

  state = { 
    days: [],
    appointments: {},
    interviewers: {},
    loading: true,
    focused: null
  };

  selectPanel(id) {
    this.setState(prevState => ({
      focused: prevState.focused ? null : id
    }));
  };

  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }

    Promise.all([
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ]).then(([days, appointments, interviewers]) => {
      this.setState({
        loading: false,
        days: days.data,
        appointments: appointments.data,
        interviewers: interviewers.data
      });
    });

    this.socket = new WebSocket(process.env.REACT_APP_WEBSOCKET_URL);

    this.socket.onmessage = event => {
      const data = JSON.parse(event.data);
    
      if (typeof data === "object" && data.type === "SET_INTERVIEW") {
        this.setState(previousState =>
          setInterview(previousState, data.id, data.interview)
        );
      }
    };

  };

  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  };
  
  componentWillUnmount() {
    this.socket.close();
  }

  render() {

    const panelData = data
      .filter(
        panel => this.state.focused === null || this.state.focused === panel.id
      )
      .map((el) => {
      return ( 
      <Panel
        key={el.id}
        id={el.id}
        label={el.label}
        value={el.getValue(this.state)}
        onSelect={() => this.selectPanel(el.id)}
      />
    )});

    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
     });

    return this.state.loading
      ? <Loading />
      : (
        <main className={dashboardClasses}>
          {panelData}
        </main>
      )

  }
}

export default Dashboard;
