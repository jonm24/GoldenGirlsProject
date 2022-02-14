import Autocomplete from "react-google-autocomplete";

export default function AutoAddress({ setLocation }) {
  return (
    <Autocomplete
      className="modal-field"
      apiKey={process.env.REACT_APP_GOOGLE_API_KEY}
      onPlaceSelected={place => setLocation(place?.formatted_address)}
      options={{ 
        types: ["geocode", "establishment"]
      }}
    />
  );
};