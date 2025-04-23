import { NgModule } from '@angular/core';
import { SearchPage } from './pages/search/search.page';
import { WeatherRoutingModule } from './weather-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { SharedModule } from '../../shared/shared.module';
import { CoreModule } from '../../core/core.module';
import { WeatherComponent } from './pages/weather/weather.component';
import { SearchInputComponent } from './pages/search-input/search-input.component';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { DatePipe } from '@angular/common';

@NgModule({
  declarations: [SearchPage, SearchInputComponent, WeatherComponent],
  imports: [
    CoreModule,
    WeatherRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    SharedModule,
    MatInputModule,
    MatCardModule,
    MatProgressSpinnerModule,
    DatePipe,
  ],
})
export class WeatherModule {}
