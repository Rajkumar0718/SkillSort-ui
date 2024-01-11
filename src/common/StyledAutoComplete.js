import Autocomplete from '@mui/material/Autocomplete';
import { styled } from '@mui/system';

const StyledAutocomplete = styled(Autocomplete)(({ theme, width }) => ({
    '& .MuiAutocomplete-listbox': {
      backgroundColor: 'white',
    },
    '& .MuiAutocomplete-option:hover': {
      backgroundColor: '#f05a28',
      color: 'white',
    },
    '& .MuiAutocomplete-option[data-focus="true"]': {
      backgroundColor: '#f05a28',
      color: 'white'
    },
    '& .MuiAutocomplete-option[data-focus="true"] .MuiAutocomplete-optionLabel': {
      color: 'white',
    },
    '& .MuiAutocomplete-option': {
      color: 'black',
    },
    '& .MuiInputBase-root':{
        width: width
    }
   }));
   

export default StyledAutocomplete;