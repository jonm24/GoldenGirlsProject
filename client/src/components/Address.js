import Autocomplete from "react-google-autocomplete";
const api_key = process.env.REACT_APP_GOOGLE_API_KEY;
const AutocompleteAddress = () => {
  return (
    <Autocomplete
      apiKey={api_key}
      onPlaceSelected={(place) => {
        console.log(place);
      }}
      options={{
        types: ["address"],
      }}
    />
  );
};

export default AutocompleteAddress;
