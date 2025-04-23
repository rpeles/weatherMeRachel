import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { delay, Observable, of, Subject, throwError } from 'rxjs';
import { CurrentWeather } from 'src/app/shared/models/currentWeather.model';
import { Forecast } from 'src/app/shared/models/forecast.model';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  isMetric = true;

  temperatureUnitChanged = new Subject<null>();

  forecast = {
    Headline: {
      EffectiveDate: '2025-04-23T08:00:00+03:00',
      EffectiveEpochDate: 1745384400,
      Severity: 7,
      Text: 'Turning noticeably cooler Wednesday and Thursday',
      Category: 'cooler',
      EndDate: '2025-04-24T20:00:00+03:00',
      EndEpochDate: 1745514000,
      MobileLink:
        'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?unit=c&lang=en-us',
      Link: 'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?unit=c&lang=en-us',
    },
    DailyForecasts: [
      {
        Date: '2025-04-22T07:00:00+03:00',
        EpochDate: 1745294400,
        Temperature: {
          Minimum: {
            Value: 23.1,
            Unit: 'C',
            UnitType: 17,
          },
          Maximum: {
            Value: 31.6,
            Unit: 'C',
            UnitType: 17,
          },
        },
        Day: {
          Icon: 4,
          IconPhrase: 'Intermittent clouds',
          HasPrecipitation: false,
        },
        Night: {
          Icon: 35,
          IconPhrase: 'Partly cloudy',
          HasPrecipitation: false,
        },
        Sources: ['AccuWeather'],
        MobileLink:
          'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=1&unit=c&lang=en-us',
        Link: 'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=1&unit=c&lang=en-us',
      },
      {
        Date: '2025-04-23T07:00:00+03:00',
        EpochDate: 1745380800,
        Temperature: {
          Minimum: {
            Value: 19.5,
            Unit: 'C',
            UnitType: 17,
          },
          Maximum: {
            Value: 31.4,
            Unit: 'C',
            UnitType: 17,
          },
        },
        Day: {
          Icon: 7,
          IconPhrase: 'Cloudy',
          HasPrecipitation: false,
        },
        Night: {
          Icon: 7,
          IconPhrase: 'Cloudy',
          HasPrecipitation: false,
        },
        Sources: ['AccuWeather'],
        MobileLink:
          'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=2&unit=c&lang=en-us',
        Link: 'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=2&unit=c&lang=en-us',
      },
      {
        Date: '2025-04-24T07:00:00+03:00',
        EpochDate: 1745467200,
        Temperature: {
          Minimum: {
            Value: 18.5,
            Unit: 'C',
            UnitType: 17,
          },
          Maximum: {
            Value: 23.7,
            Unit: 'C',
            UnitType: 17,
          },
        },
        Day: {
          Icon: 7,
          IconPhrase: 'Cloudy',
          HasPrecipitation: false,
        },
        Night: {
          Icon: 36,
          IconPhrase: 'Intermittent clouds',
          HasPrecipitation: false,
        },
        Sources: ['AccuWeather'],
        MobileLink:
          'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=3&unit=c&lang=en-us',
        Link: 'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=3&unit=c&lang=en-us',
      },
      {
        Date: '2025-04-25T07:00:00+03:00',
        EpochDate: 1745553600,
        Temperature: {
          Minimum: {
            Value: 17.6,
            Unit: 'C',
            UnitType: 17,
          },
          Maximum: {
            Value: 23.3,
            Unit: 'C',
            UnitType: 17,
          },
        },
        Day: {
          Icon: 1,
          IconPhrase: 'Sunny',
          HasPrecipitation: false,
        },
        Night: {
          Icon: 34,
          IconPhrase: 'Mostly clear',
          HasPrecipitation: false,
        },
        Sources: ['AccuWeather'],
        MobileLink:
          'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=4&unit=c&lang=en-us',
        Link: 'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=4&unit=c&lang=en-us',
      },
      {
        Date: '2025-04-26T07:00:00+03:00',
        EpochDate: 1745640000,
        Temperature: {
          Minimum: {
            Value: 16.7,
            Unit: 'C',
            UnitType: 17,
          },
          Maximum: {
            Value: 23.6,
            Unit: 'C',
            UnitType: 17,
          },
        },
        Day: {
          Icon: 1,
          IconPhrase: 'Sunny',
          HasPrecipitation: false,
        },
        Night: {
          Icon: 35,
          IconPhrase: 'Partly cloudy',
          HasPrecipitation: false,
        },
        Sources: ['AccuWeather'],
        MobileLink:
          'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=5&unit=c&lang=en-us',
        Link: 'http://www.accuweather.com/en/il/tel-aviv/215854/daily-weather-forecast/215854?day=5&unit=c&lang=en-us',
      },
    ],
  };

  constructor(private httpClient: HttpClient) {}

  getData(): Observable<any> {
    return throwError(() => new Error('Simulated error'));
  }

  getForecast(locationKey: string): Observable<Forecast> {
    const isMetric = this.isMetric ? 'true' : 'false';

    let params: HttpParams = new HttpParams();
    params = params.append('apikey', environment.apiKey);
    params = params.append('metric', isMetric);
    return of(this.forecast).pipe(delay(2500));
    //return this.getData()
    // return this.httpClient.get<Forecast>(`http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}`, { params });
  }

  currentWeather: CurrentWeather[] = [
    {
      LocalObservationDateTime: '2025-04-22T09:42:00+03:00',
      EpochTime: 1745304120,
      WeatherText: 'Mostly sunny',
      WeatherIcon: 2,
      HasPrecipitation: false,
      PrecipitationType: null,
      IsDayTime: true,
      Temperature: {
        Metric: {
          Value: 29,
          Unit: 'C',
          UnitType: 17,
        },
        Imperial: {
          Value: 84,
          Unit: 'F',
          UnitType: 18,
        },
      },
      MobileLink:
        'http://www.accuweather.com/en/il/tel-aviv/215854/current-weather/215854?lang=en-us',
      Link: 'http://www.accuweather.com/en/il/tel-aviv/215854/current-weather/215854?lang=en-us',
    },
  ];

  getCurrentWeather(locationKey: string): Observable<CurrentWeather[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('apikey', environment.apiKey);
    return of(this.currentWeather); //.pipe(delay(5000))
    //return this.getData()
    // return this.httpClient.get<CurrentWeather>(`http://dataservice.accuweather.com/currentconditions/v1/${locationKey}`, { params });
  }
}
