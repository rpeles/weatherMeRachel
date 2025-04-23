import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Location } from '../../../../shared/models/location.model';
import { LocationService } from '../../../../core/services/location.service';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';
import { FavoritesService } from '../../../../core/services/favorites.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'search-input',
  standalone: false,
  templateUrl: './search-input.component.html',
  styleUrl: './search-input.component.scss',
})
export class SearchInputComponent implements OnInit {
  destroyRef = inject(DestroyRef);
  searchControl: FormControl<string> = new FormControl('');
  filteredCities: Location[] = [];
  isNotEnglishLetter: boolean = false;

  constructor(
    private locationService: LocationService,
    private favoritesService: FavoritesService,
  ) {}

  ngOnInit() {
    this.initCtrl();
  }

  initCtrl() {
    this.searchControl.valueChanges
      .pipe(
        takeUntilDestroyed(this.destroyRef),
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((value) => {
          const englishOnly = /^[a-zA-Z\s]*$/.test(value);
          const citySelected =
            this.locationService.selectedCity?.LocalizedName === value;
          return englishOnly && !citySelected && value.length > 1
            ? this.locationService.getAutocompleteLocation(value)
            : [];
        }),
      )
      .subscribe({
        next: (results) => {
          this.filteredCities = results
            .map((city) => ({
              ...city,
              isFavorite: this.isFavorite(city.Key),
            }))
            .sort((a, b) => {
              // Sort favorites first
              if (a.isFavorite && !b.isFavorite) return -1;
              if (!a.isFavorite && b.isFavorite) return 1;
              return 0;
            });
        },
        error: () => {
          this.filteredCities = [];
        },
      });

    this.locationService
      .getLocationByKey(LocationService.defaultCityCode)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((location) => {
        if (location) {
          this.locationService.selectedCity = location;
          this.searchControl.setValue(location.LocalizedName, {
            emitEvent: false,
          });
        }
      });
  }

  isFavorite(locationKey: string): boolean {
    return this.favoritesService
      .getFavorites()
      .some((fav) => fav.Key === locationKey);
  }

  toggleFavorite(city: Location, event: Event): void {
    event.preventDefault();
    if (this.isFavorite(city.Key)) {
      this.favoritesService.removeFromFavorites(city.Key);
    } else {
      this.favoritesService.addToFavorites(city);
    }
    this.filteredCities = this.filteredCities.map((c) =>
      c.Key === city.Key ? { ...c, isFavorite: !c.isFavorite } : c,
    );
  }

  onKeydown(event: KeyboardEvent) {
    this.isNotEnglishLetter = false;
    const isEnglish = this.validateEnglishLetters(event.key);
    if (!isEnglish && event.key.length === 1) {
      event.preventDefault();
      this.isNotEnglishLetter = true;
    }
  }

  onPaste(event: ClipboardEvent): void {
    const pastedText = event.clipboardData?.getData('text') || '';
    const isEnglish = this.validateEnglishLetters(pastedText);
    if (!isEnglish) {
      event.preventDefault();
      this.isNotEnglishLetter = true;
    } else {
      this.isNotEnglishLetter = false;
    }
  }

  private validateEnglishLetters(text: string): boolean {
    const regex = /^[a-zA-Z\s]*$/;
    return regex.test(text);
  }

  onSelectCity(selectedLocalizedName: string): void {
    const city = this.filteredCities.find(
      (city) => city.LocalizedName === selectedLocalizedName,
    );
    this.isNotEnglishLetter = false;
    this.locationService.selectedCity = city;
  }
}
