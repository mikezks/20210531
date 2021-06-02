import { Flight } from '@flight-workspace/flight-lib';
import { createAction, props } from '@ngrx/store';

export const flightsLoad = createAction(
  '[FlightBooking] Flights load',
  props<{ from: string, to: string }>()
);

export const flightsLoaded = createAction(
  '[FlightBooking] Flights loaded',
  props<{ flights: Flight[] }>()
);

export const flightUpdate = createAction(
  '[FlightBooking] Flights update',
  props<{ flight: Flight }>()
);

export const flightLoadedFailure = createAction(
  '[FlightBooking] Flights loaded failure',
  props<{ error: any }>()
);
