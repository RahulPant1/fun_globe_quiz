// src/components/Globe.jsx
window.CESIUM_BASE_URL = '/node_modules/cesium/Build/Cesium/';
import React, { useRef, useEffect } from 'react';
import {
  Viewer,
  Cartesian3,
  createWorldTerrainAsync,
  PointGraphics,
  Color,
  ScreenSpaceEventHandler,
  ScreenSpaceEventType,
  defined,
  Entity,
  Ion,
  createWorldImageryAsync
} from 'cesium';
import 'cesium/Build/Cesium/Widgets/widgets.css';

// Set Cesium Ion access token from environment variable
Ion.defaultAccessToken = import.meta.env.VITE_CESIUM_ION_TOKEN;

// Add onBackgroundClick to the props destructuring
const Globe = ({ locations, selectedLocation, onLocationClick, onBackgroundClick }) => {
  const cesiumContainerRef = useRef(null);
  const viewerRef = useRef(null);
  const entitiesRef = useRef([]);

  // Effect for initializing the Cesium Viewer
  useEffect(() => {
    if (cesiumContainerRef.current && !viewerRef.current) {
      // Initialize the viewer with proper configuration
      const viewer = new Viewer(cesiumContainerRef.current, {
        // Use default Cesium Ion imagery
        imageryProvider: undefined, // Let Cesium use the default
        terrainProvider: undefined,
        // terrainProvider: createWorldTerrainAsync(),
        // Disable unnecessary UI elements for the game
        animation: false,
        baseLayerPicker: false,
        fullscreenButton: false,
        geocoder: false,
        homeButton: false,
        infoBox: false,
        sceneModePicker: false,
        selectionIndicator: false,
        timeline: false,
        navigationHelpButton: false,
        shouldAnimate: true, // Keep animations running
      });

      viewerRef.current = viewer;

      // Improve visual quality
      viewer.scene.globe.enableLighting = true;
      viewer.scene.fog.enabled = true;
      viewer.scene.fog.density = 0.0002;
      viewer.scene.skyAtmosphere.hueShift = -0.08;
      viewer.scene.skyAtmosphere.saturationShift = -0.2;
      viewer.scene.skyAtmosphere.brightnessShift = -0.05;
      
      // Initialize with default imagery if needed
      // createWorldImageryAsync().then(imageryProvider => {
      //   viewer.imageryLayers.addImageryProvider(imageryProvider);
      // });
    }

    // Cleanup function to destroy the viewer when the component unmounts
    return () => {
      if (viewerRef.current) {
        viewerRef.current.destroy();
        viewerRef.current = null;
        entitiesRef.current = [];
      }
    };
  }, []);

  // Effect for adding/updating location points on the globe
  useEffect(() => {
    const viewer = viewerRef.current;
    if (viewer && locations) {
      // Clear previously added entities to avoid duplicates
      entitiesRef.current.forEach(entity => viewer.entities.remove(entity));
      entitiesRef.current = [];

      // Add new entities for each location
      locations.forEach(location => {
        const position = Cartesian3.fromDegrees(location.longitude, location.latitude);
        const pointEntity = viewer.entities.add({
          position: position,
          id: `location-${location.id}`,
          properties: {
             locationData: location
          },
          point: new PointGraphics({
            pixelSize: 10,
            color: Color.RED,
            outlineColor: Color.WHITE,
            outlineWidth: 2,
          }),
        });
        entitiesRef.current.push(pointEntity);
      });
    }
  }, [locations]); // Remove viewerRef.current from dependencies

  // Effect for handling clicks on the globe to select locations
  useEffect(() => {
    const viewer = viewerRef.current;
    // Add onBackgroundClick to the dependency check
    if (!viewer || (!onLocationClick && !onBackgroundClick)) return;

    const handler = new ScreenSpaceEventHandler(viewer.scene.canvas);

    handler.setInputAction((movement) => {
      const pickedObject = viewer.scene.pick(movement.position);

      // Check if an entity with location data was clicked
      if (defined(pickedObject) && pickedObject.id instanceof Entity && pickedObject.id.id?.startsWith('location-')) {
         if (pickedObject.id.properties && pickedObject.id.properties.locationData && onLocationClick) {
            const clickedLocation = pickedObject.id.properties.locationData.getValue(viewer.clock.currentTime);
            console.log("Clicked Location Entity:", clickedLocation);
            if(clickedLocation) {
                onLocationClick(clickedLocation); // Call the existing handler
            }
         }
      } else if (onBackgroundClick) {
        // If nothing specific was picked, assume background click
        console.log("Clicked on globe background.");
        onBackgroundClick(); // Call the new handler for background clicks
      }
    }, ScreenSpaceEventType.LEFT_CLICK);

    return () => {
      handler.destroy();
    };
  // Add onBackgroundClick to the dependency array
  }, [onLocationClick, onBackgroundClick]);

  // Effect for flying the camera to the selected location
  useEffect(() => {
    const viewer = viewerRef.current;
    if (!viewer) {
        console.log("Fly effect: Viewer not ready yet."); // Log if viewer isn't ready
        return;
    }

    if (selectedLocation) {
      console.log("Fly effect: Flying to", selectedLocation.name); // Log when flying to a location
      const destination = Cartesian3.fromDegrees(
        selectedLocation.longitude,
        selectedLocation.latitude,
        1000000 // Fly-to height in meters (adjust as needed)
      );
      viewer.camera.flyTo({
        destination: destination,
        orientation: {
          heading: 0.0, // East, default orientation
          pitch: -Math.PI / 4, // Look down at a 45-degree angle
          roll: 0.0,
        },
        duration: 2.0, // Duration of the flight in seconds
      });
    } else {
      console.log("Fly effect: Flying home because selectedLocation is null."); // Log when flying home
      // Fly back to a default view when no location is selected
      viewer.camera.flyHome(2.0); // Fly back to the default home view
    }
  }, [selectedLocation]); // Re-run if selectedLocation changes

  // Render the div container for Cesium
  return (
    <div ref={cesiumContainerRef} id="cesiumContainer" className="w-full h-full" />
  );
};

export default Globe;