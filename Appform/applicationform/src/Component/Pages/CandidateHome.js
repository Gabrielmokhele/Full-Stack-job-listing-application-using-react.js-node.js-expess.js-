import React, { useState } from 'react';
import {
  Typography,
  Card,
  CardContent,
  CardActions,
  Button,
  Collapse,
  Box,
  Container,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import Header from '../Header/header';
import withAuth from '../../hooks/useAuth';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import JobPopup from '../jobPopUp';
import MyAccountCard from './MyAccountCard';
import MyExAndEdCard from './MyExAndEdCard';
import MyFileCard from './MyFileCard';


const fetchUserApplications = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:5001/user/${userId}`);
    return response?.data?.data;
  } catch (error) {
    console.error('Failed to fetch user applications:', error);
    throw error;
  }
};

const deleteAppliedJob = async ({ userId, jobId }) => {
  try {
    await axios.delete(`http://localhost:5001/user/${userId}/job/${jobId}`);
  } catch (error) {
    console.error('Failed to delete job application:', error);
    throw error;
  }
};

const fetchSuggestedJobs = async (userId) => {
  try {
    const response = await axios.get(`http://localhost:5001/suggestjobs/${userId}`);
    return response?.data?.data;
  } catch (error) {
    console.error('Failed to fetch suggested jobs:', error);
    throw error;
  }
};

