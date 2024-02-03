import { LocalizationProvider, DatePicker as MuiDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';


export default function DatePick ({className, views, minDate, maxDate, value, inputProps, onChange,format,placeholder,})  {

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
          label={placeholder}
          slotProps={{ textField: { variant: 'filled',size: "small",
          sx:{
            borderRadius: "3rem",
            '& .MuiInputBase-input': {
              backgroundColor: 'white',
              paddingTop:'0px !important',
              height: "2rem",
            },
            '& .MuiSvgIcon-root': {
              color: 'currentcolor'
            },
            '& .MuiInputBase-root' : {
              width:'12rem',
              background: 'none',
              position:"relative",
              bottom:"13px"
            }
          },

          className:{className}
         } }}
/>

        </DemoContainer>
      </LocalizationProvider>
    );
  };
