const express = require("express");
const multer = require("multer");
const router = express.Router();
const bodyParser = require('body-parser');

const upload = multer({
  dest: "uploads/",
  limits: { fileSize: 1048576 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === "application/pdf") {
      cb(null, true);
    } else {
      cb(new Error("Only PDF files are allowed"), false);
    }
  },
});

// Controllers
const {
  getAllPersons,
  createPerson,
  getTodoById,
  updateTodo,
  updatePersonData,
  deleteTodo,
} = require("../controllers/forms");
const {
  getAllEducationsAndExpriences,
  createEducationsAndExpriences,
  getEducationsAndExpriencesById,
  updateEducationsAndExpriences,
  deleteEducationsAndExpriences,
} = require("../controllers/experiencesAndEducations");
const {
  getAllMyFiles,
  createMyFile,
  getMyFile,
  updateMyFile,
  deleteMyFile,
} = require("../controllers/myfiles");
const {
  registerUser,
  loginUser,
  refreshToken,
  getUserData,
  updateUserData,
} = require("../controllers/Users");


const {
  deleteApplication,
  getJobApplicants,
  getUserApplications,
  createApplication,
} = require("../controllers/jobsApplied");

const { createJobs, getAllJobs, suggestJobs } = require("../controllers/Jobs");


router.post("/jobs", createJobs);
router.get("/jobs", getAllJobs);
router.get('/suggestjobs/:userId', suggestJobs);

router.get("/persons", getAllPersons);
router.post("/persons", createPerson);
router.patch("/persons/:userId", updatePersonData);

router.post("/educationsandexperiences", createEducationsAndExpriences);
router.get("/educationsandexperiences", getAllEducationsAndExpriences);
// router.get("/educationsandexperiences/:id", getEducationsAndExpriencesById); // Get by ID
// router.patch("/educationsandexperiences/:id", updateEducationsAndExpriences); // Update by ID
// router.delete("/educationsandexperiences/:id", deleteEducationsAndExpriences); // Delete by ID

router.post("/myfiles", upload.single("file"), createMyFile);
// router.get("/myfiles", getAllMyFiles); // List all files
// router.get("/myfiles/:id", getMyFile); // Get a file by ID
// router.patch("/myfiles/:id", upload.single('file'), updateMyFile); // Update a file by ID
// router.delete("/myfiles/:id", deleteMyFile); // Delete a file by ID

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/users/:userId", getUserData);
router.patch("/users/:userId", updateUserData);

router.get("/step-1", (req, res) => {
  res.send("Step 1 page");
});

router.get("/step-2", (req, res) => {
  res.send("Step 2 page");
});

router.get("/step-3", (req, res) => {
  res.send("Step 3 page");
});

router.post("/refresh-token", refreshToken);

router.post("/jobsapplied", createApplication);
router.get("/user/:userId", getUserApplications);
router.get("/job/:jobId", getJobApplicants);
router.delete("/user/:userId/job/:jobId", deleteApplication);

module.exports = router;
// http://localhost:5001/suggestjobs/f6abc2f5-6bd9-45fe-b0e5-67caa57f519e