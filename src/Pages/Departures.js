import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Card } from "react-bootstrap";
import { useParams } from 'react-router';


const Departures = (props) => {
  const [departures, setDepartures] = useState([]);
  const [loading, setLoading] = useState(true);

  /* get url params */
  const { route, direction, stop } = useParams();

  useEffect(() => {
    setLoading(true);
    const cancelTokenSource = axios.CancelToken.source();
    axios
      .get(`https://svc.metrotransit.org/NexTrip/${route}/${direction}/${stop}`, {
        cancelToken: cancelTokenSource.token
      })
      .then((response) => {
        setDepartures(response.data);
        setLoading(false);
      });

    return () => {
      cancelTokenSource.cancel();
    }
  }, [stop, route, direction]);

  return (
    <Card className={'mt-5 stop-departures'} data-testid="departuresTable">
      <Card.Body>
        <div className="stop-description d-flex justify-content-between align-items-center">
          <h3 className="h2 stop-name">{props.stop}</h3>
          <span className="stop-number"><strong>Stop #: </strong>51437</span>
        </div>
        <div className="stop-departures-table-wrapper">
          <table className="table departures-table table-striped">
            <caption className="sr-only">Departures table</caption>
            <thead>
              <tr>
                <th className="route">Route</th>
                <th className="destination">Destination</th>
                <th className="departs text-right">Departs</th>
              </tr>
            </thead>
            <tbody>
              {departures.map((departure, index) => (
                <tr data-testid="departuresTableRows" key={'departure-'+index} className="departure" style={{display: 'table-row'}}>
                  <td className="route-number mr-2">{departure.Route}</td>
                  <td className="route-name">{departure.Description}</td>
                  <td className="depart-time ml-auto"><span>{departure.DepartureText}</span></td>
                </tr>
              ))}
              {!loading && departures.length === 0 && (
                <tr data-testid="departuresNoRecordsRow" className="departure" style={{display: 'table-row'}}>
                  <td colSpan="3" className="mr-2">
                    <span className="h3">No records found.</span>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card.Body>
    </Card>
  )
}

export default Departures;