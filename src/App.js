import { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Topbar from "./scenes/global/Topbar";
import Sidebar from "./scenes/global/Sidebar";
import Dashboard from "./scenes/dashboard";
import Team from "./scenes/team";
import Form from "./scenes/playerEntry";
import Body from './scenes/body'
import Jumping from "./scenes/jumping";
import RotationalPower from "./scenes/rotpower";
import RotationalAccel from "./scenes/rotAccel";
import Speed from "./scenes/speed";
import TrapBarDeadlift from "./scenes/tbdl";
import Proteus from "./scenes/proteus";
import ArmStrength from "./scenes/armStrength"
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./theme";
import DataEntry from "./scenes/dataEntry";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState(true);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="app">
          <Sidebar isSidebar={isSidebar} />
          <main className="content">
            <Topbar setIsSidebar={setIsSidebar} />
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/team" element={<Team />} />
              <Route path="/form" element={<Form />} />
              <Route path="/dataEntry" element={<DataEntry />} />
              <Route path="/armstrength" element={<ArmStrength />} /> 
              <Route path="/speed" element={<Speed />} />
              <Route path="/proteus" element={<Proteus />} /> 
              <Route path="/tbdl" element={<TrapBarDeadlift />} />
              <Route path="/body" element={<Body />} />
              <Route path="/jumping" element={<Jumping />} />
              <Route path="/rotPower" element={<RotationalPower />} />
              <Route path="/rotAccel" element={<RotationalAccel />} />
            </Routes>
          </main>
        </div>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}

export default App;