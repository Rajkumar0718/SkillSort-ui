import { styled } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';

// Define your styled component with the styles
const CustomAutocomplete = styled(Autocomplete)(({ theme }) => ({
  "& .MuiInputBase-input.MuiAutocomplete-input": {
    color: "white",
    borderColor: "white",
  },
  "& #custom-autocomplete-label": {
    color: 'red',
  },
}));

// Use your styled component instead of the original Autocomplete
export default function CustomAutoComplete({ suggestions, updatePackage, handleSearch }) {
  return (
    <CustomAutocomplete
      id="size-small-standard"
      size="small"
      options={suggestions}
      onChange={(_event, value) => updatePackage(value)}
      onInputChange={(e) => handleSearch(e.target.value)}
      getOptionLabel={(option) => option.package?.name + "-" + option.package?.version}
      sx={{ width: 300 }} // You can still use the sx prop here for additional styles
      ListboxProps={{
        style: {
          maxHeight: '200px',
          overflow: 'auto',
        },
      }}
      renderInput={(params) => (
        <TextField
          {...params}
          label="Search ..."
          size="small"
          InputLabelProps={{
            style: { color: 'white' },
          }}
        />
      )}
    />
  );
}
