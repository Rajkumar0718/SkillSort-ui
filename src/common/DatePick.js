import { DatePicker as MuiDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

export default function DatePick ({className, style, views, minDate, maxDate, value, inputProps, onChange, format,disabled, onError})  {
    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <MuiDatePicker
          className={className}
          views={views} 
          slotProps={{ textField: { variant: 'filled' } }}
          minDate={minDate}
          maxDate={maxDate}
          value={value}
          inputProps={inputProps}
          onChange={onChange}
          format={format}
          disabled={disabled}
          onError={onError}
          sx={{
            '& .MuiInputBase-input': {
              backgroundColor: 'white',
              paddingTop:'0px !important',
            },
            '& .MuiSvgIcon-root': {
              color: '#3b489e', // Change the ornament color to white
            },
            '& .MuiInputBase-root' : {
              // width: 250
              width: style?.width ? style?.width : 250,
              background:'none'
            }
          }}
        />
      </LocalizationProvider>
    );
  };