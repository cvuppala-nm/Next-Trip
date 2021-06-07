import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { matchPath, Route, Switch, useHistory, useParams } from "react-router-dom"
import { SelectStop } from '.';
import FormSelect from '../Components/FormSelect';

const SelectRoute = () => {
  /* directions list stored here */
  const [directions, setDirections] = useState([]);

  const currentPath = "/routes/:route/:direction";

  const history = useHistory();

  /* get url params */
  const { route, stop } = useParams();

  /* check current route param and (if present) set it as a default value in dropdown */
  const match = matchPath(history.location.pathname, { path: currentPath });

  /* set direction id */
  const [direction, setDirection] = useState(match?.params?.direction ?? '');

  const buildUrl = (direction) => {
    let url = currentPath.replace(':route', route).replace(':direction', direction);
    if (stop) {
      url = url + `/${stop}`;
    }
    return url;
  }

  const updateDirection = ({target}) => {
    setDirection(target.value); // set selected direction id
    const url = buildUrl(target.value);
    history.push(url) // show stops dropdown
  }

  useEffect(() => {
    if (route) {
      const cancelTokenSource = axios.CancelToken.source();
      /* fetch all directions available on the given route from API */
      axios.get(`https://svc.metrotransit.org/NexTrip/Directions/${route}`, {
        cancelToken: cancelTokenSource.token
      }).then(response => {
        setDirections(response.data)
      });

      return () => {
        cancelTokenSource.cancel();
      }
    }
  }, [route]);


  useEffect(() => {
    setDirection(match?.params?.direction ?? '')
  }, [match]);

  return (
    <>
      <Row>
        <Col md={{span: 6, offset: 3}}>
          <FormSelect
            id={'routesForm.SelectDirectionControl'}
            value={direction}
            label={'Select direction'}
            type={'directions-list'}
            list={directions}
            onChange={updateDirection}
          />
        </Col>
      </Row>
      <Switch>
        <Route path={currentPath}>
          <SelectStop />
        </Route>
      </Switch>
    </>
  );
};

export default SelectRoute