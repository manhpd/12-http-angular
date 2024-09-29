import { Component, DestroyRef, inject, OnDestroy, OnInit, signal } from '@angular/core';

import { Place } from '../place.model';
import { PlacesComponent } from '../places.component';
import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesService } from '../places.service';
import { catchError, map, throwError } from 'rxjs';

@Component({
  selector: 'app-available-places',
  standalone: true,
  templateUrl: './available-places.component.html',
  styleUrl: './available-places.component.css',
  imports: [PlacesComponent, PlacesContainerComponent],
})

export class AvailablePlacesComponent implements OnInit {
  constructor(private _placesService: PlacesService) {}
  places = signal<Place[] | undefined>(undefined);
  isFetching = signal<boolean>(false);
  error = signal('');
  private destroyRef = inject(DestroyRef);

 
  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this._placesService.loadAvailablePlaces().subscribe({
      next: (places) => {
        this.places.set(places);
      },
      error: (err) => {
        this.error.set(err.message);
      },
      complete: () => {
        this.isFetching.set(false);
      }
    }); 

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
  
  onSelectPlace(place: Place) {
    const subscription = this._placesService.addPlaceToUserPlaces(place).subscribe({
      next: () => {
        // do something
      },
      error: (err) => {
        this.error.set(err.message);
      },
      complete: () => {
        // do something
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
