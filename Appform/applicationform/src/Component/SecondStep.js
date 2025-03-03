import React, { useContext } from "react";
import { useMutation, QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Button, Typography, Grid, Box, Container, Stack } from "@mui/material";
import withAuth from "../hooks/useAuth";
import { multiStepContext } from "../StepContext";
import { Formik, Form, FieldArray } from "formik";
import TextfieldWrapper from "./FormUI/TextfieldWrapper";
import DateTimePickerWrapper from "./FormUI/DateTimePicker";
import * as Yup from "yup";
import axios from "axios";
import Header from "./Header/header";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient();

const SecondStep = () => {
  const navigate = useNavigate();
  const { setStep, userData, setUserData, userId } = useContext(multiStepContext);

  console.log("SecondStep", userData);

  const createEducationsAndExperiences = useMutation({
    mutationFn: (values) => axios.post("http://localhost:5001/educationsandexperiences", values),
  });

  const handleSubmit = (values, { setSubmitting }) => {
    const combinedData = {
      experiences: values.experiences.map(exp => ({ ...exp, userId })),
      educations: values.educations.map(edu => ({ ...edu, userId })),
    };

    console.log("Submitting Data:", combinedData);

    createEducationsAndExperiences.mutate(combinedData, {
      onSuccess: (data) => {
        setSubmitting(false);
        console.log("Success Data:", data);

        setUserData((prevData) => ({
          ...prevData,
          SecondStepData: data.data?.data,
        }));
        setStep(3);
        navigate("/step-3");
      },
      onError: (error) => {
        setSubmitting(false);
        console.error("Error submitting data:", error);
      },
    });
  };


  const INITIAL_FORM_STATE = {
    experiences: userData?.experiences || [
      {
        employer: "",
        position: "",
        startDate: "",
        endDate: "",
        roleDescription: "",
      },
    ],
    educations: userData?.educations || [
      {
        institution: "",
        qualification: "",
        startDate1: "",
        endDate1: "",
        description: "",
      },
    ],
  };

  return (
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
            <Stack sx={{ mt: 4 }}></Stack>
            <Formik
              initialValues={{
                experiences: INITIAL_FORM_STATE.experiences,
                educations: INITIAL_FORM_STATE.educations,
              }}
              validationSchema={Yup.object().shape({
                experiences: Yup.array().of(
                  Yup.object().shape({
                    employer: Yup.string().required("required"),
                    position: Yup.string(),
                    startDate: Yup.date(),
                    endDate: Yup.date(),
                    roleDescription: Yup.string(),
                  })
                ),
                educations: Yup.array().of(
                  Yup.object().shape({
                    institution: Yup.string().required("required"),
                    qualification: Yup.string(),
                    startDate1: Yup.date(),
                    endDate1: Yup.date(),
                    description: Yup.string(),
                  })
                ),
              })}
              onSubmit={handleSubmit}
            >
              {({ values }) => (
                <Form>
                  <FieldArray name="experiences">
                    {({ push, remove }) => (
                      <div>
                        {values.experiences.map((experience, index) => (
                          <div key={index}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography>Experience {index + 1}</Typography>
                              </Grid>

                              <Grid item xs={12}>
                                <TextfieldWrapper name={`experiences.${index}.employer`} label="Employer" />
                              </Grid>
                              <Grid item xs={12}>
                                <TextfieldWrapper name={`experiences.${index}.position`} label="Position" />
                              </Grid>
                              <Grid item xs={6}>

                                <DateTimePickerWrapper
                                  name={`experiences.${index}.startDate`}
                                  label="Start Date"
                                  variant="outlined"
                                  fullWidth
                                  sx={{ width: '100%' }}
                                  type="Date"
                                  color="secondary"
                                  value={values.dateOfBirth}


                                />
                              </Grid>
                              <Grid item xs={6}>

                                <DateTimePickerWrapper
                                  name={`experiences.${index}.endDate`}
                                  label="End Date"
                                  variant="outlined"
                                  fullWidth
                                  sx={{ width: '100%' }}
                                  type="Date"
                                  color="secondary"
                                  value={values.dateOfBirth}


                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextfieldWrapper name={`experiences.${index}.roleDescription`} label="Role Description" />
                              </Grid>
                              <Grid item xs={12}>
                                <Button
                                  variant="contained"
                                  color="warning"
                                  onClick={() => remove(index)}
                                >
                                  Remove
                                </Button>
                                <Button
                                  style={{ marginLeft: "5px" }}
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    push({
                                      employer: "",
                                      position: "",
                                      startDate: "",
                                      endDate: "",
                                      roleDescription: "",
                                    })
                                  }
                                >
                                  Add
                                </Button>
                              </Grid>
                            </Grid>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>

                  <br />

                  <FieldArray name="educations">
                    {({ push, remove }) => (
                      <div>
                        {values.educations.map((education, index) => (
                          <div key={index}>
                            <Grid container spacing={2}>
                              <Grid item xs={12}>
                                <Typography>Education {index + 1}</Typography>
                              </Grid>

                              <Grid item xs={12}>
                                <TextfieldWrapper name={`educations.${index}.institution`} label="Institution" />
                              </Grid>
                              <Grid item xs={12}>
                                <TextfieldWrapper name={`educations.${index}.qualification`} label="Qualification" />
                              </Grid>
                              <Grid item xs={6}>

                                <DateTimePickerWrapper
                                  name={`educations.${index}.startDate1`}
                                  label="Start Date"
                                  variant="outlined"
                                  fullWidth
                                  sx={{ width: '100%' }}
                                  type="Date"
                                  color="secondary"
                                  value={values.dateOfBirth}


                                />
                              </Grid>
                              <Grid item xs={6}>

                                <DateTimePickerWrapper
                                  name={`educations.${index}.endDate1`}
                                  label="End Date"
                                  variant="outlined"
                                  fullWidth
                                  sx={{ width: '100%' }}
                                  type="Date"
                                  color="secondary"
                                  value={values.dateOfBirth}


                                />
                              </Grid>
                              <Grid item xs={12}>
                                <TextfieldWrapper name={`educations.${index}.description`} label="Description" />
                              </Grid>
                              <Grid item xs={12}>
                                <Button
                                  variant="contained"
                                  color="warning"
                                  onClick={() => remove(index)}
                                >
                                  Remove
                                </Button>
                                <Button
                                  style={{ marginLeft: "5px" }}
                                  variant="contained"
                                  color="primary"
                                  onClick={() =>
                                    push({
                                      institution: "",
                                      qualification: "",
                                      startDate1: "",
                                      endDate1: "",
                                      description: "",
                                    })
                                  }
                                >
                                  Add
                                </Button>
                              </Grid>
                            </Grid>
                          </div>
                        ))}
                      </div>
                    )}
                  </FieldArray>

                  <br />

                  <Button
                    variant="contained"
                    onClick={() => setStep(1)}
                    color="secondary"
                  >
                    Back
                  </Button>
                  <Button
                    sx={{ ml: 2 }} type="submit" variant="contained" color="success"
                  >
                    Next
                  </Button>
                </Form>
              )}
            </Formik>
          </Container>
        </Box>
      </Box>
    </QueryClientProvider>
  );
};

export default withAuth(SecondStep);