const CandidateHome = () => {
  const [openJob, setOpenJob] = useState(false);
  const [openSuggestions, setOpenSuggestions] = useState(false);
  const [openMyAccount, setOpenMyAccount] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [selectedJob1, setSelectedJob1] = useState(null);
  const queryClient = useQueryClient();
  const { userId } = useParams();

  const {
    data: userApplications ,
    error: userApplicationsError,
    isLoading: userApplicationsLoading,
  } = useQuery({
    queryKey: ["userApplications", userId],
    queryFn: () => fetchUserApplications(userId).then((res) => res || []),
  });
  
  const {
    data: suggestedJobs ,
    error: suggestedJobsError,
    isLoading: suggestedJobsLoading,
  } = useQuery({
    queryKey: ["suggestedJobs", userId],
    queryFn: () => fetchSuggestedJobs(userId).then((res) => res || []),
  });
  

  const mutation = useMutation({
    mutationFn: deleteAppliedJob,
    onSuccess: () => {
      queryClient.invalidateQueries(['userApplications', userId]);
    },
  });

  const mutationApply = useMutation({
    mutationFn: async ({ jobId }) => {
      return axios.post("http://localhost:5001/jobsapplieds", { userId, jobId });
    },
    onSuccess: () => {
      setSelectedJob(null)
      alert(`You have applied for the ${selectedJob.title} position.`);
      queryClient.invalidateQueries(['userApplications', userId])
    },
    onError: (error) => {
      console.error("Failed to apply for job:", error);
      alert("Failed to apply for the job.");
    },
  });

  const handleDelete = (jobId) => {
    mutation.mutate({ userId, jobId });
  };

  const handleJobClick = () => {
    setOpenJob(!openJob);
  };

  const handleSuggestionsClick = () => {
    setOpenSuggestions(!openSuggestions);
  };

  const handleAccountClick = () => {
    setOpenMyAccount(!openMyAccount);
  };

  const handleOpenPopup = (job) => {
    setSelectedJob(job);
  };


  const handleClosePopup = () => {
    setSelectedJob(null);
  };

  const handleOpenPopup1 = (appliedjob) => {
    console.log('Opening popup for applied job:', appliedjob);
    setSelectedJob1(appliedjob);
    console.log(appliedjob)
  };
  


  const handleClosePopup1 = () => {
    setSelectedJob1(null);
  };

  const handleApply = () => {
    const jobId = selectedJob.id;
    const jobTitle = selectedJob.title;

    const alreadyApplied = userApplications.some(
      (job) => job.jobId === jobId && job.applicants.title === jobTitle
    );
  
    if (alreadyApplied) {
      alert("You have already applied for this job.");
    } else {
      mutationApply.mutate({ userId, jobId });
    }
  };
  

  if (userApplicationsLoading || suggestedJobsLoading) return <CircularProgress />;
  if (userApplicationsError) return (
    <Alert severity="error">
      Failed to fetch user applications: {userApplicationsError.message}
    </Alert>
  );
  if (suggestedJobsError) return (
    <Alert severity="error">
      Failed to fetch suggested jobs: {suggestedJobsError.message}
    </Alert>
  );


  return (
    <Box sx={{ display: 'flex' }}>
      <Header />
      <Box
        component="main"
        sx={{
          ml: 5,
          mr: 5,
          mt: 10,
          flexGrow: 1,
          p: 3,
          transition: 'margin 0.3s ease',
        }}
      >
        <Container>
          <Typography variant="h4" gutterBottom>
            | Candidate Home
          </Typography>

          <Card>
            <CardContent>
              <Typography variant="h5" component="div">
                My Applications
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click show more to view all applications
              </Typography>
              <Collapse in={openJob}>
                {userApplicationsLoading && <Typography>Loading...</Typography>}
                {userApplicationsError && (
                  <Typography color="error">{`Error: ${userApplicationsError.message}`}</Typography>
                )}
                {userApplications && userApplications.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {userApplications.map((appliedjob) => (
                      <Card key={`${appliedjob.applicants.jobId}-${appliedjob.applicants.title}`}
                      sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                      >
                        <CardContent sx={{ flex: 1 }}>
                          <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          >
                            <Typography variant="h6" component="div">
                              {appliedjob.applicants.title}
                            </Typography>
                            <Grid sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Button
                                onClick={() => handleOpenPopup1(appliedjob.applicants)}
                                color="primary"
                                variant="contained"
                              >
                                More Details
                              </Button>
                              <Button
                                sx={{ ml: 1 }}
                                onClick={() => handleDelete(appliedjob.jobId)}
                                color="warning"
                                variant="contained"
                              >
                                Delete
                              </Button>
                            </Grid>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography>No applications found.</Typography>
                )}
              </Collapse>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={handleJobClick}>
                {openJob ? 'Show Less' : 'Show More'}
              </Button>
            </CardActions>
          </Card>

          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                Suggested Jobs
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click show more to see suggested jobs based on your experience
              </Typography>
              <Collapse in={openSuggestions}>
                {suggestedJobsLoading && <Typography>Loading...</Typography>}
                {suggestedJobsError && (
                  <Typography color="error">{`Error: ${suggestedJobsError.message}`}</Typography>
                )}
                {suggestedJobs && suggestedJobs.length > 0 ? (
                  <Box sx={{ mt: 2 }}>
                    {suggestedJobs.map((job) => (
                      <Card
                        key={job.id}
                        sx={{ mb: 2, display: 'flex', alignItems: 'center' }}
                      >
                        <CardContent sx={{ flex: 1 }}>
                        <Box
                            sx={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                            }}
                          ><Grid sx={{
                           
                            justifyContent: 'space-between',
                            
                          }}>
                            <Typography variant="h6" component="div">
                              {job.title}
                            </Typography>
                            <Typography variant="body2" color="text.primary">
                              Skills: {job.skills} 
                            </Typography>
                            <Typography variant="body2" color="primary">
                              {job.openPositions} open positions
                            </Typography>
                            </Grid>
                            <Grid>
                            <Button
                                onClick={() => handleOpenPopup(job)}
                                color="primary"
                                variant="contained"
                              >
                                More Details
                              </Button>
                              </Grid>
                          </Box>
                        </CardContent>
                      </Card>
                    ))}
                  </Box>
                ) : (
                  <Typography>No suggested jobs found.</Typography>
                )}
              </Collapse>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={handleSuggestionsClick}>
                {openSuggestions ? 'Show Less' : 'Show More'}
              </Button>
            </CardActions>
          </Card>

          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h5" component="div">
                My Account
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Click more details to update your personal details, experiences,
                education, and to upload a new CV.
              </Typography>
              <Collapse in={openMyAccount}>
              <MyAccountCard />
              <MyExAndEdCard />
              <MyFileCard/>
              </Collapse>
            </CardContent>
            <CardActions>
              <Button size="small" onClick={handleAccountClick}>
                {openMyAccount ? 'Show Less' : 'Show More'}
              </Button>
            </CardActions>
          </Card>
          
          
        </Container>
        <JobPopup
          job={selectedJob}
          isOpen={!!selectedJob}
          onRequestClose={handleClosePopup}
          onApply={handleApply} 
        />
        <JobPopup
          job={selectedJob1}
          isOpen={!!selectedJob1}
          onRequestClose={handleClosePopup1}
          showApplyButton={false}
        />
      </Box>
    </Box>
  );
};

export default withAuth(CandidateHome);
