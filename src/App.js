import './App.css';
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import linkParse from 'parse-link-header';

function App() {
    let [repoData, setRepoData] = useState([]);
    // let [linkData, setLinkData] = useState({});
    // let repoData = useRef([]);
    let linkData = useRef({});
    let [url, setUrl] = useState('https://api.github.com/repositories');

    const handleClick = () => {
        setUrl(linkData.current.next.url);
    };

    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(url, {
                headers: {
                    Authorization: 'token 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',
                },
            });
            const linkHeader = response.headers.link;
            // repoData.current = response.data;
            linkData.current = linkParse(linkHeader);

            setRepoData(response.data);
            // setLinkData(linkParse(linkHeader));
        };

        fetchData().then(() => console.log('Use effect is runned'));
    }, [url]);

    return (
        <div className="App">
            {repoData.map((repo, i) => (
                <p key={i + 1}>
                    No.{i + 1} {repo.name} ID:{repo.id}
                </p>
            ))}
            <button onClick={handleClick}>next</button>
        </div>
    );
}

export default App;
