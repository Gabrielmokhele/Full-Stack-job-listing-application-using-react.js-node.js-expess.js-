import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Container, Typography, Box, Grid } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import TextfieldWrapper from "../FormUI/TextfieldWrapper";
import { multiStepContext } from "../../StepContext";
import withAuth from "../../hooks/useAuth";

const API_URL = "http://localhost:5001";

const Homepage = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(true);

  const handleSuccess = (data) => {
    const {stepComplete,token, userId} = data.data.data;
    console.log(data.data.data)
    localStorage.setItem('token', token);
    if (stepComplete) {    
    navigate(`${stepComplete}/?UID=${userId}`);
    } else {
      navigate(`/dashboard/?UID=${userId}`);
    }
    console.log(stepComplete)
    
  }

  const loginMutation = useMutation({
    mutationFn: (loginData) => axios.post(`${API_URL}/login`, loginData),
    onSuccess: (data) => handleSuccess(data),
    onError: () => alert("Login failed. Please check your credentials and try again."),
  });

  const registerMutation = useMutation({
    mutationFn: (registerData) => axios.post(`${API_URL}/register`, registerData),
    onSuccess: (data) => {
      const { userId } = data.data.data;
      navigate(`/step-1/?UID=${userId}`);
    },
    onError: () => alert("Registration failed. Please try again."),
  });

  return (
    <Container
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
      }}
    >
      <Typography variant="h4" gutterBottom>
        Applications
      </Typography>
      {isLoggingIn ? (
        <LoginForm setIsLoggingIn={setIsLoggingIn} loginMutation={loginMutation} />
      ) : (
        <RegisterForm setIsLoggingIn={setIsLoggingIn} registerMutation={registerMutation} />
      )}
    </Container>
  );
};

const LoginForm = ({ setIsLoggingIn, loginMutation }) => {
  const { setloginEmail, setUserId } = useContext(multiStepContext);

  return (
    <Formik
      initialValues={{ email: "", password: "" }}
      validationSchema={Yup.object({
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        loginMutation.mutate(
          { email: values.email, password: values.password },
          {
            onSuccess: (data) => {
              const { userId } = data.data.data;
              setloginEmail(values.email);
              setUserId(userId);
              setSubmitting(false);
            },
          }
        );
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Box sx={{ width: "100%", maxWidth: 400, mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextfieldWrapper name="email" label="Email" type="email" />
              </Grid>
              <Grid item xs={12}>
                <TextfieldWrapper name="password" label="Password" type="password" />
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                >
                  Login
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => setIsLoggingIn(false)}
                >
                  Register
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

const RegisterForm = ({ setIsLoggingIn, registerMutation }) => {
  const { setRegisterEmail, setUserId } = useContext(multiStepContext);

  return (
    <Formik
      initialValues={{
        userName: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={Yup.object({
        userName: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().required("Required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], "Passwords must match")
          .required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        registerMutation.mutate(
          { userName: values.userName, email: values.email, password: values.password },
          {
            onSuccess: (data) => {
              const { userId } = data.data.data;
              setRegisterEmail(values.email);
              setUserId(userId);
              setSubmitting(false);
            },
          }
        );
      }}
    >
      {({ isSubmitting }) => (
        <Form>
          <Box sx={{ width: "100%", maxWidth: 400, mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextfieldWrapper name="userName" label="Username" type="text" />
              </Grid>
              <Grid item xs={12}>
                <TextfieldWrapper name="email" label="Email" type="email" />
              </Grid>
              <Grid item xs={12}>
                <TextfieldWrapper name="password" label="Password" type="password" />
              </Grid>
              <Grid item xs={12}>
                <TextfieldWrapper name="confirmPassword" label="Confirm Password" type="password" />
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  fullWidth
                  disabled={isSubmitting}
                >
                  Register
                </Button>
              </Grid>
              <Grid item xs={6}>
                <Button
                  type="button"
                  variant="outlined"
                  color="primary"
                  fullWidth
                  onClick={() => setIsLoggingIn(true)}
                >
                  Back to Login
                </Button>
              </Grid>
            </Grid>
          </Box>
        </Form>
      )}
    </Formik>
  );
};

export default withAuth(Homepage);
