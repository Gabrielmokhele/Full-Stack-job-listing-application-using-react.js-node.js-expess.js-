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
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import TextfieldWrapper from "../FormUI/TextfieldWrapper";
import DateTimePickerWrapper from "../FormUI/DateTimePicker";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

const fetchUserData = async (userId) => {
  const response = await axios.get(`http://localhost:5001/users/${userId}`);
  console.log(response.data.data.educations);
  return response.data;
};

const updateExperiencesAndEducationsData = async ({
  userId,
  experiencesAndEducations,
}) => {
  const response = await axios.patch(
    `http://localhost:5001/persons/${userId}`,
    experiencesAndEducations
  );
  console.log(response.data);
  return response.data;
};

const validationSchema = Yup.object().shape({
  experiences: Yup.array().of(
    Yup.object().shape({
      employer: Yup.string().optional(),
      position: Yup.string().optional(),
      startDate: Yup.date().optional(),
      endDate: Yup.date().optional(),
      roleDescription: Yup.string().optional(),
    })
  ),
  educations: Yup.array().of(
    Yup.object().shape({
      institution: Yup.string().optional(),
      qualification: Yup.string().optional(),
      startDate1: Yup.date().optional(),
      endDate1: Yup.date().optional(),
      description: Yup.string().optional(),
    })
  ),
});

const MyExAndEdCard = () => {
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
    mutationFn: (experiencesAndEducations) =>
      updateExperiencesAndEducationsData({ userId, experiencesAndEducations }),
    onSuccess: () => {
      setEditMode(false);
    },
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">Failed to fetch person data</Alert>;

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6" component="div">
          Educations & Experiences
        </Typography>
        {isFetched && data ? (
          <Formik
            initialValues={{
              experiences: data?.data?.experiences || [
                {
                  employer: "",
                  position: "",
                  startDate: "",
                  endDate: "",
                  roleDescription: "",
                },
              ],
              educations: data?.data?.educations || [
                {
                  institution: "",
                  qualification: "",
                  startDate1: "",
                  endDate1: "",
                  description: "",
                },
              ],
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
                <FieldArray name="experiences">
                  {({ push, remove }) => (
                    <div>
                      {values.experiences.map((experience, index) => (
                        <div key={index}>
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12}>
                              <Typography>Experience {index + 1}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <TextfieldWrapper
                                name={`experiences.${index}.employer`}
                                label="Employer"
                                fullWidth
                                margin="normal"
                                disabled={!editMode}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextfieldWrapper
                                name={`experiences.${index}.position`}
                                label="Position"
                                fullWidth
                                margin="normal"
                                disabled={!editMode}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid container spacing={2} item xs={12}>
                              <Grid item xs={6}>
                                <Stack sx={{ mt: 2 }}>
                                  <DateTimePickerWrapper
                                    name={`experiences.${index}.startDate`}
                                    label="Start Date"
                                    fullWidth
                                    type="date"
                                    margin="normal"
                                    disabled={!editMode}
                                    variant="outlined"
                                  />
                                </Stack>
                              </Grid>
                              <Grid item xs={6}>
                                <Stack sx={{ mt: 2 }}>
                                  <DateTimePickerWrapper
                                    name={`experiences.${index}.endDate`}
                                    label="End Date"
                                    fullWidth
                                    type="date"
                                    margin="normal"
                                    disabled={!editMode}
                                    variant="outlined"
                                  />
                                </Stack>
                              </Grid>
                            </Grid>
                            <Grid item xs={12}>
                              <TextfieldWrapper
                                name={`experiences.${index}.roleDescription`}
                                label="Role Description"
                                fullWidth
                                margin="normal"
                                disabled={!editMode}
                                variant="outlined"
                              />
                            </Grid>
                            {editMode && (
                              <Grid
                                item
                                xs={12}
                                sx={{
                                  mt: 0,
                                  ml: 0,
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  color="warning"
                                  onClick={() => remove(index)}
                                >
                                  Remove
                                </Button>
                                <Button
                                  sx={{ ml: 2 }}
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
                                  Add More
                                </Button>
                              </Grid>
                            )}
                          </Grid>
                        </div>
                      ))}
                    </div>
                  )}
                </FieldArray>

                <FieldArray name="educations">
                  {({ push, remove }) => (
                    <div>
                      {values.educations.map((education, index) => (
                        <div key={index}>
                          <Grid container spacing={2} sx={{ mb: 2 }}>
                            <Grid item xs={12}>
                              <Typography>Education {index + 1}</Typography>
                            </Grid>
                            <Grid item xs={12}>
                              <TextfieldWrapper
                                name={`educations.${index}.institution`}
                                label="Institution"
                                fullWidth
                                margin="normal"
                                disabled={!editMode}
                                variant="outlined"
                              />
                            </Grid>
                            <Grid item xs={12}>
                              <TextfieldWrapper
                                name={`educations.${index}.qualification`}
                                label="Qualification"
                                fullWidth
                                margin="normal"
                                disabled={!editMode}
                                variant="outlined"
                              />
                            </Grid>

                            <Grid container spacing={2} item xs={12}>
                              <Grid item xs={6}>
                                <Stack sx={{ mt: 2 }}>
                                  <DateTimePickerWrapper
                                    name={`educations.${index}.startDate1`}
                                    label="Start Date"
                                    fullWidth
                                    type="date"
                                    margin="normal"
                                    disabled={!editMode}
                                    variant="outlined"
                                  />
                                </Stack>
                              </Grid>

                              <Grid item xs={6}>
                                <Stack sx={{ mt: 2 }}>
                                  <DateTimePickerWrapper
                                    name={`educations.${index}.endDate1`}
                                    label="End Date"
                                    fullWidth
                                    type="date"
                                    margin="normal"
                                    disabled={!editMode}
                                    variant="outlined"
                                  />
                                </Stack>
                              </Grid>
                            </Grid>

                            <Grid item xs={12}>
                              <TextfieldWrapper
                                name={`educations.${index}.description`}
                                label="Description"
                                fullWidth
                                margin="normal"
                                disabled={!editMode}
                                variant="outlined"
                              />
                            </Grid>
                            {editMode && (
                              <Grid
                                item
                                xs={12}
                                sx={{
                                  mt: 0,
                                  ml: 0,
                                  display: "flex",
                                  justifyContent: "flex-end",
                                }}
                              >
                                <Button
                                  variant="contained"
                                  color="warning"
                                  onClick={() => remove(index)}
                                >
                                  Remove
                                </Button>
                                <Button
                                  sx={{ ml: 2 }}
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
                                  Add More
                                </Button>
                              </Grid>
                            )}
                          </Grid>
                        </div>
                      ))}
                    </div>
                  )}
                </FieldArray>

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
                {/* {mutation.isError && (
                  <Alert severity="error" sx={{ mt: 2 }}>
                    Failed to update user data
                  </Alert>
                )}
                {mutation.isSuccess && (
                  <Alert severity="success" sx={{ mt: 2 }}>
                    User profile updated successfully
                  </Alert>
                )} */}
              </Form>
            )}
          </Formik>
        ) : (
          <CircularProgress></CircularProgress>
        )}

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
};

export default MyExAndEdCard;
