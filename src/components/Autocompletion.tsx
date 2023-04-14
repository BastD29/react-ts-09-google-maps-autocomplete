import React, { useState } from "react";
import { LoadScript, Autocomplete } from "@react-google-maps/api";
import { Form, Input } from "antd";
import { useForm } from "antd/es/form/Form";

interface Location {
  address: string;
  latitude: number;
  longitude: number;
}

type Libraries =
  | "places"
  | "drawing"
  | "geometry"
  | "localContext"
  | "visualization";

// const libraries = ["places"];

const places: Libraries[] = ["places"];

const GoogleMapsAutocompleteExample: React.FC = () => {
  const [form] = useForm();

  const [location, setLocation] = useState<Location>({
    address: "",
    latitude: 0,
    longitude: 0,
  });
  const [autocomplete, setAutocomplete] =
    useState<google.maps.places.Autocomplete>();

  const [placeSelected, setPlaceSelected] = useState(false);

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    const formattedAddress = place.formatted_address ?? "";
    const latitude = place.geometry?.location?.lat() ?? 0;
    const longitude = place.geometry?.location?.lng() ?? 0;
    setLocation({ address: formattedAddress, latitude, longitude });
    form.setFieldsValue({
      address: formattedAddress,
    });
    setPlaceSelected(true);
  };

  return (
    <LoadScript googleMapsApiKey="YOUR_GOOGLE_API_KEY" libraries={places}>
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

      <Form.Item label="Latitude">
        <Input id="latitude" type="number" value={location.latitude} readOnly />
      </Form.Item>

      <Form.Item label="Longitude">
        <Input
          id="longitude"
          type="number"
          value={location.longitude}
          readOnly
        />
      </Form.Item>
    </LoadScript>
  );
};

export default GoogleMapsAutocompleteExample;
