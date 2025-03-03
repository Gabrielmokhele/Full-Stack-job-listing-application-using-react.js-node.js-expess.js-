import React, { useState, useContext } from "react";
import {
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  Box,
  TextField,
  Alert,
  Stack
} from "@mui/material";
import Header from "../Header/header";
import JobPopup from "../jobPopUp";
import { useNavigate } from "react-router-dom";
import { useQuery, useMutation } from "@tanstack/react-query";
import axios from "axios";
import withAuth from "../../hooks/useAuth";
import { multiStepContext } from "../../StepContext";
import HelperDialog from "./HelperDialog";


const truncateText = (text, length) => {
  return text.length > length ? text.substring(0, length) + "..." : text;
};

const JobSearch = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedJob, setSelectedJob] = useState(null);
  const [alertInfo, setAlertInfo] = useState({ message: "", severity: "" });
  const navigate = useNavigate();
  const { userId } = useContext(multiStepContext);

  const { data } = useQuery({
    queryKey: ["jobs"],
    queryFn: () =>
      axios.get("http://localhost:5001/jobs").then((res) => {
        console.log("Fetched jobs:", res.data.data);
        return res.data.data;
      }),
    onError: () => setAlertInfo({ message: "Failed to fetch jobs", severity: "error" }),
  });

  const mutation = useMutation({
    mutationFn: async ({ jobId }) => {
      return axios.post("http://localhost:5001/jobsapplied", { userId, jobId });
    },
    onSuccess: () => {
      navigate(`/candidate/${userId}`);
      setAlertInfo({ message: `You have applied for the ${selectedJob.title} position.`, severity: "success" });
    },
    onError: (error) => {
      console.error("Failed to apply for job:", error);
      setAlertInfo({ message: "Failed to apply for job.", severity: "error" });
    },
  });

  const filteredJobs = Array.isArray(data)
    ? data.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  const handleOpenPopup = (job) => {
    setSelectedJob(job);
  };

  const handleClosePopup = () => {
    setSelectedJob(null);
  };

  const handleApply = () => {
    const jobId = selectedJob.id;
    mutation.mutate({ userId, jobId });
  };

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
          p: 0,
          transition: "margin 0.3s ease",
        }}
      >
        <Typography variant="h4" gutterBottom>
          | Jobs
        </Typography>
        {alertInfo.message && (
        <Stack sx={{ width: "100%", mb: 2 }}>
          <Alert severity={alertInfo.severity}>{alertInfo.message}</Alert>
        </Stack>
      )}
        <TextField
          sx={{ mb: 2 }}
          variant="outlined"
          fullWidth
          label="Search Jobs"
          margin="normal"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Grid container spacing={5}>
          {filteredJobs.map((job, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card>
                <CardContent>
                  <Grid
                    sx={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Typography variant="h5" component="div">
                      {job.title}
                    </Typography>
                    <Typography variant="body2" color="primary">
                      {job.openPositions} open positions
                    </Typography>
                  </Grid>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    gutterBottom
                  >
                    {truncateText(job.details, 100)}
                  </Typography>

                  <Button
                    color="primary"
                    variant="contained"
                    size="medium"
                    onClick={() => handleOpenPopup(job)}
                  >
                    More Details
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        {selectedJob && (
          <JobPopup
            job={selectedJob}
            isOpen={!!selectedJob}
            onRequestClose={handleClosePopup}
            onApply={handleApply}
          />
        )}
      </Box>
      <HelperDialog jobs={filteredJobs} onJobSelect={handleOpenPopup}/>
    </Box>
    
  );
};

export default withAuth(JobSearch);
