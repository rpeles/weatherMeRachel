import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { catchError, Observable, of, shareReplay, tap, throwError } from 'rxjs';
import { Location } from 'src/app/shared/models/location.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private autocompleteCache = new Map<string, Location[]>();
  private locationCache = new Map<string, Location>();
  private selectedCitySignal = signal<Location>(null);
  static defaultCityCode = '215854'; // Tel Aviv

  constructor(private httpClient: HttpClient) {}

  get selectedCity(): Location {
    return this.selectedCitySignal();
  }

  set selectedCity(city: Location) {
    this.selectedCitySignal.set(city);
  }

  getAutocompleteLocation(searchText: string): Observable<Location[]> {
    if (this.autocompleteCache.has(searchText)) {
      return of(this.autocompleteCache.get(searchText)!);
    }

    let params: HttpParams = new HttpParams()
      .set('apikey', environment.apiKey)
      .set('q', searchText);

    return this.httpClient
      .get<Location[]>('http://dataservice.accuweather.com/locations/v1/cities/autocomplete', { params })
      .pipe(
        tap((result) => this.autocompleteCache.set(searchText, result)), // cache only on success
        catchError((error) => {
          return throwError(() => error);
        }),
        shareReplay(1)
      );
  }


  getLocationByKey(locationKey: string): Observable<Location> {
    if (this.locationCache.has(locationKey)) {
      return of(this.locationCache.get(locationKey)!);
    }

    let params: HttpParams = new HttpParams()
      .set('apikey', environment.apiKey);

    return this.httpClient
      .get<Location>(`http://dataservice.accuweather.com/locations/v1/${locationKey}`, { params })
      .pipe(
        tap((result) => this.locationCache.set(locationKey, result)),
        catchError((error) => {
          return throwError(() => error);
        }),
        shareReplay(1)
      );
  }

}
