type GeocoderResult = google.maps.GeocoderResult[];

type A = {
  (results: GeocoderResult, status: google.maps.GeocoderStatus): void;
};

type B = {
  (a: GeocoderResult[] | null, b: GeocoderStatus): void;
};
