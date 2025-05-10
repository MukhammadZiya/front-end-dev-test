import { Routes, Route } from "react-router-dom";
import { Box } from "@mui/material";
import NavBar from "./components/NavBar";
import TabPanel from "./components/TabPanel";
import UserFormPage from "./components/UserFormPage";

function App() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <NavBar />
      <Routes>
        <Route path="/" element={<TabPanel />} />
        <Route path="/form" element={<UserFormPage />} />
      </Routes>
    </Box>
  );
}

export default App;
