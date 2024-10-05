import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Typography, Button, IconButton, Avatar, Box } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

const JobPopup = ({ job, isOpen, onRequestClose, onApply, showApplyButton = true }) => {
  if (!job) return null;
  return (
    <Dialog
      open={isOpen}
      onClose={onRequestClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle variant='h4'>
        {job.title}
        <IconButton
          edge="end"
          color="inherit"
          onClick={onRequestClose}
          aria-label="close"
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'left', mb: 2 }}>
        </Box>
        <Typography variant="body1" paragraph>
          {job.details}
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Skills:</strong> {job.skills}
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Location Type:</strong> {job.locationType}
        </Typography>
        <Typography variant="body2" paragraph>
          <strong>Employment Type:</strong> {job.employmentType}
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onRequestClose} color="primary">
          Close
        </Button>
        {showApplyButton && onApply && (
          <Button onClick={onApply} color="primary" variant='contained'>Apply</Button>
        )}
      </DialogActions>
    </Dialog>
  );
};

export default JobPopup;

