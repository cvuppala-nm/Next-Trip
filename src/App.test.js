import { render, screen, fireEvent, cleanup, act } from '@testing-library/react';
import axios from 'axios';
import { BrowserRouter } from 'react-router-dom'
import App from './App';
import '@testing-library/jest-dom/extend-expect'

axios.CancelToken = { source: () => ({ cancel: jest.fn(), }), };
jest.mock('axios');

axios.isCancel = (u) => {
  return !!(u && u.__CANCEL__);
};

afterEach(() => {
  cleanup();
});

const mockResponseData = jest.fn(payload => {
  return {
    data: payload
  };
});

const routes = mockResponseData([
  {
    Description: "METRO Blue Line",
    ProviderID: "0",
    Route: "901"
  },
  {
    Description: "METRO Green Line",
    ProviderID: "0",
    Route: "902"
  }
]);

const directions = mockResponseData([
  {
    Value: "0",
    Text: "Northbound",
  },
  {
    Value: "1",
    Text: "Southbound",
  }
]);

const stops = mockResponseData([
  {
    "Text": "MSP Airport Terminal 1 - Lindbergh Station",
    "Value": "LIND"
  },
  {
    "Text": "MSP Airport Terminal 2 - Humphrey Station",
    "Value": "HHTE"
  }
]);

const departures = mockResponseData([
  {
    Route: '96',
    Description: 'Airport Shuttle',
    DepartureText: '11:26',
  },
  {
    Route: '96',
    Description: 'Airport Shuttle',
    DepartureText: '12:01',
  },
])

const emptyDepartures = mockResponseData([])

const renderWithRouter = (ui, { route = '/' } = {}) => {
  window.history.pushState({}, 'Test page', route)

  return render(ui, { wrapper: BrowserRouter })
}

test('shows routes list on home page', async () => {
  
  axios.get.mockResolvedValueOnce(routes);
  
  await act(async () => renderWithRouter(
    <App />, { route: '/' }
  ));
    
  const routesList = screen.getByTestId('routesForm.SelectRouteControl');
  expect(routesList).toBeInTheDocument();
});

test('shows directions after selecting route from the list', async () => {
  axios.get.mockResolvedValueOnce(routes);

  await act(async () => renderWithRouter(
    <App />, { route: '/' }
  ));

  expect(screen.getAllByTestId('routesForm.SelectRouteControl.Option')).toHaveLength(2);

  axios.get.mockResolvedValueOnce(directions);

  await act( async () =>
    fireEvent.change(screen.getByTestId('routesForm.SelectRouteControl.Select'), { target: { value: "901" } })
  );

  let options = screen.getAllByTestId('routesForm.SelectRouteControl.Option');
  expect(options[0].selected).toBeTruthy();

  expect(screen.getByTestId('routesForm.SelectDirectionControl')).toBeInTheDocument();
});

test('shows stops after selecting direction from the list', async () => {
  axios.get.mockResolvedValueOnce(routes);

  await act(async () => renderWithRouter(
    <App />, { route: '/' }
  ));

  axios.get.mockResolvedValueOnce(directions);

  await act( async () => {
    fireEvent.change(screen.getByTestId('routesForm.SelectRouteControl.Select'), { target: { value: "901" } });
  });
  
  const routeOptions = screen.getAllByTestId('routesForm.SelectRouteControl.Option');
  expect(routeOptions[0].selected).toBeTruthy();

  axios.get.mockResolvedValueOnce(stops);

  await act( async () => {
    fireEvent.change(screen.getByTestId('routesForm.SelectDirectionControl.Select'), { target: { value: "0" } });
  })

  const directionOptions = screen.getAllByTestId('routesForm.SelectDirectionControl.Option');
  expect(directionOptions[0].selected).toBeTruthy();

  expect(screen.getByTestId('routesForm.SelectStopControl')).toBeInTheDocument();
});

test('shows departures table after selecting stop from the list', async () => {
  axios.get.mockResolvedValueOnce(routes);

  await act(async () => renderWithRouter(
    <App />, { route: '/' }
  ));

  axios.get.mockResolvedValueOnce(directions);

  await act( async () => {
    fireEvent.change(screen.getByTestId('routesForm.SelectRouteControl.Select'), { target: { value: "901" } });
  });
  
  const routeOptions = screen.getAllByTestId('routesForm.SelectRouteControl.Option');
  expect(routeOptions[0].selected).toBeTruthy();

  axios.get.mockResolvedValueOnce(stops);

  await act( async () => {
    fireEvent.change(screen.getByTestId('routesForm.SelectDirectionControl.Select'), { target: { value: "0" } });
  })

  const directionOptions = screen.getAllByTestId('routesForm.SelectDirectionControl.Option');
  expect(directionOptions[0].selected).toBeTruthy();

  expect(screen.getByTestId('routesForm.SelectStopControl')).toBeInTheDocument();

  axios.get.mockResolvedValueOnce(departures);

  await act( async () => {
    fireEvent.change(screen.getByTestId('routesForm.SelectStopControl.Select'), { target: { value: "LIND" } });
  });

  const stopOptions = screen.getAllByTestId('routesForm.SelectStopControl.Option');
  expect(stopOptions[0].selected).toBeTruthy();

  expect(screen.getByTestId('departuresTable')).toBeInTheDocument();
  expect(screen.getAllByTestId('departuresTableRows')).toHaveLength(2);
});

test('shows no records text in table when there are no departures in list', async () => {
  axios.get.mockResolvedValueOnce(routes);

  await act(async () => renderWithRouter(
    <App />, { route: '/' }
  ));

  axios.get.mockResolvedValueOnce(directions);

  await act( async () => {
    fireEvent.change(screen.getByTestId('routesForm.SelectRouteControl.Select'), { target: { value: "901" } });
  });
  
  const routeOptions = screen.getAllByTestId('routesForm.SelectRouteControl.Option');
  expect(routeOptions[0].selected).toBeTruthy();

  axios.get.mockResolvedValueOnce(stops);

  await act( async () => {
    fireEvent.change(screen.getByTestId('routesForm.SelectDirectionControl.Select'), { target: { value: "0" } });
  })

  const directionOptions = screen.getAllByTestId('routesForm.SelectDirectionControl.Option');
  expect(directionOptions[0].selected).toBeTruthy();

  expect(screen.getByTestId('routesForm.SelectStopControl')).toBeInTheDocument();

  axios.get.mockResolvedValueOnce(emptyDepartures);

  await act( async () => {
    fireEvent.change(screen.getByTestId('routesForm.SelectStopControl.Select'), { target: { value: "LIND" } });
  });

  const stopOptions = screen.getAllByTestId('routesForm.SelectStopControl.Option');
  expect(stopOptions[0].selected).toBeTruthy();

  expect(screen.getByTestId('departuresTable')).toBeInTheDocument();
  expect(screen.getByTestId('departuresNoRecordsRow')).toBeInTheDocument();
});
