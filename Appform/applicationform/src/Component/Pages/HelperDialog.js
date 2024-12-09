import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Button,
  IconButton,
  Fab,
  Typography,
  List,
  ListItem,
  Card,
  CardContent,
  CardActionArea,
} from "@mui/material";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import SearchIcon from "@mui/icons-material/Search";

const HelperDialog = ({ jobs, onJobSelect  }) => {
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredResults, setFilteredResults] = useState([]);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSearchTerm("");
    setFilteredResults([]);
  };

  const handleSearch = () => {
    if (jobs) {
      const results = jobs.filter((job) =>
        job.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredResults(results);
    }
  };

  // Optionally, handle search on input change if you want real-time results
  useEffect(() => {
    if (searchTerm === "") {
      setFilteredResults([]);
    } else {
      handleSearch();
    }
  }, [searchTerm, jobs]);

  const handleJobClick = (job) => {
    onJobSelect(job); 
    handleClose(); 
  };

  return (
    <>
      <Fab
        color="primary"
        aria-label="help"
        onClick={handleOpen}
        style={{ position: "fixed", bottom: 16, right: 16 }}
      >
        <HelpOutlineIcon />
      </Fab>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        PaperProps={{
          sx: {
            position: "fixed",
            bottom: 80, // Adjust based on your FAB button's position
            right: 16,
            margin: 0,
            width: "400px", // Set a fixed width (adjust as needed)
            height: "60vh", // Set a fixed height
          },
        }}
      >
        <DialogTitle>Need Help?</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Ask a question about navigation..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              endAdornment: (
                <IconButton onClick={handleSearch}>
                  <SearchIcon />
                </IconButton>
              ),
            }}
          />
          {/* Display Filtered Results */}
          <List>
            {filteredResults.length > 0 ? (
              filteredResults.map((job, index) => (
                <ListItem key={index}>
                   <Card
                    variant="outlined"
                    onClick={() => handleJobClick(job)}
                    style={{
                      cursor: "pointer",
                      marginBottom: "2px",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      borderRadius: "8px",
                      width: "100%",
                      height: "auto",
                    }}
                  
                  >
                    <CardActionArea>
                      <CardContent
                      style={{
                        padding: "8px", 
                      }}>
                        <Typography variant="body1" color="textPrimary">
                          {job.title}
                        </Typography>
                      </CardContent>
                    </CardActionArea>
                  </Card>
                </ListItem>
              ))
            ) : (
              <Typography variant="body2" color="textSecondary">
                No jobs found
              </Typography>
            )}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default HelperDialog;
