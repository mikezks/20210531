import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Flight } from '@flight-workspace/flight-lib';
import { iif, Observable, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, tap, withLatestFrom } from 'rxjs/operators';

@Component({
  selector: 'flight-workspace-flight-typeahead',
  templateUrl: './flight-typeahead.component.html',
  styleUrls: ['./flight-typeahead.component.css']
})
export class FlightTypeaheadComponent implements OnInit {
  control = new FormControl();
  // Result Stream -> Template subscription
  flights$: Observable<Flight[]>;
  loading: boolean;

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    const dataProvider = of({
      from: 'New York',
      to: 'Paris'
    });

    // Stream 1: Control Filter Value
    //   - Trigger
    //   - Data Provider
    this.flights$ = this.control.valueChanges.pipe(
      // Stream 3: Data/State Provider
      withLatestFrom(dataProvider),
      map(([trigger, state]) => trigger),
      // Filter START
      debounceTime(300),
      distinctUntilChanged(),
      // Filter END
      // Conditional Streams with cancellation
      switchMap(from =>
        iif(
          () => from.length > 2,
          of(from).pipe(
            // Side Effect
            tap(_ => this.loading = true),
            // Connect 2nd Stream
            switchMap(from => this.load(from)),
            // Side Effect
            tap(_ => this.loading = false)
          ),
          of([])
        )
      )
    );

    const flightsCount$ = this.flights$.pipe(
      map(flights => flights.length)
    );

    flightsCount$.subscribe(console.log);
  }

  // Stream 2: Server Call (Data access)
  load(from: string): Observable<Flight[]>  {
    const url = "http://www.angular.at/api/flight";

    const params = new HttpParams()
                        .set('from', from);

    const headers = new HttpHeaders()
                        .set('Accept', 'application/json');

    return this.http.get<Flight[]>(url, {params, headers});
    /* return of([{
      id: 999,
      from: 'New York',
      to: 'Paris',
      date: new Date().toISOString(),
      delayed: true
    }]); */
  }
}
