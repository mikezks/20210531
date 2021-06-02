import * as fromPassenger from './passenger.reducer';
import { createFeatureSelector } from '@ngrx/store';
import { passengersFeatureKey } from './passenger.reducer';


// Selector pointing to passenger state in store
export const selectPassengerState = createFeatureSelector<fromPassenger.State>(passengersFeatureKey);

// Generic selectors for the entity passenger
export const {
    selectIds,
    selectEntities,
    selectAll,
    selectTotal,
} = fromPassenger.adapter.getSelectors(selectPassengerState);
