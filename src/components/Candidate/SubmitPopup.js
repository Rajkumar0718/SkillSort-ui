import CloseIcon from '@mui/icons-material/Close';
import { Box } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import IconButton from '@mui/material/IconButton';
import React, { useState } from 'react';

export default function SubmitPopup(props) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const handleSubmit = () => {
        props.submit(); 
        setIsSubmitting(true); 
    };
    return (
        <Dialog
            open={true}
            onClose={props.close}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            style={{ display: 'flex', justifyContent: "center", alignItems: "center", backgroundColor: 'rgba(0,0,0,0.90)' }}
            PaperProps={{style:{borderRadius:'1.45rem'}}}
        >
            <DialogTitle id="alert-dialog-title" style={{ border: "none", textAlign: "center" }}>
                <Box display="flex" justifyContent="center" alignItems="center" position="relative">
                    <span className='setting-title'>Confirm to submit</span>
                    <IconButton
                        aria-label="close"
                        onClick={props.close}
                        style={{ position: 'absolute', right: 1, top: 1, color:'#f05a28' }}
                    >
                        <CloseIcon />
                    </IconButton>
                </Box>
            </DialogTitle>
            <DialogContent>
                <DialogContentText style={{ fontFamily:'Montserrat', color:'black'}}>
                    {!localStorage.getItem("practiceExamId") ? "Once the test has been submitted it can't be re-taken, Make sure you have attended all the questions." : "Thank you for taking practice Exam, Make sure you have attended all the questions."}
                </DialogContentText>
                <DialogActions>
                    <button className="btn btn-sm btn-nxt" onClick={handleSubmit} disabled={isSubmitting}>Yes</button>
                    <button className="btn btn-sm btn-prev" onClick={props.close}>No</button>
                </DialogActions>
            </DialogContent>
        </Dialog>
    );
}
