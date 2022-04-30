import './App.css';
import { useState, useEffect, useRef, createContext } from 'react';
import axios from 'axios';
import linkParse from 'parse-link-header';
import Repo from './Repo';

export const RepoContext = createContext(null);

function App() {
    let [repoData, setRepoData] = useState([]);
    let [linkData, setLinkData] = useState({});
    let [loading, setLoading] = useState(false);
    let [url, setUrl] = useState('https://api.github.com/repositories');
    let [pageIndex, setPageIndex] = useState(1);
    let inputIndex = useRef(null);

    const processRepoData = responseData => {
        const processedRepoData = [];
        let pageData = [];
        let count = 0;
        responseData.forEach(repo => {
            count++;
            pageData.push(repo);
            if (count >= 10) {
                processedRepoData.push(pageData);
                pageData = [];
                count = 0;
            }
        });
        return processedRepoData;
    };

    const handleNextClick = () => {
        setPageIndex(pageIndex + 1);
        if (repoData[pageIndex] === undefined) {
            console.log(linkData);
            setUrl(linkData.next.url);
        }
    };

    const handlePrevClick = () => {
        if (pageIndex > 1) {
            setPageIndex(pageIndex - 1);
        }
    };

    const handleInputIndex = async () => {
        const newPageIndex = parseInt(inputIndex.current.value);
        if (newPageIndex > 0) {
            setPageIndex(newPageIndex);
            if (repoData[newPageIndex - 1] === undefined) {
                setUrl(linkData.next.url);
            }
        }
    };

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            let fetchUrl = url;
            let linkDataInLoop = {};
            let processedRepoData = repoData;
            let linkHeader = '';
            while (processedRepoData[pageIndex - 1] === undefined) {
                const response = await axios.get(fetchUrl, 
                    // {
                    // headers: {
                    //     Authorization: `token ${process.env.REACT_APP_GITHUB_TOKEN}`,
                    // },
                    //  }
                );
                linkHeader = response.headers.link;
                linkDataInLoop = linkParse(linkHeader);
                fetchUrl = linkDataInLoop.next.url;
                const newData = processRepoData(response.data);
                processedRepoData = processedRepoData.concat(newData);
            }

            setLinkData(linkParse(linkHeader));
            setRepoData(processedRepoData);
            setLoading(false);
        };
        fetchData().then(() => console.log('Use effect is runned'));
    }, [url]);

    return (
        <RepoContext.Provider value={{ pageIndex, repoData }}>
            <div className="App">
                <h2 style={{ marginBottom: '3em' }}>
                    {'Current Page :'.toUpperCase()} {pageIndex}
                </h2>
                {loading ? (
                    <h1>LOADING...</h1>
                ) : (
                    <div>
                        <Repo></Repo>

                        <div className="button-group">
                            <button onClick={handlePrevClick}>Prev</button>
                            <button onClick={handleNextClick} style={{ marginLeft: '10px' }}>
                                Next
                            </button>
                        </div>

                        <div className="input-group">
                            <input
                                type="number"
                                placeholder="go to page..."
                                ref={inputIndex}
                            ></input>
                            <button onClick={handleInputIndex}>GO</button>
                        </div>
                    </div>
                )}
            </div>
        </RepoContext.Provider>
    );
}

export default App;
