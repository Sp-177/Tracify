import React, { useRef, useCallback } from "react";
import { useGeolocateControl, useNavigationControl, useStyleURL, useMap, useGenerateUserMarker, useMapCircle } from "../hooks/MapHooks";

const API_KEY = "k6U5mW2FpsveK6wUbEU7TZw7BctFVfZoKDPKcGhx";

function Mapfile() {
    const userdata = {
        image : "Sample url",
        reportedby : "Ujjwal Agrawal",
        Contact_details : "8103094352",
        longitude : 81.6077,
        latitude : 21.2452
    }
    const transformRequest = useCallback((url, resourceType) => {
      url = url.replace("app.olamaps.io", "api.olamaps.io");
      const separator = url.includes("?") ? "&" : "?";
      return {
        url: `${url}${separator}api_key=${API_KEY}`,
        resourceType,
      };
    }, []);
  
    const styleURL = useStyleURL("default-dark-standard");
    const mapContainer = useRef(null);
    
    // Wait until styleURL is available
    const map = useMap(mapContainer, styleURL || "", transformRequest);
    
    const a = useGeolocateControl(map);
    let b = 0,c= 0;
    if(a){b = useNavigationControl(map);}
    // if(b){
    //   c = useGenerateUserMarker(map,"#3d74cc",userdata);;
    // }
    // if(c){
    //   useMapCircle(map,[userdata.longitude,userdata.latitude],2);
    // }
    // Add user Hook in the Data
    
    
    if (!styleURL) {
      return <div>Loading Map...</div>;
    }
  
    return (
      <div className="w-screen h-screen overflow-hidden relative">
        <div ref={mapContainer} className="w-full h-full" />
      </div>
    );
  }

  

export default Mapfile;