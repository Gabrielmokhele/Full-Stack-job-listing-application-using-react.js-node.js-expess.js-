import React, {useContext} from "react";
import { Routes, Route, Navigate, useLocation} from "react-router-dom";
import Homepage from "./Component/Pages/Homepage";
import JobSearch from "./Component/Pages/jobSearch";
import CandidateHome from "./Component/Pages/CandidateHome";
import Profile from "./Component/Pages/Profile";
import FirstStep from "./Component/FirstStep";
import SecondStep from "./Component/SecondStep";
import ThirdStep from "./Component/ThirdStep";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HeaderProvider } from './Component/Header/headerContext';
import { multiStepContext } from "./StepContext";
import withAuth from "./hooks/useAuth"; 


const queryClient = new QueryClient();

function App() {
  const { currentStep } = useContext(multiStepContext);
  const location = useLocation();
  const isAuthenticated = Boolean(currentStep);
  const queryParams = new URLSearchParams(location.search);
  const userId = queryParams.get('UID');


  return (
    <HeaderProvider> 
      <Routes>
      <Route path="/" element={<Homepage />} />
          <Route path="/dashboard/:userId" element={isAuthenticated ? <JobSearch /> : <Navigate to="/" />} />
          <Route path="/profile/:userId" element={isAuthenticated ? <Profile /> : <Navigate to="/" />} />
          <Route path="/jobSearch/:userId" element={isAuthenticated ? <JobSearch /> : <Navigate to="/" />} />
          <Route path="/Candidate/:userId" element={isAuthenticated ? <CandidateHome /> : <Navigate to="/" />} />
          <Route path="/step-1" element={isAuthenticated ? <FirstStep userId={userId} /> : <Navigate to="/" />} />
          <Route path="/step-2" element={isAuthenticated ? <SecondStep userId={userId} /> : <Navigate to="/" />} />
          <Route path="/step-3" element={isAuthenticated ? <ThirdStep userId={userId} /> : <Navigate to="/" />} />
          <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </HeaderProvider>
  );
}


const WrappedApp = withAuth(App);

const Main = () => (
  <QueryClientProvider client={queryClient}>
    <WrappedApp />
  </QueryClientProvider>
);

export default Main;

