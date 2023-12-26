import './App.scss';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/home/Home';
import ProfilePage from './pages/Profilepage/Profilepage';
import Repo from './pages/Repo/Repo';
import Commit from './pages/Commit/Commit';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/:profileName" element={<ProfilePage />} />
        <Route path="/:profile/:repoName" element={<Repo />} />
        <Route path="/:profile/:repoName/:commit" element={<Commit />} />
      </Routes>
    </Router>
  )
}

export default App;