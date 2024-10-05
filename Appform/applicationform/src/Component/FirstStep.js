import React, { useContext, useEffect, useState } from "react";
import { useMutation, useQueryClient,QueryClientProvider } from "@tanstack/react-query";
import { Button, Typography, Grid, Box , Container, Stack} from "@mui/material";
import withAuth from "../hooks/useAuth";
import { multiStepContext } from "../StepContext";
import { Formik, Form } from "formik";
import TextfieldWrapper from "./FormUI/TextfieldWrapper";
import DateTimePicker from "./FormUI/DateTimePicker";
import * as Yup from "yup";
import Select from "./FormUI/Select";
import axios from "axios";
import Header from "./Header/header";
import { useNavigate } from "react-router-dom";
import DateTimePickerWrapper from "./FormUI/DateTimePicker";


const FirstStep = () => {s
  const navigate = useNavigate();
  const { setStep, userData, setUserData, registerEmail, loginEmail, userId } =
    useContext(multiStepContext);
  const [countries, setCountries] = useState([]);
  const queryClient = useQueryClient();

  const fetchCountries = async () => {
    try {
      const url = "https://api.countrystatecity.in/v1/countries";
      const API_KEY =
        "bGNUQ3lHalZQZ1B0MkhoMll5M0d3ZHlRYTN5b2JFSWxhMnoyc0htUQ==";
      const config = { headers: { "X-CSCAPI-KEY": API_KEY } };
      const { data } = await axios.get(url, config);
      setCountries(data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCountries();
  }, []);

  const createUserData = useMutation({
    mutationFn: (values) => {
      return axios.post("http://localhost:5001/persons", {
        ...values,
        userId, 
      });
    },
    onSuccess: (data) => {
      console.log("User data saved successfully");
      setUserData((prevData) => ({
        ...prevData,
        FirstStepdata: data.data.data,
      }));
      queryClient.invalidateQueries(["person"]);
    },
    onError: (error) => {
      console.error("Error saving user data:", error);
    },
  });

  const handleSubmit = (values, { setSubmitting }) => {
    createUserData.mutate(values, {
      onSuccess: () => {
        setSubmitting(false);
        setStep(2);
        navigate("/step-2");
        console.log(values);
      },
    });
  };

  const initialEmail = registerEmail || loginEmail || "";

  return (
    <div>
    <QueryClientProvider client={queryClient}>
    
      <Box sx={{ display: 'flex' }}>
        <Header />
        <Box
          component="main"
          sx={{
            mt: 2,
            flexGrow: 1,
            p: 3,
            transition: 'margin 0.3s ease',
          }}
        >
          <Container maxWidth="xl">
            <Stack sx={{ mt: 4 }}>
              
            
    <Formik
      initialValues={{
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        dateOfBirth: userData.dateOfBirth || "",
        email: initialEmail,
        phone: userData.phone || "",
        addressLine1: userData.addressLine1 || "",
        addressLine2: userData.addressLine2 || "",
        city: userData.city || "",
        province: userData.province || "",
        country: userData.country || "",
      }}
      validationSchema={Yup.object().shape({
        firstName: Yup.string().required("required"),
        lastName: Yup.string().required("required"),
        dateOfBirth: Yup.date().required("required"),
        email: Yup.string().email("Invalid email").required("required"),
        phone: Yup.number()
          .integer()
          .typeError("Enter a valid phone number")
          .required("required"),
        addressLine1: Yup.string().required("required"),
        addressLine2: Yup.string(),
        city: Yup.string().required("required"),
        province: Yup.string().required("required"),
        country: Yup.string().required("required"),
      })}
      onSubmit={handleSubmit}
    >
      {({ values, handleChange, handleBlur }) => (
        <Form>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <Typography>Personal Details</Typography>
            </Grid>

            <Grid item xs={6}>
              <TextfieldWrapper
                name="firstName"
                label="First Name"
                variant="filled"
                color="secondary"
                value={values.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid item xs={6}>
              <TextfieldWrapper
                name="lastName"
                label="Last Name"
                variant="filled"
                color="secondary"
                value={values.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid item xs={6}>
              <DateTimePickerWrapper
                name="dateOfBirth"
                label="Date of Birth"
                variant="filled"
                color="secondary"
                value={values.dateOfBirth}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>

            <Grid item xs={6}>
              <TextfieldWrapper
                name="email"
                label="Email Address"
                variant="filled"
                color="secondary"
                value={values.email}
                onChange={(e) => {
                  handleChange(e);
                  setRegisterEmail(e.target.value);
                }}
                onBlur={handleBlur}
                InputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={6}>
              <TextfieldWrapper
                name="phone"
                label="Phone number"
                variant="filled"
                color="secondary"
                value={values.phone}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid item xs={12}>
              <TextfieldWrapper
                name="addressLine1"
                label="Address Line 1"
                variant="filled"
                color="secondary"
                value={values.addressLine1}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid item xs={12}>
              <TextfieldWrapper
                name="addressLine2"
                label="Address Line 2"
                variant="filled"
                color="secondary"
                value={values.addressLine2}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid item xs={6}>
              <TextfieldWrapper
                name="city"
                label="City"
                variant="filled"
                color="secondary"
                value={values.city}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid item xs={6}>
              <TextfieldWrapper
                name="province"
                label="Province"
                variant="filled"
                color="secondary"
                value={values.province}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                name="country"
                label="Country"
                options={countries?.map((country) => ({
                  label: country.name,
                  value: country.name,
                }))}
                value={values.country}
                onChange={(e) =>
                  handleChange({
                    target: { name: "country", value: e.target.value },
                  })
                }
                onBlur={handleBlur}
              />
            </Grid>

            <Grid item xs={1} style={{ display: "flex" }}>
              <Button type="submit" variant="contained" color="success">
                Next
              </Button>
            </Grid>
          </Grid>
        </Form>
      )}
    </Formik>
    </Stack>
          </Container>
        </Box>
      </Box>
    </QueryClientProvider>
    </div>
  );
};

export default withAuth(FirstStep);
