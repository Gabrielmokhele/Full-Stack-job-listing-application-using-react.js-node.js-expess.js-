import React from 'react';
import { useField } from 'formik';
import { TextField } from '@mui/material';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';

const DateTimePickerWrapper = ({
  name,
  ...otherProps
}) => {
  const [field, meta, helpers] = useField(name);

  const handleChange = (date) => {
    helpers.setValue(date);
  };


 
  const configDateTimePicker = {
    ...field,
    ...otherProps,
 
    variant: 'outlined',
    fullWidth: true,
    InputLabelProps: {
      shrink: true
    }
  };

  if(meta && meta.touched && meta.error) {
    configDateTimePicker.error = true;
    configDateTimePicker.helperText = meta.error;
  }


  return (


    <LocalizationProvider dateAdapter={AdapterDayjs}>
    <DatePicker  
    fullWidth
      {...configDateTimePicker}
      value={dayjs(field.value)}
      onChange={(date) => {handleChange(date)}}
    
    />
  </LocalizationProvider>
   
    
  );
};
export default DateTimePickerWrapper;












