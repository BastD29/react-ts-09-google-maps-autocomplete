import React, { useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { Input } from "antd";

interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

const GoogleMapsAutocompleteExample: React.FC = () => {
  const [location, setLocation] = useState<Location>({
    address: "",
    latitude: 0,
    longitude: 0,
  });
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete>();

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    const formattedAddress = place.formatted_address ?? "";
    const latitude = place.geometry?.location?.lat() ?? 0;
    const longitude = place.geometry?.location?.lng() ?? 0;
    setLocation({ address: formattedAddress, latitude, longitude });
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_API_KEY" libraries={["places"]}>
      <Autocomplete
        onLoad={(autocomplete) => setAutocomplete(autocomplete)}
        onPlaceChanged={() =>
          handlePlaceSelect(autocomplete?.getPlace() as any)
        }
      >
        <Input
          id="autocomplete"
          placeholder="Enter an address"
          value={location.address}
          onChange={(e) =>
            setLocation({ ...location, address: e.target.value })
          }
        />
      </Autocomplete>
      <div>
        <label htmlFor="latitude">Latitude:</label>
        <Input id="latitude" type="number" value={location.latitude} readOnly />
      </div>
      <div>
        <label htmlFor="longitude">Longitude:</label>
        <Input
          id="longitude"
          type="number"
          value={location.longitude}
          readOnly
        />
      </div>
    </LoadScript>
  );
};

export default GoogleMapsAutocompleteExample;
