import axios from "axios";
import React, { useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { matchPath, Route, Switch, useHistory, useParams } from "react-router-dom";
import FormSelect from "../Components/FormSelect";
import Departures from "./Departures";

const SelectRoute = () => {
  const [stops, setStops] = useState([]);
  const currentPath = "/routes/:route/:direction/:stop";

  const history = useHistory();

  /* check current route param and (if present) set it as a default value in dropdown */
  const match = matchPath(history.location.pathname, { path: currentPath });

  const [stop, setStop] = useState(match?.params?.stop ?? '');
  const [stopName, setStopName] = useState('');

  /* get url params */
  const { route, direction } = useParams();

  const buildUrl = (stop) => {
    return currentPath.replace(':route', route).replace(':direction', direction).replace(':stop', stop);
  }

  const updateStop = ({target}) => {
    setStop(target.value);

    const stopName = stops.find(s => s.Value === target.value);
    if (stopName) {
      setStopName(stopName.Text);
    }

    const url = buildUrl(target.value);
    history.push(url) // show stops dropdown
  };

  useEffect(() => {
    if (route && direction) {
      const cancelTokenSource = axios.CancelToken.source();
      /* fetch all stops available on the given route and direction from API */
      axios
        .get(`https://svc.metrotransit.org/NexTrip/Stops/${route}/${direction}`, {
          cancelToken: cancelTokenSource.token
        })
        .then((response) => {
          setStops(response.data);
        });

      return () => {
        cancelTokenSource.cancel();
      }
    }
  }, [route, direction]);

  useEffect(() => {
    setStop(match?.params?.stop)
  }, [match]);

  useEffect(() => {
    const stopName = stops.find(s => s.Value === stop);
    if (stopName) {
      setStopName(stopName.Text);
    }
  }, [stop, stops]); 

  return (
    <>
      <Row>
        <Col md={{span: 6, offset: 3}}>
          <FormSelect
            id={'routesForm.SelectStopControl'}
            value={stop}
            label={'Select stop'}
            type={'stops-list'}
            list={stops}
            onChange={updateStop}
          />
        </Col>
      </Row>
      <Switch>
        <Route path={currentPath}>
          <Departures stop={stopName} />
        </Route>
      </Switch>
    </>
  );
};

export default SelectRoute;
