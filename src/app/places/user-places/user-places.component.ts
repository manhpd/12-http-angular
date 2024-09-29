import { Component, DestroyRef, inject, OnInit, signal } from '@angular/core';

import { PlacesContainerComponent } from '../places-container/places-container.component';
import { PlacesComponent } from '../places.component';
import { PlacesService } from '../places.service';
import { Place } from '../place.model';

@Component({
  selector: 'app-user-places',
  standalone: true,
  templateUrl: './user-places.component.html',
  styleUrl: './user-places.component.css',
  imports: [PlacesContainerComponent, PlacesComponent],
})
export class UserPlacesComponent implements OnInit{
  constructor(private _placesService: PlacesService) {}
  places = this._placesService.loadedUserPlaces;
  isFetching = signal<boolean>(false);
  error = signal('');
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.isFetching.set(true);
    const subscription = this._placesService.loadUserPlaces().subscribe({
      error: (err) => {
        // handle the error
        this.error.set(err.message);
      },
      complete: () => {
        // do something when the observable completes
        this.isFetching.set(false);
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }

  onRemovePlace(place: Place) {
    const subscription = this._placesService.removeUserPlace(place).subscribe({
      error: (err) => {
        // handle the error
        this.error.set(err.message);
      },
      complete: () => {
        // do something when the observable completes
      }
    });

    this.destroyRef.onDestroy(() => {
      subscription.unsubscribe();
    });
  }
}
