import React, { useRef, useCallback, useState } from "react";
import { useGeolocateControl, useNavigationControl, useStyleURL, useMap, useGenerateUserMarker, useMapCircle } from "../hooks/MapHooks";
import { useSocket } from "../hooks/Sockethook";

const API_KEY = "k6U5mW2FpsveK6wUbEU7TZw7BctFVfZoKDPKcGhx";

function Mapfile({ userId, familyId }) {
    const mapContainer = useRef(null);
    const styleURL = useStyleURL("liberty");
    
    const [usersData, setUsersData] = useState([]);  // State for family members' locations

    const transformRequest = useCallback((url, resourceType) => {
        url = url.replace("app.olamaps.io", "api.olamaps.io");
        const separator = url.includes("?") ? "&" : "?";
        return { url: `${url}${separator}api_key=${API_KEY}`, resourceType };
    }, []);

    const map = useMap(mapContainer, styleURL || "", transformRequest);
    useGeolocateControl(map);
    useNavigationControl(map);

    // WebSocket Hook (Family-Based Tracking)
    useSocket(setUsersData, userId, familyId);

    // Show only family members on the map
    useGenerateUserMarker(map, "#3d74cc", usersData);

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
