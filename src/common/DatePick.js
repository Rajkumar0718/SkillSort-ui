import { LocalizationProvider, DatePicker as MuiDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { parseISO } from 'date-fns';
import { enGB } from 'date-fns/locale';


export default function DatePick({className, style, views, minDate, maxDate, value, inputProps, onChange }) {


    // Parse the value if it's a string in ISO format
    const parsedValue = typeof value === 'string' ? parseISO(value) : value;

    // Check if the parsed value is a valid date
    const isValidDate = parsedValue instanceof Date && !isNaN(parsedValue.valueOf());

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
        <MuiDatePicker
          className={className}
          views={views}
          slotProps={{ textField: { variant: 'filled' } }}
          minDate={minDate}
          maxDate={maxDate}
          value={isValidDate ? parsedValue:null}
          inputProps={inputProps}
          onChange={onChange}
          sx={{
            '& .MuiInputBase-input': {
              backgroundColor: 'white',
              paddingTop:'0px !important',
            },
            '& .MuiSvgIcon-root': {
              color: '#3b489e' // Change the ornament color to white
            },
            '& .MuiInputBase-root' : {
              width:'15.5rem',
              background: 'none'
            }
          }}
        />
      </LocalizationProvider>
    );
  };
