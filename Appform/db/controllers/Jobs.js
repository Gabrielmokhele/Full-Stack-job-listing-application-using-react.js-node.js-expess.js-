const {JobsApplied,  jobs } = require("../models");

exports.getAllJobs = async (req, res) => {
    try {
      let allJobs = await jobs.findAll();
  
      return res.status(200).json({
        success: true,
        data: allJobs,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Server Error",
        error,
      });
    }
  };

exports.createJobs = async (req, res) => {
    const {
      title,
      image,
      details,
      openPositions,
      link,
      skills,
      locationType,
      employmentType
    } = req.body;
  
    try {
      const job = await jobs.create({
        title,
        image,
        details,
        openPositions,
        link,
        skills,
        locationType,
        employmentType
      });
  
      return res.status(200).json({
        success: true,
        message: "Job created successfully",
        data: job,
      });
    } catch (error) {
      console.log(error);
      return res.status(500).json({
        success: false,
        message: "Error creating job",
        error,
      });
    }
  };

  exports.suggestJobs = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const allJobs = await jobs.findAll();
  
      const appliedJobs = await JobsApplied.findAll({
        where: { userId },
        attributes: ['jobId']
      });
  
      const appliedJobIds = appliedJobs.map(application => application.jobId);
  
      const suggestedJobs = allJobs.filter(job => !appliedJobIds.includes(job.id));
  
      return res.status(200).json({
        success: true,
        data: suggestedJobs,
      });
    } catch (error) {
      console.error('Error suggesting jobs:', error.message);
      return res.status(500).json({
        success: false,
        message: 'Error suggesting jobs',
        error: error.message,
      });
    }
  };