import React, { useState } from "react";
import {
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  Box,
  CircularProgress,
  Alert,
  Stack,
} from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import TextfieldWrapper from "../FormUI/TextfieldWrapper";
import DateTimePickerWrapper from "../FormUI/DateTimePicker";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

const fetchUserData = async (userId) => {
  const response = await axios.get(`http://localhost:5001/users/${userId}`);
  return response.data;
};

const updateUserData = async ({ userId, person }) => {
  const response = await axios.patch(
    `http://localhost:5001/persons/${userId}`,
    person
  );
  console.log(response);
  return response.data;
};

const validationSchema = Yup.object().shape({
  firstName: Yup.string().optional(),
  lastName: Yup.string().optional(),
  dateOfBirth: Yup.date().optional(),
  phone: Yup.number()
    .integer()
    .typeError("Enter a valid phone number")
    .optional(),
  addressLine1: Yup.string().optional(),
  addressLine2: Yup.string().optional(),
  city: Yup.string().optional(),
  province: Yup.string().optional(),
  country: Yup.string().optional(),
});

const MyAccountCard = () => {
  const { userId } = useParams();
  const [editMode, setEditMode] = useState(false);

  const { data, error, isLoading, isFetched } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserData(userId),
    onError: (error) => {
      console.error("Error fetching user data:", error);
    },
  });
  

  const mutation = useMutation({
    mutationFn: (person) => updateUserData({ userId, person }),
    onSuccess: () => {
      setEditMode(false);
    },
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">Failed to fetch person data</Alert>;

  if (isFetched && data) {
    return (
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" component="div">
            Personal Details
          </Typography>

          <Formik
            initialValues={{
              firstName: data?.data?.person?.firstName || "",
              lastName: data?.data?.person?.lastName || "",
              dateOfBirth: data?.data?.person?.dateOfBirth
                ? new Date(data.data.person.dateOfBirth)
                : null, 
              phone: data?.data?.person?.phone || "",
              addressLine1: data?.data?.person?.addressLine1 || "",
              addressLine2: data?.data?.person?.addressLine2 || "",
              city: data?.data?.person?.city || "",
              province: data?.data?.person?.province || "",
              country: data?.data?.person?.country || "",
            }}
            validationSchema={validationSchema}
            enableReinitialize={true} 
            onSubmit={(values) => {
              mutation.mutate(values);
              console.log(values);
            }}
          >
            {({ values }) => (
              <Form>
                <Grid container spacing={2}>
                  <Grid item xs={6}>
                    <TextfieldWrapper
                      name="firstName"
                      label="First Name"
                      fullWidth
                      required={false}
                      margin="normal"
                      disabled={!editMode}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextfieldWrapper
                      name="lastName"
                      label="Last Name"
                      fullWidth
                      required={false}
                      margin="normal"
                      disabled={!editMode}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <Stack sx={{ mt: 2 }}>
                      <DateTimePickerWrapper
                        name="dateOfBirth"
                        label="Date of Birth"
                        variant="outlined"
                        fullWidth
                        type="Date"
                        required={false}
                        margin="normal"
                        disabled={!editMode}
                      />
                    </Stack>
                  </Grid>
                  <Grid item xs={6}>
                    <TextfieldWrapper
                      name="phone"
                      label="Phone Number"
                      fullWidth
                      required={false}
                      margin="normal"
                      disabled={!editMode}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextfieldWrapper
                      name="addressLine1"
                      label="Address Line 1"
                      fullWidth
                      required={false}
                      margin="normal"
                      disabled={!editMode}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextfieldWrapper
                      name="addressLine2"
                      label="Address Line 2"
                      fullWidth
                      required={false}
                      margin="normal"
                      disabled={!editMode}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextfieldWrapper
                      name="city"
                      label="City"
                      fullWidth
                      required={false}
                      margin="normal"
                      disabled={!editMode}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextfieldWrapper
                      name="province"
                      label="Province"
                      fullWidth
                      required={false}
                      margin="normal"
                      disabled={!editMode}
                      variant="outlined"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextfieldWrapper
                      name="country"
                      label="Country"
                      fullWidth
                      required={false}
                      margin="normal"
                      disabled={!editMode}
                      variant="outlined"
                    />
                  </Grid>
                </Grid>
                {editMode && (
                  <Box sx={{ mt: 2 }}>
                    <Button type="submit" variant="contained" color="success">
                      Save
                    </Button>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={() => setEditMode(false)}
                      sx={{ ml: 2 }}
                    >
                      Cancel
                    </Button>
                  </Box>
                )}
                {mutation.isError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Failed to update user data
                  </Alert>
                )}
                {mutation.isSuccess && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    User profile updated successfully
                  </Alert>
                )}
              </Form>
            )}
          </Formik>

          {!editMode && (
            <Button
              size="small"
              variant="contained"
              color="primary"
              onClick={() => setEditMode(true)}
            >
              Edit
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  return <CircularProgress />;
};

export default MyAccountCard;
