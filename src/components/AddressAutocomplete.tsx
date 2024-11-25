import React from 'react';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { MapPin } from 'lucide-react';

interface AddressAutocompleteProps {
  onAddressSelect: (address: string, coordinates: { lat: number; lng: number }) => void;
}

export default function AddressAutocomplete({ onAddressSelect }: AddressAutocompleteProps) {
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      componentRestrictions: { country: "us" }, // Restrict to US addresses
    },
    debounce: 300,
  });

  const handleSelect = async (address: string) => {
    setValue(address, false);
    clearSuggestions();

    try {
      const results = await getGeocode({ address });
      const { lat, lng } = await getLatLng(results[0]);
      onAddressSelect(address, { lat, lng });
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center gap-2 mb-1">
        <MapPin size={16} />
        <label className="block text-sm font-medium text-gray-700">
          Delivery Address
        </label>
      </div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        disabled={!ready}
        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-beige-400 focus:ring focus:ring-beige-200 focus:ring-opacity-50"
        placeholder="Enter your address"
      />
      {status === "OK" && (
        <ul className="absolute z-10 w-full bg-white mt-1 rounded-md shadow-lg max-h-60 overflow-auto">
          {data.map(({ place_id, description }) => (
            <li
              key={place_id}
              onClick={() => handleSelect(description)}
              className="px-4 py-2 hover:bg-beige-50 cursor-pointer text-sm"
            >
              {description}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}