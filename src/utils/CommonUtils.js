import { CircleLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import { withStyles } from '@mui/styles';
import Switch from '@mui/material/Switch';

export function toastMessage(type, message) {
    document.addEventListener('click', () => toast.dismiss(), false);

    switch (type) {
        case 'success': toast(message, { style: { backgroundColor: 'white', color: 'darkgreen' }, autoClose: 5000, closeOnClick: true });
            break;
        case 'error': toast(message, { style: { backgroundColor: 'white', color: 'red' }, autoClose: 10000, closeOnClick: true });
            break;
        case 'info': toast(message, { style: { backgroundColor: 'white', color: '#3b489e' }, autoClose: 5000, closeOnClick: true });
            break;
        default: toast(message, { style: { backgroundColor: 'white', color: 'darkgreen' }, autoClose: 5000, closeOnClick: true });
    }
}

export const ToggleStatus = withStyles({
    switchBase: {
        color: "red", '&$checked': { color: 'green', }, '&$checked + $track': { backgroundColor: 'green', },
    }, checked: {}, track: { backgroundColor: 'red', },
})(Switch);

export function fallBackLoader(value) {
    return (<div style={{ position: "fixed", top: "45%", left: "45%", transform: "translate(-50%, -50%)" }}>
        <CircleLoader color={'#0000FF'} loading={value} size={150} />
    </div>)
}

export function calculatePercentage(marksObtain,totalMarks) {
    return Math.floor((marksObtain*100)/totalMarks);
}
