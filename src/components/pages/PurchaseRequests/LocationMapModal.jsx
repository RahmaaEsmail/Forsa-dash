import React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../../ui/dialog";
import { Button } from "../../ui/button";
import { Input } from "../../ui/input";
import { Label } from "../../ui/label";
import { MapPin, LocateFixed } from "lucide-react";
import { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Fix for leaflet marker icon missing in some bundler setups
import L from "leaflet";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

function MapClickHandler({ setLat, setLng, fetchAddress }) {
  useMapEvents({
    click(e) {
      const newLat = e.latlng.lat;
      const newLng = e.latlng.lng;
      setLat(newLat);
      setLng(newLng);
      if (fetchAddress) fetchAddress(newLat, newLng);
    },
  });
  return null;
}

export default function LocationMapModal({ open, onOpenChange, onLocationSelected, initialLocation }) {
  const [address, setAddress] = useState(initialLocation?.address || "");
  const [lat, setLat] = useState(initialLocation?.lat || "");
  const [lng, setLng] = useState(initialLocation?.lng || "");
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    if (open) {
      setAddress(initialLocation?.address || "");
      setLat(initialLocation?.lat || "");
      setLng(initialLocation?.lng || "");
    }
  }, [open, initialLocation]);

  const fetchAddress = async (latitude, longitude) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
      );
      const data = await response.json();
      if (data && data.display_name) {
        setAddress(data.display_name);
      }
    } catch (error) {
      console.error("Error fetching address details", error);
    }
  };

  const handleCurrentLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLat = position.coords.latitude;
          const newLng = position.coords.longitude;
          setLat(newLat);
          setLng(newLng);
          fetchAddress(newLat, newLng);
          
          if (mapRef) {
             mapRef.flyTo([newLat, newLng], 14);
          }
        },
        (error) => {
          console.error("Error obtaining location", error);
        }
      );
    }
  };

  const handleSave = () => {
    if (onLocationSelected) {
      onLocationSelected({ address, lat, lng });
    }
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-primary" />
            Pick Delivery Location
          </DialogTitle>
        </DialogHeader>
        
        <div className="flex flex-col gap-4 py-4">
          <div className="flex justify-end">
             <Button type="button" variant="outline" size="sm" onClick={handleCurrentLocation} className="flex items-center gap-2">
                <LocateFixed className="w-4 h-4 text-primary" />
                Use Current Location
             </Button>
          </div>
          <div className="w-full h-[250px] bg-slate-100 rounded-lg border border-border flex items-center justify-center relative overflow-hidden">
             {open && (
               <MapContainer 
                 center={[lat || 24.7136, lng || 46.6753]} 
                 zoom={10} 
                 scrollWheelZoom={true}
                 style={{ height: "100%", width: "100%" }}
                 ref={setMapRef}
               >
                 <TileLayer
                   attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>'
                   url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                 />
                 <MapClickHandler setLat={setLat} setLng={setLng} fetchAddress={fetchAddress} />
                 {lat && lng && (
                   <Marker position={[lat, lng]} />
                 )}
               </MapContainer>
             )}
          </div>

          <div className="grid gap-2">
            <Label>Selected Address</Label>
            <Input 
               value={address} 
               onChange={(e) => setAddress(e.target.value)} 
               placeholder="e.g Riyadh Industrial Area" 
               className="bg-input-bg"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
                <Label>Latitude</Label>
                <Input 
                   type="number"
                   value={lat} 
                   onChange={(e) => setLat(e.target.value)} 
                   placeholder="24.7136" 
                   className="bg-input-bg"
                />
            </div>
            <div className="grid gap-2">
                <Label>Longitude</Label>
                <Input 
                   type="number"
                   value={lng} 
                   onChange={(e) => setLng(e.target.value)} 
                   placeholder="46.6753" 
                   className="bg-input-bg"
                />
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button type="button" onClick={handleSave}>
            Confirm Location
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
