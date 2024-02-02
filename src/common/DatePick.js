import { LocalizationProvider, DatePicker as MuiDatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { enGB } from 'date-fns/locale';


export default function DatePick ({className, style, views, minDate, maxDate, value, inputProps, onChange})  {

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={enGB}>
        <MuiDatePicker
          className={className}
          views={views}
          slotProps={{ textField: { variant: 'filled' } }}
          minDate={minDate}
          maxDate={maxDate}
          value={value}
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
              width:'12rem',
              background: 'none'
            }
          }}
        />
      </LocalizationProvider>
    );
  };
