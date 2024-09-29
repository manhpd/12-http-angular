import { Injectable, signal } from '@angular/core';

import { Place } from './place.model';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, pipe, tap, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PlacesService {
  constructor(private _http: HttpClient) {

  }
  private userPlaces = signal<Place[]>([]);

  loadedUserPlaces = this.userPlaces.asReadonly();

  loadAvailablePlaces() {
    return this.fetchPlaces('http://localhost:3000/places', 'Could not fetch places');
  }

  loadUserPlaces() {
    return this.fetchPlaces('http://localhost:3000/user-places', 'Could not fetch user places').pipe(
      tap((places) => {
        this.userPlaces.set(places);
      })
    );
  }

  addPlaceToUserPlaces(place: Place) {
    const prePlaces = this.userPlaces();
    if (!prePlaces.some((p) => p.id === place.id)) {
      this.userPlaces.set([...prePlaces, place]);
    }
    return this._http.put<{userPlaces: Place[]}>('http://localhost:3000/user-places', {
      placeId: place.id,
    }).pipe(
      catchError((err) => throwError(() => {
        this.userPlaces.set(prePlaces);
        return new Error('Failed to add place to user places')
    }))
    );
  }

  removeUserPlace(place: Place) {
    const prePlaces = this.userPlaces();
    const newPlaces = prePlaces.filter((p) => p.id !== place.id);
    if (newPlaces.length !== prePlaces.length) {
      this.userPlaces.set(newPlaces);
    }
    this.userPlaces.set(newPlaces);
    return this._http.delete(`http://localhost:3000/user-places/${place.id}`).pipe(
      catchError((err) => throwError(() => {
        this.userPlaces.set(prePlaces);
        return new Error('Failed to remove place from user places');
      })
      )
    );
  }

  private fetchPlaces(url: string, error: string) {
    return this._http.get<{ places: Place[] }>(url)
    .pipe(
      map((res) => res.places),
      catchError((err) => 
        throwError(() => new Error(err))
      )
    );
  }
}
