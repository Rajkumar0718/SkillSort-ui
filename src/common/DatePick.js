import { LocalizationProvider, DatePicker as MuiDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';


export default function DatePick ({className, style, views, minDate, maxDate, value, inputProps, onChange, format,disabled, onError})  {
    return (
      <LocalizationProvider dateAdapter={AdapterDayjs} >
      <DemoContainer components={['DatePicker']}>
        <MuiDatePicker
          views={views}
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
              height: "2rem",
            },
            '& .MuiSvgIcon-root': {
              color: '#3b489e', // Change the ornament color to white
            },
            '& .MuiInputBase-root' : {
              // width: 250
              width: style?.width ? style?.width : 250,
              background:'none'
            }
          },

          className:{className}
         } }}
/>

        </DemoContainer>
      </LocalizationProvider>
    );
  };
