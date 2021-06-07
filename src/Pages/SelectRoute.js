import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Col, Row } from 'react-bootstrap';
import { matchPath, Route, Switch, useHistory, useRouteMatch } from 'react-router';
import { SelectDirection } from '.';
import FormSelect from '../Components/FormSelect';

const SelectRoute = () => {
  /* routes list stored here */
  const [routes, setRoutes] = useState([]);
  
  const history = useHistory();

  /* check current route param and (if present) set it as a default value in dropdown */
  const match = matchPath(history.location.pathname, { path: "/routes/:route" });

  /* current route id stored here */
  const [route, setRoute] = useState(match?.params?.route ?? '');

  const { path } = useRouteMatch();
  const directionsPath = `${path}/:route`; // directions route path

  const updateRoute = ({target}) => {
    setRoute(target.value); // store the id
    history.push(`/routes/${target.value}`) // show directions
  }

  useEffect(() => {
    /* fetch all routes from API */
    axios.get('https://svc.metrotransit.org/NexTrip/Routes').then(response => {
      const data = response.data.map(route => ({Value: route.Route, Text: route.Description}));
      setRoutes(data)
    });
  }, []);

  useEffect(() => {
    setRoute(match?.params?.route ?? '')
  }, [match]);

  return (
    <>
      <Row>
        <Col md={{span: 6, offset: 3}}>
          <FormSelect 
            id={'routesForm.SelectRouteControl'}
            value={route}
            label={'Select route'}
            type={'routes-list'}
            list={routes}
            onChange={updateRoute}
          />
        </Col>
      </Row>
      <Switch>
        <Route path={directionsPath}>
          <SelectDirection />
        </Route>
      </Switch>
    </>
  );
};

export default SelectRoute