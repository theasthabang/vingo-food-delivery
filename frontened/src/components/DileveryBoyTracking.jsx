import React from 'react'
import scooter from "../assets/scooter.png"
import home from "../assets/home.png"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import { MapContainer, Marker, Polyline, Popup, TileLayer } from 'react-leaflet'

const deliveryBoyIcon = new L.Icon({ iconUrl: scooter, iconSize: [38, 38], iconAnchor: [19, 38] })
const customerIcon = new L.Icon({ iconUrl: home, iconSize: [38, 38], iconAnchor: [19, 38] })

const css = `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@500;600;700&display=swap');
.dbt {
  font-family: 'Inter', sans-serif;
  width: 100%; margin-top: 14px;
  border-radius: 16px; overflow: hidden;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 2px 8px rgba(0,0,0,0.05), 0 8px 28px rgba(0,0,0,0.06);
}
.dbt-bar {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 14px; background: #fff;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
.dbt-pulse {
  width: 8px; height: 8px; border-radius: 50%; background: #22c55e; flex-shrink: 0;
  box-shadow: 0 0 0 3px rgba(34,197,94,0.2);
  animation: dbPulse 1.6s infinite;
}
@keyframes dbPulse {
  0%,100%{ box-shadow:0 0 0 3px rgba(34,197,94,0.18); }
  50%{ box-shadow:0 0 0 6px rgba(34,197,94,0.06); }
}
.dbt-title { font-size: 0.78rem; font-weight: 700; color: #111; }
.dbt-sub { font-size: 0.68rem; color: #bbb; margin-left: auto; }
.dbt-map { width: 100%; height: 350px; }
`;

function DeliveryBoyTracking({ data }) {
  const dbLat = data.deliveryBoyLocation.lat
  const dbLon = data.deliveryBoyLocation.lon
  const cLat = data.customerLocation.lat
  const cLon = data.customerLocation.lon

  return (
    <>
      <style>{css}</style>
      <div className="dbt">
        <div className="dbt-bar">
          <div className="dbt-pulse" />
          <span className="dbt-title">Live Tracking</span>
          <span className="dbt-sub">Order on its way 🛵</span>
        </div>
        <MapContainer className="dbt-map" center={[dbLat, dbLon]} zoom={16}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[dbLat, dbLon]} icon={deliveryBoyIcon}><Popup>Delivery Partner</Popup></Marker>
          <Marker position={[cLat, cLon]} icon={customerIcon}><Popup>Your Location</Popup></Marker>
          <Polyline positions={[[dbLat, dbLon], [cLat, cLon]]} color="#ff4d2d" weight={3} dashArray="8 5" />
        </MapContainer>
      </div>
    </>
  )
}

export default DeliveryBoyTracking