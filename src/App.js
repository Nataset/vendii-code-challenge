import './App.css';
import { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    let [repoData, setRepoData] = useState([]);

    const fetchData = async () => {
        const response = await axios.get('https://api.github.com/repositories');
        setRepoData(response.data);
    };

    useEffect(() => {
        fetchData();
    }, []);

    return (
        <div className="App">
            <p>{JSON.stringify(repoData)}</p>
        </div>
    );
}

export default App;
