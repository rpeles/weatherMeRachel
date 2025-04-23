import { Component, Input } from '@angular/core';
import { Forecast } from '../../../../shared/models/forecast.model';
import { CurrentWeather } from '../../../../shared/models/currentWeather.model';

@Component({
  selector: 'weather-card',
  standalone: false,
  templateUrl: './weather.component.html',
  styleUrl: './weather.component.scss',
})
export class WeatherComponent {
  @Input()
  forecastData: Forecast;

  @Input()
  currentWeather: CurrentWeather;

  @Input()
  location: string;

  formatDate(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleDateString(undefined, {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  }

  getIconUrl(iconNumber: Number): string {
    if (iconNumber) {
      const icon = iconNumber.toString().padStart(2, '0');
      return `https://developer.accuweather.com/sites/default/files/${icon}-s.png`;
    }
  }
}
