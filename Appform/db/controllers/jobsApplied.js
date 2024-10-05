'use strict';

const { JobsApplied, User, jobs } = require('../models');

exports.createApplication = async (req, res) => {
  try {
    const { userId, jobId } = req.body;

    const job = await jobs.findByPk(jobId);
    const user = await User.findByPk(userId);

    if (!job || !user) {
      return res.status(404).json({ message: 'Job or User not found' });
    }

    const application = await JobsApplied.create({ userId, jobId });
    return res.status(201).json(application);
  } catch (error) {
    return res.status(500).json({ message: 'Error creating job application', error });
  }
};


exports.getUserApplications = async (req, res) => {
    try {
      const { userId } = req.params;
  
      const applications = await JobsApplied.findAll({
        where: { userId },
        include: [{ model: jobs, as: 'applicants' }]
      });
  
      return res.status(200).json({
        success: true,
        data: applications,
      });
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving job applications',
        error,
      });
    }
  };
  

exports.getJobApplicants = async (req, res) => {
  try {
    const { jobId } = req.params;

    const applicants = await JobsApplied.findAll({
      where: { jobId },
      include: [{ model: User, as: 'user' }] 
    });

    return res.status(200).json(applicants);
  } catch (error) {
    return res.status(500).json({ message: 'Error retrieving job applicants', error });
  }
};

exports.deleteApplication = async (req, res) => {
  try {
    const { userId, jobId } = req.params;

    const application = await JobsApplied.findOne({
      where: { userId, jobId }
    });

    if (!application) {
      return res.status(404).json({ message: 'Job application not found' });
    }

    await application.destroy();
    return res.status(204).send();
  } catch (error) {
    return res.status(500).json({ message: 'Error deleting job application', error });
  }
};
