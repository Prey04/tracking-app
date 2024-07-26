import { Component, OnInit } from '@angular/core';
import { LocationService } from './location.service';

declare var mappls: any; // Assuming mappls library is available globally

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  map: any;
  marker: any;
  routeCoordinates: any[] = [];
  currentLocationIndex: number = 0;

  constructor(private locationService: LocationService) {}

  ngOnInit() {
    this.initMap();
    this.trackLocations();
  }

  initMap() {
    this.map = new mappls.Map('map', {
      center: [27.32538542837881, 88.61188786599105], // Initial map center
      zoom: 15
    });
  }

  trackLocations() {
    this.fetchAndUpdateLocations();

    setInterval(() => {
      this.fetchAndUpdateLocations();
    }, 3000); // Update location every 3 seconds
  }

  fetchAndUpdateLocations() {
    this.locationService.getLocations().subscribe(locations => {
      this.updateMarkers(locations);
      // this.updateRoute(locations);
    });
  }

  updateMarkers(locations: any[]) {
    // Remove the existing marker if it exists
    if (this.marker) {
      this.marker.remove();
    }

    // Add a new marker at the latest location
    if (locations.length > 0) {
      const latestLocation = locations[locations.length - 1];
      this.marker = new mappls.Marker({
        map: this.map,
        position: [latestLocation.latitude, latestLocation.longitude],
        popupHTML: `ID: ${latestLocation.device_id}`
      });

      // Center the map on the latest location
      // this.map.setCenter([latestLocation.longitude, latestLocation.latitude]);
    }
  }

  updateRoute(locations: any[]) {
    this.routeCoordinates = locations.map(location => [location.longitude, location.latitude]);

    if (this.map.getSource('route')) {
      this.map.removeLayer('route');
      this.map.removeSource('route');
    }

    this.map.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          properties: {},
          geometry: {
            type: 'LineString',
            coordinates: this.routeCoordinates
          }
        }
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round'
      },
      paint: {
        'line-color': '#3887be', // Color for the route
        'line-width': 8
      }
    });
  }
}
