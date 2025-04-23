import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Location } from 'src/app/shared/models/location.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  private selectedCitySignal = signal<Location>(null);
  static defaultCityCode = '215854'; // Tel Aviv

  constructor(private httpClient: HttpClient) {}

  get selectedCity(): Location {
    return this.selectedCitySignal();
  }

  set selectedCity(city: Location) {
    this.selectedCitySignal.set(city);
  }

  // TODO!! Example response for testing purposes
  locationResponseExample: Location[] = [
    {
      Version: 1,
      Key: '210841',
      Type: 'City',
      Rank: 20,
      LocalizedName: 'Tehran',
      Country: {
        ID: 'IR',
        LocalizedName: 'Iran',
      },
      AdministrativeArea: {
        ID: '07',
        LocalizedName: 'Tehran',
      },
    },
    {
      Version: 1,
      Key: '60592',
      Type: 'City',
      Rank: 23,
      LocalizedName: 'Tengzhou',
      Country: {
        ID: 'CN',
        LocalizedName: 'China',
      },
      AdministrativeArea: {
        ID: 'SD',
        LocalizedName: 'Shandong',
      },
    },
    {
      Version: 1,
      Key: '188046',
      Type: 'City',
      Rank: 30,
      LocalizedName: 'Tegucigalpa',
      Country: {
        ID: 'HN',
        LocalizedName: 'Honduras',
      },
      AdministrativeArea: {
        ID: 'FM',
        LocalizedName: 'Francisco Morazán',
      },
    },
    {
      Version: 1,
      Key: '45253',
      Type: 'City',
      Rank: 31,
      LocalizedName: 'Teresina',
      Country: {
        ID: 'BR',
        LocalizedName: 'Brazil',
      },
      AdministrativeArea: {
        ID: 'PI',
        LocalizedName: 'Piauí',
      },
    },
    {
      Version: 1,
      Key: '215854',
      Type: 'City',
      Rank: 31,
      LocalizedName: 'Tel Aviv',
      Country: {
        ID: 'IL',
        LocalizedName: 'Israel',
      },
      AdministrativeArea: {
        ID: 'TA',
        LocalizedName: 'Tel Aviv',
      },
    },
    {
      Version: 1,
      Key: '234337',
      Type: 'City',
      Rank: 31,
      LocalizedName: 'Tepic',
      Country: {
        ID: 'MX',
        LocalizedName: 'Mexico',
      },
      AdministrativeArea: {
        ID: 'NAY',
        LocalizedName: 'Nayarit',
      },
    },
    {
      Version: 1,
      Key: '246100',
      Type: 'City',
      Rank: 32,
      LocalizedName: 'Tetouan',
      Country: {
        ID: 'MA',
        LocalizedName: 'Morocco',
      },
      AdministrativeArea: {
        ID: '01',
        LocalizedName: 'Tanger-Tétouan-Al Hoceïma',
      },
    },
    {
      Version: 1,
      Key: '61484',
      Type: 'City',
      Rank: 33,
      LocalizedName: 'Tengchong',
      Country: {
        ID: 'CN',
        LocalizedName: 'China',
      },
      AdministrativeArea: {
        ID: 'YN',
        LocalizedName: 'Yunnan',
      },
    },
    {
      Version: 1,
      Key: '3558994',
      Type: 'City',
      Rank: 35,
      LocalizedName: 'Tecámac',
      Country: {
        ID: 'MX',
        LocalizedName: 'Mexico',
      },
      AdministrativeArea: {
        ID: 'MEX',
        LocalizedName: 'México',
      },
    },
    {
      Version: 1,
      Key: '234828',
      Type: 'City',
      Rank: 35,
      LocalizedName: 'Tehuacán',
      Country: {
        ID: 'MX',
        LocalizedName: 'Mexico',
      },
      AdministrativeArea: {
        ID: 'PUE',
        LocalizedName: 'Puebla',
      },
    },
  ];

  getAutocompleteLocation(searchText: string): Observable<Location[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('apikey', environment.apiKey);
    params = params.append('q', searchText);
    return of(this.locationResponseExample);
    //return this.httpClient.get<Location[]>('http://dataservice.accuweather.com/locations/v1/cities/autocomplete', { params });
  }

  def: Location = {
    Version: 1,
    Key: '215854',
    Type: 'City',
    Rank: 31,
    LocalizedName: 'Tel Aviv',
    Country: {
      ID: 'IL',
      LocalizedName: 'Israel',
    },
    AdministrativeArea: {
      ID: 'TA',
      LocalizedName: 'Tel Aviv',
    },
  };

  getLocationByKey(locationKey: string): Observable<Location> {
    let params: HttpParams = new HttpParams();
    params = params.append('apikey', environment.apiKey);
    return of(this.def);
    // return this.httpClient.get<Location>(`http://dataservice.accuweather.com/locations/v1/${locationKey}`, { params });
  }
}
