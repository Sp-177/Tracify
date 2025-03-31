import { useState, useEffect, useRef ,useMemo } from 'react';
import {Map as MapLibreMap ,  NavigationControl, GeolocateControl, Marker, Popup , LngLatBounds } 
from 'maplibre-gl';
import * as turf from '@turf/turf';
import 'maplibre-gl/dist/maplibre-gl.css';

const useMap = (mapContainer) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map || !mapContainer?.current) return;

    const newMap = new MapLibreMap({
      container: mapContainer.current,
      style: {
        version: 8,
        sources: {
          osm: {
            type: "raster",
            tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
            tileSize: 256,
            attribution: "&copy; OpenStreetMap contributors",
          },
        },
        layers: [
          {
            id: "osm-layer",
            type: "raster",
            source: "osm",
            minzoom: 0,
            maxzoom: 19,
          },
        ],
      },
      center: [78.9629, 22.5937], // Center on India
      zoom: 4,
      minZoom: 2, // Prevent excessive zooming out
      maxZoom: 18, // Prevent white screen issue
      maxBounds: [
        [60, 5], // Southwest bounds (approximate India coverage)
        [100, 40], // Northeast bounds
      ],
    });

    // Enforce zoom limits
    newMap.on("zoomend", () => {
      if (newMap.getZoom() > 18) {
        newMap.setZoom(18);
      }
      if (newMap.getZoom() < 1) {
        newMap.setZoom(1);
      }
    });

    setMap(newMap);

    return () => {
      newMap.off("zoomend"); // Cleanup event listener
      newMap.remove(); // Destroy map instance
    };
  }, []);

  return useMemo(() => map, [map]);
};


const useGeolocateControl = (map) => {
  useEffect(() => {
    if (!map) return;
    const geolocate = new GeolocateControl({
      positionOptions: {
        enableHighAccuracy: true, 
      },
      trackUserLocation: true,
      showAccuracyCircle: true,
    });
    map.addControl(geolocate);
    
    map.on("load", () => {
      geolocate.trigger();
    });
  }, [map]);
  return true;
};

const useNavigationControl = (map) => {
  useEffect(() => {
    if (!map) return;
    map.addControl(new NavigationControl({ visualizePitch: false, showCompass: true }), "bottom-left");
  }, [map]);
  return 1;
};

const useGenerateUserMarker = (map, color, usersData, userFamily) => {
  useEffect(() => {
    if (!map || !usersData || !userFamily) {
      console.error("Please Upload all userData || userFamily error at useGenerateUserMarker");
      return;
    }

    const commonMembers = usersData.filter(user =>
      userFamily.some(member => member._id === user.userId)
    );

    const markers = [];
    const bounds = new LngLatBounds();

    commonMembers.forEach((userData) => {
      const familyMember = userFamily.find(member => member._id === userData.userId);
      if (!familyMember) return;

      console.log("Family member are", familyMember);

      const popup = new Popup({ closeButton: false, closeOnClick: false })
        .setHTML(
          `<div class="p-2 text-sm bg-white shadow-lg rounded-lg">
            <img src="${familyMember.avatar || 'default-avatar.png'}" alt="Avatar" class="w-12 h-12 rounded-full mb-2" />
            <strong class="text-lg text-gray-900">${familyMember.name}</strong><br/>
            <span class="text-gray-600">${familyMember.role}</span><br/>
            <span class="text-gray-600">Age: ${familyMember.age}</span><br/>
            <span class="text-gray-500">Location: (${userData.latitude}, ${userData.longitude})</span>
          </div>`
        );

      const marker = new Marker({ color })
        .setLngLat([userData.longitude, userData.latitude])
        .addTo(map);

      marker.getElement().addEventListener("mouseover", () => {
        marker.setPopup(popup).togglePopup();
      });

      marker.getElement().addEventListener("mouseout", () => {
        marker.getPopup().remove();
      });

      bounds.extend([userData.longitude, userData.latitude]);
      markers.push(marker);
    });

    // Adjust the map to fit all markers
    if (commonMembers.length > 0) {
      map.fitBounds(bounds, { padding: 50, maxZoom: 15, duration: 1000 });
    }

    console.log("Bounds:", bounds);

    return () => {
      markers.forEach(marker => marker.remove());
    };
  }, [map, usersData, userFamily]);
};




const useMapCircle = (map, centerCoordinates, radiusKm) => {
  useEffect(() => {
    if (!map || !centerCoordinates) return;

    const addCircleLayer = () => {
      const radius = radiusKm;
      const options = { steps: 64, units: 'kilometers' };
      const circle = turf.circle(centerCoordinates, radius, options);

      if (map.getSource('location-radius')) {
        map.getSource('location-radius').setData(circle);
      } else {
        map.addSource('location-radius', {
          type: 'geojson',
          data: circle
        });

        map.addLayer({
          id: 'location-radius',
          type: 'fill',
          source: 'location-radius',
          paint: {
            'fill-color': '#8CCFFF',
            'fill-opacity': 0.5
          }
        });

        map.addLayer({
          id: 'location-radius-outline',
          type: 'line',
          source: 'location-radius',
          paint: {
            'line-color': '#0094ff',
            'line-width': 3
          }
        });
      }
    };

    if (map.isStyleLoaded()) {
      addCircleLayer();
    } else {
      map.once('styledata', addCircleLayer);
    }

    return () => {
      if (map.getLayer('location-radius')) map.removeLayer('location-radius');
      if (map.getLayer('location-radius-outline')) map.removeLayer('location-radius-outline');
      if (map.getSource('location-radius')) map.removeSource('location-radius');
    };
  }, [map, centerCoordinates, radiusKm]);
  return true;
};

export { useMap, useGeolocateControl, useNavigationControl , useGenerateUserMarker,useMapCircle};