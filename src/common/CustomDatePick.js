import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider, DatePicker as MuiDatePicker } from "@mui/x-date-pickers";

const CustomDatePick = ({onChange, objectKey, value,disabled, minDate, format}) => {
    return (<LocalizationProvider dateAdapter={AdapterDateFns}>
        <MuiDatePicker
            onChange={(date) => onChange(date, objectKey)}
            value={value}
            disabled={disabled}
            format= {!format ?"dd/MM/yyyy":format}
            minDate={minDate}
            slotProps={{
                textField: {
                    variant: 'filled',
                    size: 'small',
                    sx: {
                        '& .MuiInputBase-input': {
                            paddingTop: 0,
                            paddingLeft: '5px',
                            color: 'black',
                            fontSize: '13px',
                        },
                        '&. MuiFormHelperText-root': {
                            color: 'red !important'
                        },
                        '& .MuiFormControl-root': {
                            fontSize: '13px',
                            fontWeight: 400,
                            color: 'black',
                            marginTop:'0.3rem'
                        }, 
                        '& .MuiInputBase-root,Mui-disabled': {
                            backgroundColor: 'white !important'
                        }
                    },
                    placeholder: 'dd/mm/yyyy'
                }
            }}
        />
    </LocalizationProvider>
    )
}

export default CustomDatePick;