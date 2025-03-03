import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Button, Container, Typography, Box, Grid, Paper } from "@mui/material";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import { useMutation } from "@tanstack/react-query";
import TextfieldWrapper from "../FormUI/TextfieldWrapper";
import { multiStepContext } from "../../StepContext";
import withAuth from "../../hooks/useAuth";
import Alert from "@mui/material/Alert";

const API_URL = "http://localhost:5001";

const Homepage = () => {
  const navigate = useNavigate();
  const [isLoggingIn, setIsLoggingIn] = useState(true);
  const [error, setError] = useState(null);

  const handleSuccess = (data) => {
    const { stepComplete, token, userId } = data.data.data;
    localStorage.setItem('token', token);
    if (stepComplete) {
      navigate(`${stepComplete}/?UID=${userId}`);
    } else {
      navigate(`/dashboard/${userId}`);
    }
  }

  const loginMutation = useMutation({
    mutationFn: (loginData) => axios.post(`${API_URL}/login`, loginData),
    onSuccess: (data) => {
      handleSuccess(data);
      setError(null);
    },
    onError: () => {
      setError("Login failed. Please check your credentials and try again.");
    },
  });

  const registerMutation = useMutation({
    mutationFn: (registerData) => axios.post(`${API_URL}/register`, registerData),
    onSuccess: (data) => {
      const { userId } = data.data.data;
      navigate(`/step-1/?UID=${userId}`);
      setError(null); // Clear error on success
    },
    onError: () => {
      setError("Registration failed. Please try again.");
    },
  });

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #6a82fb, #fc5c7d)",
      }}
    >
      <Container
        maxWidth={false}
        disableGutters
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          height: "82vh",
          mt: 10,
          backgroundColor: "#ffffff",
          width: 1200,
          borderRadius: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            ml: 5,
          }}
        >
          <Box textAlign="center">
            <Paper elevation={3} sx={{
              p: 4,
              width: "100%",
              maxWidth: 400,
              borderRadius: 2,
              background: "white",
              position: "relative",
              '&::before': {
                content: '""',
                position: "absolute",
                borderRadius: 2,
                padding: "2px",
                background: "linear-gradient(135deg, #6a82fb, #fc5c7d)",
                WebkitMask:
                  "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
                WebkitMaskComposite: "destination-out",
                maskComposite: "exclude",
              }
            }}>
              <Typography variant="h4" gutterBottom>
              {isLoggingIn ? "Sign In" : "Register"}
              </Typography>
              {error && <Alert severity="error">{error}</Alert>}
              {isLoggingIn ? (
                <LoginForm setIsLoggingIn={setIsLoggingIn} loginMutation={loginMutation} />
              ) : (
                <RegisterForm setIsLoggingIn={setIsLoggingIn} registerMutation={registerMutation} />
              )}
            </Paper>
          </Box>
        </Box>

        <Box
          sx={{

            background: "linear-gradient(to right, #fc5c7d , #6a82fb)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            p: 4,
            borderTopRightRadius: 5,
            borderBottomRightRadius: 5,
          }}
        >
          <Box textAlign="center">
            <Typography variant="h3" component="h1" gutterBottom>
              Welcome Back
            </Typography>
            <Typography variant="h6" color="text.secondary">
              Sign in to access your account
            </Typography>
          </Box>
        </Box>
      </Container>
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
                  fullWidth
                  sx={{
                    background: "linear-gradient(135deg, #6a82fb, #fc5c7d)",
                    color: "white",
                    '&:hover': {
                      background: "linear-gradient(135deg, #5a72eb, #e44c6d)",
                    },
                  }}
                >
                  Login
                </Button>
              </Grid>

              <Grid item xs={6}>
                <Button
                  type="button"
                  variant="outlined"
                  fullWidth
                  onClick={() => setIsLoggingIn(false)}
                  sx={{
                    background: "linear-gradient(135deg, #ffffff, #ffffff) padding-box, linear-gradient(135deg, #6a82fb, #fc5c7d) border-box",
                    border: "2px solid transparent",
                    color: "#6a82fb",
                    '&:hover': {
                      background: "linear-gradient(135deg, #e1e1f9, #ffe5ec)",
                    },
                  }}
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
        userType: "",
        email: "",
        password: "",
        confirmPassword: "",
      }}
      validationSchema={Yup.object({
        userName: Yup.string().required("Required"),
        userType: Yup.string().required("Required"),
        email: Yup.string().email("Invalid email").required("Required"),
        password: Yup.string().required("Required"),
        confirmPassword: Yup.string()
          .oneOf([Yup.ref('password'), null], "Passwords must match")
          .required("Required"),
      })}
      onSubmit={(values, { setSubmitting }) => {
        registerMutation.mutate(
          { userName: values.userName, userType: values.userType, email: values.email, password: values.password },
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
                <TextfieldWrapper name="userType" label="User Type" type="text" />
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
                  sx={{
                    background: "linear-gradient(135deg, #6a82fb, #fc5c7d)",
                    color: "white",
                    '&:hover': {
                      background: "linear-gradient(135deg, #5a72eb, #e44c6d)",
                    },
                  }}
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
                  sx={{
                    background: "linear-gradient(135deg, #ffffff, #ffffff) padding-box, linear-gradient(135deg, #6a82fb, #fc5c7d) border-box",
                    border: "2px solid transparent",
                    color: "#6a82fb",
                    '&:hover': {
                      background: "linear-gradient(135deg, #e1e1f9, #ffe5ec)",
                    },
                  }}
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
