import React from 'react';
import withAuth from '../../hooks/useAuth';
import { Box, Button, Container, Typography, } from '@mui/material';
import Header from '../Header/header';
import { DataGrid, GridToolbar } from '@mui/x-data-grid';


const columns =[
        { field: 'id', headerName: 'Job ID', width: 200 },
        { field: 'title', headerName: 'Title', width: 150, editable: true },
        { field: 'details', headerName: 'Details', width: 300, editable: true },
        { field: 'openPositions', headerName: 'Open Positions', type: 'number', width: 150 },
        { field: 'link', headerName: 'Application Link', width: 200 },
        { field: 'skills', headerName: 'Skills Required', width: 200 },
        { field: 'locationType', headerName: 'Location Type', width: 150 },
        { field: 'employmentType', headerName: 'Employment Type', width: 150 },
      ];

      const rows = [
        {
          id: '123e4567-e89b-12d3-a456-426614174000',
          title: 'Frontend Developer',
          details: 'Work on modern UI projects using cutting-edge technologies.',
          openPositions: 3,
          link: 'https://example.com/apply-frontend',
          skills: 'React, Material-UI, TypeScript',
          locationType: 'Remote',
          employmentType: 'Full-Time',
        },
        {
          id: '223e4567-e89b-12d3-a456-426614174001',
          title: 'Backend Engineer',
          details: 'Develop and maintain server-side applications and databases.',
          openPositions: 2,
          link: 'https://example.com/apply-backend',
          skills: 'Node.js, Express, PostgreSQL',
          locationType: 'On-site',
          employmentType: 'Full-Time',
        },
        {
          id: '323e4567-e89b-12d3-a456-426614174002',
          title: 'DevOps Specialist',
          details: 'Manage cloud infrastructure and CI/CD pipelines.',
          openPositions: 1,
          link: 'https://example.com/apply-devops',
          skills: 'AWS, Docker, Kubernetes',
          locationType: 'Hybrid',
          employmentType: 'Contract',
        },
        {
          id: '423e4567-e89b-12d3-a456-426614174003',
          title: 'UI/UX Designer',
          details: 'Design intuitive user interfaces and optimize user experiences.',
          openPositions: 4,
          link: 'https://example.com/apply-designer',
          skills: 'Figma, Sketch, Wireframing',
          locationType: 'Remote',
          employmentType: 'Part-Time',
        },
        {
          id: '523e4567-e89b-12d3-a456-426614174004',
          title: 'Data Analyst',
          details: 'Analyze data to provide actionable insights.',
          openPositions: 2,
          link: 'https://example.com/apply-analyst',
          skills: 'SQL, Python, Power BI',
          locationType: 'On-site',
          employmentType: 'Full-Time',
        },
        {
          id: '623e4567-e89b-12d3-a456-426614174005',
          title: 'Product Manager',
          details: 'Lead product development and ensure delivery of solutions.',
          openPositions: 1,
          link: 'https://example.com/apply-manager',
          skills: 'Agile, Scrum, Roadmap Planning',
          locationType: 'Hybrid',
          employmentType: 'Full-Time',
        },
      ];
      

const CreateJob = () => {

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
                        | Create Jobs
                    </Typography>
                    <Box sx={{ display: "flex", 
                        justifyContent: "flex-end",
                         marginBottom: "10px",
                          }}>
                        <Button variant="outlined"
                        sx={{
                            background: "linear-gradient(135deg, #ffffff, #ffffff) padding-box, linear-gradient(135deg, #6a82fb, #fc5c7d) border-box",
                            border: "2px solid transparent",
                            color: "#6a82fb",
                            '&:hover': {
                              background: "linear-gradient(135deg, #e1e1f9, #ffe5ec)",
                            },
                          }}>
                            Create Job
                        </Button>
                    </Box>
                    <DataGrid

                        rows={rows}
                        columns={columns}
                        initialState={{
                            pagination: {
                                paginationModel: {
                                    pageSize: 5,
                                },
                            },
                        }}
                        slots={{ toolbar: GridToolbar }}
                        pageSizeOptions={[5]}
                        checkboxSelection
                        disableRowSelectionOnClick
                        sx={{
                            '& .MuiDataGrid-toolbarContainer': {
                              
                              color: "#6a82fb", 
                              fontWeight: 'bold',
                            },
                            '& .MuiButtonBase-root.MuiButton-root': {
                              color: "#6a82fb", 
                            },
                          }}
                       
                    />
                </Container>
            </Box>
        </Box>
    )
}

export default withAuth(CreateJob);
