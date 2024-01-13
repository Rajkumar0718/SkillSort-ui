import { CircleLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import Switch from '@mui/material/Switch';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router';
import { useNavigate } from 'react-router-dom';

export function toastMessage(type, message) {
    document.addEventListener('click', () => toast.dismiss(), false);
    console.log(type, message);
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

const CustomSwitch = styled(Switch)(({ theme }) => ({
    '& .MuiSwitch-switchBase': {
        color: 'red',
        '&.Mui-checked': {
            color: 'green',
            '& + .MuiSwitch-track': {
                backgroundColor: 'green',
            },
        },
    },
    '& .MuiSwitch-track': {
        backgroundColor: 'red',
    },
}));

export const ToggleStatus = () => {
    return <CustomSwitch />;
};

export function fallBackLoader(value) {
    return (<div style={{ position: "fixed", top: "45%", left: "45%", transform: "translate(-50%, -50%)" }}>
        <CircleLoader color={'#0000FF'} loading={value} size={150} />
    </div>)
}

export function calculatePercentage(marksObtain,totalMarks) {
    return Math.floor((marksObtain*100)/totalMarks);
}

export function withLocation(Component) {
    return (props) => {
        const location = useLocation();
        const navigation = useNavigate();
        return <Component {...props} location={location} navigate={navigation} />;
    };
};
