import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  GeoJSON,
  Tooltip,
  useMap,
} from "react-leaflet";
import L from "leaflet";
 
 
import "leaflet/dist/leaflet.css";

import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

/* ==========================================================
   CACHE
========================================================== */

const boundaryCache = new Map();

/* ==========================================================
   HELPERS
========================================================== */

async function fetchOsmBoundary(q) {
  if (!q) return null;

  if (boundaryCache.has(q)) return boundaryCache.get(q);

  const url = new URL("https://nominatim.openstreetmap.org/search");
  url.searchParams.set("q", q);
  url.searchParams.set("format", "jsonv2");
  url.searchParams.set("polygon_geojson", "1");
  url.searchParams.set("limit", "1");

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json" },
  });

  if (!res.ok) return null;

  const data = await res.json();
  const item = data?.[0];

  if (!item?.geojson) {
    boundaryCache.set(q, null);
    return null;
  }

  const feature = {
    type: "Feature",
    properties: {
      display_name: item.display_name,
    },
    geometry: item.geojson,
  };

  boundaryCache.set(q, feature);
  return feature;
}

/* ==========================================================
   FIT & RESIZE FIX
========================================================== */

function MapEffects({ coordinates, areaGeojson }) {
  const map = useMap();

  useEffect(() => {
    // 🔥 Forzar recalculo de tamaño
    setTimeout(() => {
      map.invalidateSize();
    }, 200);

    if (areaGeojson?.geometry) {
      const layer = L.geoJSON(areaGeojson);
      const bounds = layer.getBounds();
      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [20, 20] });
        return;
      }
    }

    if (coordinates?.lat && coordinates?.lng) {
      map.setView([coordinates.lat, coordinates.lng], 15);
    }
  }, [map, coordinates?.lat, coordinates?.lng, areaGeojson]);

  return null;
}

/* ==========================================================
   COMPONENT
========================================================== */



export default function MapView({ coordinates, address }) {

  const mapRef = useRef(null);
  const markerRef = useRef(null);

  useEffect(() => {

    if (!mapRef.current) {
      mapRef.current = L.map("map").setView(
        [coordinates.lat, coordinates.lng],
        15
      );

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "&copy; OpenStreetMap contributors",
      }).addTo(mapRef.current);
    }

    const map = mapRef.current;

    // 🔥 eliminar marcador anterior
    if (markerRef.current) {
      map.removeLayer(markerRef.current);
    }

    // crear nuevo marcador
    markerRef.current = L.marker([coordinates.lat, coordinates.lng])
      .addTo(map)
      .bindPopup(address)
      .openPopup();

    map.setView([coordinates.lat, coordinates.lng], 16);

  }, [coordinates]);

  return (
    <div
      id="map"
      style={{ height: "350px", width: "100%", borderRadius: "12px" }}
    />
  );
}
