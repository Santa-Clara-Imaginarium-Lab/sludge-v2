import "./App.css";
import { useNavigate } from 'react-router-dom';

function App() {
  const navigate = useNavigate();

  const handleNavigate = () => {
    navigate('/setup');
  };

  return (
    <div className="App">
      <h1>Sludge V2</h1>
      <button className="button" onClick={handleNavigate}>PreTest Survey</button>
    </div>
  );
}

export default App;
