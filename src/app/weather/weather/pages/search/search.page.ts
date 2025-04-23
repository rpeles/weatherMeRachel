import { Component, effect, OnInit, signal } from '@angular/core';
import {
  Forecast,
  WeatherStatus,
} from '../../../../shared/models/forecast.model';
import { WeatherService } from '../../../../core/services/weather.service';
import { LocationService } from '../../../../core/services/location.service';
import { CurrentWeather } from '../../../../shared/models/currentWeather.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '../../../../core/services/loader.service';
import { catchError, finalize, of } from 'rxjs';

@Component({
  selector: 'app-search',
  templateUrl: './search.page.html',
  styleUrls: ['./search.page.scss'],
  standalone: false,
})
export class SearchPage implements OnInit {
  forecastSignal = signal<Forecast | null>(null);
  currentWeatherSignal = signal<CurrentWeather | null>(null);

  weatherStatus: WeatherStatus = 'noData';
  isLoading = false;

  constructor(
    private weatherService: WeatherService,
    protected locationService: LocationService,
    protected loaderService: LoaderService,
    private snackBar: MatSnackBar,
  ) {
    effect(() => {
      this.getWeatherData();
    });
  }

  ngOnInit() {
    this.loaderService.stateChange.subscribe((loaderState) => {
      setTimeout(() => {
        this.isLoading = loaderState;
      });
    });
  }

  retry() {
    this.getWeatherData();
  }

  getWeatherData() {
    const city = this.locationService.selectedCity;
    this.currentWeatherSignal.set(null);
    this.forecastSignal.set(null);
    if (!city) {
      this.weatherStatus = 'noData';
      return;
    }
    this.getCurrentWeather(city.Key);
    this.getForecast(city.Key);
  }

  getCurrentWeather(cityKey: string) {
    this.loaderService.addRequest();
    this.weatherService
      .getCurrentWeather(cityKey)
      .pipe(
        catchError((error) => {
          this.snackBar.open('Failed to fetch current weather data.', 'Close', {
            duration: 3000,
          });
          return of(null);
        }),
        finalize(() => {
          this.loaderService.removeRequest();
        }),
      )
      .subscribe((currentWeather) => {
        if (currentWeather) {
          this.weatherStatus = 'success';
          this.currentWeatherSignal.set(currentWeather[0]);
        } else {
          this.weatherStatus = 'error';
        }
      });
  }

  getForecast(cityKey: string) {
    this.loaderService.addRequest();
    this.weatherService
      .getForecast(cityKey)
      .pipe(
        catchError((error) => {
          this.snackBar.open('Failed to fetch forecast data.', 'Close', {
            duration: 3000,
          });
          return of(null);
        }),
        finalize(() => {
          this.loaderService.removeRequest();
        }),
      )
      .subscribe((forecast) => {
        if (forecast) {
          this.weatherStatus = 'success';
          this.forecastSignal.set(forecast);
        } else {
          this.weatherStatus = 'error';
        }
      });
  }
}
