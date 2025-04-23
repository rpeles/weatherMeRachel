import { Component, Input, OnChanges } from "@angular/core";
import {OpenAIService} from "../../../../core/services/openai.service";
import { CurrentWeather } from "../../../../shared/models/currentWeather.model";
import { LocationService } from "../../../../core/services/location.service";

@Component({
  selector: "weather-outfit-widget",
  standalone: false,
  templateUrl: "./weather-outfit-widget.component.html",
  styleUrl: "./weather-outfit-widget.component.scss",
})
export class WeatherOutfitWidgetComponent implements OnChanges {
  @Input() currentWeather: CurrentWeather;
  outfitSuggestion: string = "Loading...";

  constructor(
    private openAiService: OpenAIService,
    private locationService: LocationService,
  ) {}


  ngOnChanges(): void {
    const temperature = this.currentWeather.Temperature?.Metric?.Value.valueOf();
    const condition = this.currentWeather.WeatherText;
    const city = this.locationService.selectedCity?.LocalizedName;
    if (temperature !== undefined && condition && city) {
      this.fetchOutfitSuggestion(temperature, condition, city);
    }
  }

  fetchOutfitSuggestion(temperature: number, condition: string, city: string): void {
    this.openAiService.getClothingRecommendation(temperature, condition, city)
      .subscribe({
        next: suggestion => this.outfitSuggestion = suggestion,
        error: err => this.outfitSuggestion = 'Unable to fetch recommendation.'
      });
  }
}


