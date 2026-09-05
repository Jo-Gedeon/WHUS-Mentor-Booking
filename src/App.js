import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import RadioShows from "./pages/RadioShows";
import StudioB from "./pages/StudioB";

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <nav>
          <Link to="/radio-shows">Radio Shows</Link>
          {" | "}
          <Link to="/studio-b">Studio B</Link>
        </nav>

        <Routes>
          <Route path="/radio-shows" element={<RadioShows />} />
          <Route path="/studio-b" element={<StudioB />} />
          {/* default: send "/" to one of the calendars */}
          <Route path="/" element={<Navigate to="/radio-shows" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
