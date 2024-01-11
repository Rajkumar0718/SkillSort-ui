import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Box } from '@mui/system';
import StyledAutocomplete from './StyledAutoComplete';
import { TextField } from '@mui/material';

const theme = createTheme();

export default function AutoComplete(props) {
 return (
 <ThemeProvider theme={theme}>
   <Box>
     <StyledAutocomplete
       id="size-small-standard"
       size="small"
       options={props.data || []}
       value={props.value || null}
       onChange={(_event, value) => props.selectExam(value)}
       getOptionLabel={(option) => {
         if (props.isObject) {
           if (typeof option === 'string') {
             return option;
           } else {
             return option[props.displayValue] || '';
           }
         } else if (option) {
           return option;
         }
         return 'No label';
       }}
       width = {props.width} 
       renderInput={(params) => (
         <TextField {...params} variant="standard" placeholder={props.displayLabel} />
       )}
     />
   </Box>
 </ThemeProvider>
 );
}
