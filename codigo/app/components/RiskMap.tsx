'use client';

import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, LayersControl, CircleMarker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { RegionResponse, RiskLevel } from '@/lib/types';

// Fix for default marker icons in Leaflet + Next.js
const DefaultIcon = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

interface RiskMapProps {
  data: RegionResponse;
}

const RiskMap: React.FC<RiskMapProps> = ({ data }) => {
  const getRiskColor = (level: RiskLevel) => {
    if (level === 'ALTO') return '#EF4444';
    if (level === 'MEDIO') return '#F59E0B';
    return '#10B981';
  };

  const companiesWithCoords = data.companies.filter(
    (c) => typeof c.latitude === 'number' && typeof c.longitude === 'number'
  );
  const conflictsWithCoords = data.conflicts.filter(
    (c) => typeof c.latitude === 'number' && typeof c.longitude === 'number'
  );
  const projectsWithCoords = data.projects.filter(
    (p) => typeof p.latitude === 'number' && typeof p.longitude === 'number'
  );

  // Center of Peru if no data, otherwise center of first valid company
  const center: [number, number] = companiesWithCoords.length > 0
    ? [companiesWithCoords[0].latitude, companiesWithCoords[0].longitude]
    : [-9.19, -75.015];

  return (
    <div className="h-full w-full relative z-0">
      <MapContainer 
        center={center} 
        zoom={10} 
        scrollWheelZoom={true} 
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <LayersControl position="topright">
          <LayersControl.Overlay checked name="Empresas Mineras">
            <>
              {companiesWithCoords.map((c) => (
                <CircleMarker
                  key={c.ruc}
                  center={[c.latitude, c.longitude]}
                  radius={8}
                  pathOptions={{ 
                    fillColor: getRiskColor(c.riskLevel), 
                    color: '#fff', 
                    weight: 2, 
                    fillOpacity: 0.8 
                  }}
                >
                  <Popup>
                    <div className="p-1">
                      <p className="font-bold text-slate-900">{c.razonSocial}</p>
                      <p className="text-xs text-slate-500">RUC: {c.ruc}</p>
                      <p className={`mt-2 text-[10px] font-black uppercase text-center rounded py-0.5 ${
                        c.riskLevel === 'ALTO' ? 'bg-rose-100 text-rose-700' :
                        c.riskLevel === 'MEDIO' ? 'bg-amber-100 text-amber-700' : 'bg-emerald-100 text-emerald-700'
                      }`}>
                        RIESGO {c.riskLevel}
                      </p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Conflictos Sociales">
             <>
              {conflictsWithCoords.map((c, i) => (
                <Marker
                  key={i}
                  position={[c.latitude, c.longitude]}
                >
                  <Popup>
                    <div className="p-1">
                      <p className="font-bold text-slate-900">Conflicto Social</p>
                      <p className="text-xs text-slate-600">{c.description}</p>
                      <span className="mt-1 inline-block text-[10px] font-bold text-rose-600 uppercase">Estado: {c.status}</span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </>
          </LayersControl.Overlay>

          <LayersControl.Overlay name="Inversión Pública">
             <>
              {projectsWithCoords.map((p, i) => (
                <CircleMarker
                  key={i}
                  center={[p.latitude, p.longitude]}
                  radius={5}
                  pathOptions={{ fillColor: '#b45309', color: '#fff', weight: 1, fillOpacity: 0.6 }}
                >
                  <Popup>
                    <div className="p-1">
                      <p className="font-bold text-slate-900">{p.name}</p>
                      <p className="text-xs font-bold text-amber-700">Presupuesto: S/ {p.budget.toLocaleString()}</p>
                    </div>
                  </Popup>
                </CircleMarker>
              ))}
            </>
          </LayersControl.Overlay>
        </LayersControl>
      </MapContainer>
    </div>
  );
};

export default RiskMap;
