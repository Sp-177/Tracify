import { useState, useEffect, useRef } from 'react';
import {Map as MapLibreMap ,  NavigationControl, GeolocateControl, Marker, Popup } from 'maplibre-gl';
import * as turf from '@turf/turf';
import 'maplibre-gl/dist/maplibre-gl.css';

const useStyleURL = (STYLE_NAME) => {
  const [styleURL, setStyleURL] = useState(null);
  
  useEffect(() => {
    const fetchStyleURL = async () => {
      try {
        const url = `https://tiles.openfreemap.org/styles/${STYLE_NAME}`;
        setStyleURL(url);
      } catch (error) {
        console.error('Error fetching style URL:', error);
      }
    };
    
    fetchStyleURL();
  }, [STYLE_NAME]);
  
  return styleURL;
};

const useMap =  (mapContainer, styleURL, transformRequest) => {
  const [map, setMap] = useState(null);

  useEffect(() => {
    if (map || !styleURL || !mapContainer?.current) return;

    const newMap =  new MapLibreMap({
      container: mapContainer.current,
      style: styleURL,
      center: [0, 0],
      zoom: 7,
      transformRequest: transformRequest || ((url) => ({ url })),
    });

    setMap(newMap);
    return () => newMap.remove();
  }, [styleURL, transformRequest]);
  console.log("Map Url Generated");
  return map;
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
    console.log(geolocate);
    
    map.on("load", () => {
      geolocate.trigger();
      geolocate.on("error", () => {
        console.log("An error event has occurred.");
      });
    });
  }, [map]);
  console.log("user geoLocation Generated");
  return true;
};

const useNavigationControl = (map) => {
  useEffect(() => {
    if (!map) return;
    map.addControl(new NavigationControl({ visualizePitch: false, showCompass: true }), "bottom-left");
  }, [map]);
  return 1;
};
const useGenerateUserMarker = (map, color, userData) => {
  useEffect(() => {
    if (!map || !userData) return;
    
    const popup = new Popup({ closeButton: false, closeOnClick: false })
      .setHTML(
        `<div class="p-2 text-sm bg-white shadow-lg rounded-lg">
          <strong class="text-lg text-gray-900">${userData.reportedby}</strong><br/>
          <span class="text-gray-700">${userData.Contact_details}</span><br/>
          <span class="text-gray-500">Location: (${userData.latitude}, ${userData.longitude})</span>
        </div>`
      );
    const marker = new Marker({ color : color })
      .setLngLat([userData.longitude, userData.latitude])
      .addTo(map);
      
    
    map.flyTo({ center: [userData.longitude, userData.latitude], zoom: 14 });
    marker.getElement().addEventListener("mouseenter", () => {
      popup.setLngLat([userData.longitude, userData.latitude]).addTo(map);
    });

    marker.getElement().addEventListener("mouseleave", () => {
      popup.remove();
    });
    
    return () => {
      marker.remove();
      popup.remove();
    };
  }, [map, color, userData]);
  console.log("User Generated User Marker");
  return 1;
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

export { useStyleURL, useMap, useGeolocateControl, useNavigationControl , useGenerateUserMarker,useMapCircle};