import React from 'react';
import { Tab, Col, Row, Nav, Table } from 'react-bootstrap';
import './weatherinfo.css'

export default function WeatherInfo(props) {
    return (
        <div>
            <Tab.Container id="left-tabs-example" defaultActiveKey="today">
                <Row>
                    <Col sm={3}>
                        <Nav variant="pills" className="flex-column">
                            <Nav.Item>
                                <Nav.Link eventKey="today">Today</Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link eventKey="7-days">7-Days</Nav.Link>
                            </Nav.Item>
                        </Nav>
                    </Col>
                    <Col sm={9}>
                        <Tab.Content>
                            <Tab.Pane eventKey="today">
                                <div className="degree-temperature degree-temp">{props.weatherHourly.hourlyTemp[0].currentTemp}</div>
                                <div className="degree-high-low">
                                    <span className="degree-temp">H {props.weatherHourly.highTemp}</span>
                                    <span> -- </span>    
                                    <span className="degree-temp">L {props.weatherHourly.lowTemp}</span>
                                </div>
                                <div className="hourly-heading">Hourly Forecast...</div>
                                <Table striped bordered hover responsive className="hourly-table">
                                    <thead>
                                        <tr>
                                            <th>Hours</th>
                                            <th>Temp</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                    {props.weatherHourly.hourlyTemp.map((hourlyTemp) => {
                                        return (<tr key={hourlyTemp.currentTime}>
                                            <td>{hourlyTemp.currentTime}</td>
                                            <td className="degree-temp">{hourlyTemp.currentTemp}</td>
                                        </tr>)
                                    })}
                                    </tbody>
                                </Table>
                            </Tab.Pane>
                            <Tab.Pane eventKey="7-days">
                                <Table striped bordered hover>
                                    <thead>
                                        <tr>
                                            <th>Day</th>
                                            <th>Description</th>
                                            <th>High</th>
                                            <th>Low</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Object.keys(props.weatherWeekly).map((daysInNumber) => {
                                            let temp1 = props.weatherWeekly[daysInNumber].temp1; 
                                            let temp2 = props.weatherWeekly[daysInNumber].temp2;
                                            return (<tr key={daysInNumber}>
                                                <td>{props.weatherWeekly[daysInNumber].day}</td>
                                                <td>{props.weatherWeekly[daysInNumber].shortForecast}</td>
                                                <td className="degree-temp">{temp1 >= temp2? temp1 : temp2 }</td>
                                                <td className="degree-temp">{temp2 >= temp1? temp2 : temp1 }</td>
                                            </tr>)
                                        })}
                                    </tbody>
                                </Table>
                            </Tab.Pane>
                        </Tab.Content>
                    </Col>
                </Row>
            </Tab.Container>
        </div>
    );
};