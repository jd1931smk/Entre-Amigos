import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import { OpenStreetMapProvider } from 'leaflet-geosearch';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import { LatLng } from 'leaflet';
import toast from 'react-hot-toast';

interface AddressSearchProps {
  onAddressSelect: (address: string, coordinates: { lat: number; lng: number }) => void;
}

function MapUpdater({ center }: { center: LatLng }) {
  const map = useMap();
  map.setView(center, map.getZoom());
  return null;
}

export default function AddressSearch({ onAddressSelect }: AddressSearchProps) {
  // Medellín coordinates: 6.2442° N, 75.5812° W
  const MEDELLIN_COORDS = new LatLng(6.2442, -75.5812);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState<Array<{ label: string; x: number; y: number }>>([]);
  const [selectedLocation, setSelectedLocation] = useState<LatLng>(MEDELLIN_COORDS);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  const provider = new OpenStreetMapProvider({
    params: {
      'accept-language': 'es', // Spanish language results
      countrycodes: 'co' // Restrict to Colombia
    }
  });

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
      return;
    }

    setIsSearching(true);
    try {
      // Add "Medellín" to the search query if it's not already included
      const searchTerm = searchQuery.toLowerCase().includes('medellín') || 
                        searchQuery.toLowerCase().includes('medellin')
        ? searchQuery
        : `${searchQuery}, Medellín, Colombia`;
        
      const results = await provider.search({ query: searchTerm });
      
      if (results.length === 0) {
        toast.error('No se encontraron direcciones. Por favor intente de nuevo.');
        return;
      }

      setSuggestions(results);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Search error:', error);
      toast.error('No se pudo buscar direcciones. Por favor intente de nuevo.');
    } finally {
      setIsSearching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    if (!e.target.value.trim()) {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSearch();
    }
  };

  const handleSelectAddress = (suggestion: { label: string; x: number; y: number }) => {
    try {
      const coordinates = { lat: suggestion.y, lng: suggestion.x };
      setSelectedLocation(new LatLng(coordinates.lat, coordinates.lng));
      setSearchQuery(suggestion.label);
      setSuggestions([]);
      setShowSuggestions(false);
      onAddressSelect(suggestion.label, coordinates);
      toast.success('Dirección seleccionada exitosamente');
    } catch (error) {
      console.error('Error selecting address:', error);
      toast.error('No se pudo seleccionar la dirección. Por favor intente de nuevo.');
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 mb-1">
        <MapPin size={16} />
        <label className="block text-sm font-medium text-gray-700">
          Dirección de Entrega
        </label>
      </div>
      
      <div className="relative">
        <div className="flex gap-2">
          <input
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            onKeyPress={handleKeyPress}
            placeholder="Buscar dirección en Medellín"
            className="w-full p-2 border rounded-lg"
            disabled={isSearching}
          />
          <button
            onClick={handleSearch}
            disabled={isSearching || !searchQuery.trim()}
            className={`px-4 py-2 bg-beige-600 text-white rounded-lg hover:bg-beige-700 transition-colors ${
              (isSearching || !searchQuery.trim()) ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isSearching ? 'Buscando...' : 'Buscar'}
          </button>
        </div>
        
        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
            {suggestions.map((suggestion, index) => (
              <li
                key={index}
                onClick={() => handleSelectAddress(suggestion)}
                className="px-4 py-2 hover:bg-beige-50 cursor-pointer text-sm"
              >
                {suggestion.label}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className="h-64 rounded-lg overflow-hidden">
        <MapContainer
          center={selectedLocation}
          zoom={13}
          scrollWheelZoom={false}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={selectedLocation} />
          <MapUpdater center={selectedLocation} />
        </MapContainer>
      </div>
    </div>
  );
}