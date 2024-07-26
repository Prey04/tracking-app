import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Location } from './location.model'; // Import the Location interface

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  private apiUrl = 'http://10.182.2.189:9000/locationapi/get/';  // Update this URL if needed

  constructor(private http: HttpClient) { }

  getLocations(): Observable<Location[]> {
    return this.http.get<Location[]>(this.apiUrl); // Use the Location interface here
  }
}
