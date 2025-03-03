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
} from "@mui/material";
import { Formik, Form, FieldArray } from "formik";
import * as Yup from "yup";
import { useParams } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";

const fetchUserData = async (userId) => {
  const response = await axios.get(`http://localhost:5001/users/${userId}`);
  return response.data;
};

const MyFileCard = () => {
  const { userId } = useParams();
  // const [editMode, setEditMode] = useState(false);

  const { data, error, isLoading, isFetched } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserData(userId),
    onError: (error) => {
      console.error("Error fetching user data:", error);
    },
  });

  console.log("data", data);

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">Failed to fetch person data</Alert>;

  return (
    <Card sx={{ mt: 4 }}>
      <CardContent>
        <Typography variant="h6">Update My CV</Typography>

        <Formik
          initialValues={{
            files: data?.data?.files || [], // Initialize with existing files
          }}
          validationSchema={Yup.object().shape({
            files: Yup.mixed()
              .required("File is required")
              .test(
                "fileSize",
                "File size too large (max 1MB)",
                (value) => !value || (value.size && value.size <= 1048576) // 1MB
              )
              .test(
                "fileType",
                "Invalid file format, only PDF allowed",
                (value) => !value || value.type === "application/pdf"
              ),
          })}
          enableReinitialize={true}
          onSubmit={(values) => {
            const formData = new FormData();
            if (values.files) {
              formData.append("file", values.files);
            }

            // mutation.mutate(formData);
            console.log("Submitted Values:", values);
          }}
        >
          {({ values, setFieldValue }) => (
            <Form>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  {values.files.length > 0 && (
                    <Box display="flex" alignItems="center" mb={1}>
                      <Typography>
                        <a
                          href={`http://localhost:5001/${values.files[0]?.filePath}`} 
                          download={values.files[0]?.name}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{ textDecoration: "none", color: "#1976D2" }}
                        >
                          {values.files[0]?.name}
                        </a>
                      </Typography>
                    </Box>
                  )}

                  <Grid direction="row">
                    <input
                      accept=".pdf"
                      style={{ display: "none" }}
                      id="file-upload-button"
                      type="file"
                      onChange={(event) => {
                        const file = event.target.files[0];
                        setFieldValue("files", file);
                      }}
                    />
                    <label htmlFor="file-upload-button">
                      <Button variant="contained" component="span">
                        Choose PDF File
                      </Button>
                    </label>
                    <Button
                      type="submit"
                      variant="contained"
                      color="success"
                      sx={{ ml: 1, mr: 1 }}
                    >
                      Save
                    </Button>
                    <Button
                      variant="contained"
                      color="error"
                      onClick={() => setFieldValue("files", [])}
                    >
                      Remove
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Form>
          )}
        </Formik>
      </CardContent>
    </Card>
  );
};

export default MyFileCard;
