import React, { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import {
  Button,
  Container,
  Typography,
  CircularProgress,
  Alert,
  Box,
  Grid,
  Paper,
} from "@mui/material";
import { useParams } from "react-router-dom";
import { Formik, Form } from "formik";
import * as Yup from "yup";
import withAuth from "../../hooks/useAuth";
import Header from "../Header/header";
import TextfieldWrapper from "../FormUI/TextfieldWrapper";

const fetchUserData = async (userId) => {
  const response = await axios.get(`http://localhost:5001/users/${userId}`);
  return response.data;
};

const updateUserData = async ({ userId, user }) => {
  const response = await axios.patch(
    `http://localhost:5001/users/${userId}`,
    user
  );
  return response.data;
};

const validationSchema = Yup.object({
  userName: Yup.string().optional(),
  email: Yup.string().email("Invalid email address").optional(),
  currentPassword: Yup.string().optional(),
  newPassword: Yup.string().optional()
});

const Profile = () => {
  const { userId } = useParams();
  const [editMode, setEditMode] = useState(false);

  const { data, error, isLoading, isFetched } = useQuery({
    queryKey: ["user", userId],
    queryFn: () => fetchUserData(userId),
    onError: (error) => {
      console.error("Error fetching user data:", error);
    },
  });
  console.log(isFetched)
  console.log(data)

  const mutation = useMutation({
    mutationFn: (user) => updateUserData({ userId, user }),
    onSuccess: () => {
      setEditMode(false);
    },
  });

  if (isLoading) return <CircularProgress />;
  if (error) return <Alert severity="error">Failed to fetch user data</Alert>;

  return (
    <Box sx={{ display: "flex" }}>
      <Header />
      <Box
        component="main"
        sx={{
          ml: 5,
          mr: 5,
          mt: 10,
          flexGrow: 1,
          p: 3,
          transition: "margin 0.3s ease",
        }}
      >
        <Container>
        <Typography variant="h4" gutterBottom>
          | My Profile
        </Typography>

          <Paper sx={{ p: 3, mb: 2 }}>
            {isFetched && data ? (
              <Formik
                initialValues={{
                  userName: data.data.user.userName || "",
                  email: data.data.user.email || "",
                  currentPassword: "",
                  newPassword: "",
                }}
                validationSchema={validationSchema}
                onSubmit={(values) => {
                  mutation.mutate(values);
                }}
              >
                {({ values }) => (
                  <Form>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={12}>
                        <TextfieldWrapper
                          label="Username"
                          name="userName"
                          fullWidth
                          margin="normal"
                          required={false}
                          disabled={!editMode}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <TextfieldWrapper
                          label="Email"
                          name="email"
                          fullWidth
                          margin="normal"
                          required={false}
                          type="email"
                          disabled={!editMode}
                          variant="outlined"
                        />
                      </Grid>
                      <Grid item xs={12} sm={12}>
                        <TextfieldWrapper
                          label="Current Password"
                          name="currentPassword"
                          fullWidth
                          margin="normal"
                          required={false}
                          type="password"
                          disabled={!editMode}
                          variant="outlined"
                        />
                      </Grid>
                      {editMode && (
                        <Grid item xs={12} sm={12}>
                          <TextfieldWrapper 
                            label="New Password"
                            name="newPassword"
                            fullWidth
                            margin="normal"
                            required={false}
                            type="password"
                            variant="outlined"
                          />
                        </Grid>
                      )}
                    </Grid>
                    <Box sx={{ mt: 2 }}>
                      {editMode ? (
                        <>
                          <Button
                            type="submit"
                            variant="contained"
                            color="success"
                          >
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
                        </>
                      ) : (
                        <Box sx={{ mt: 2 }}>
                          <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setEditMode(true)}
                          >
                            Edit Profile
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
                    </Box>
                  </Form>
                )}
              </Formik>
            ) : (
              <Typography>Loading profile data...</Typography>
            )}
          </Paper>
        </Container>
      </Box>
    </Box>
  );
};

export default withAuth(Profile);

