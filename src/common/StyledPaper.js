import { styled } from '@mui/system';
import Paper from '@mui/material/Paper';

const StyledPaper = styled(Paper)(({ theme }) => ({
 padding: theme.spacing(2),
 marginBottom: '1rem',
 height: '58px',
 backgroundColor: 'rgba(59, 72, 158, 0.3)',
 marginLeft: '0rem',
 width: '100%',
}));

export default StyledPaper;