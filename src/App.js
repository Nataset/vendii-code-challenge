import './styles/App.css';
import { useState, useEffect, useRef, createContext } from 'react';
import axios from 'axios';
import linkParse from 'parse-link-header';
import Repo from './component/Repo';

export const RepoContext = createContext();

function App() {
    let [repoPageData, setRepoPageData] = useState([]);
    let [linkData, setLinkData] = useState({});
    let [url, setUrl] = useState(process.env.REACT_APP_BASE_URL);
    let [pageIndex, setPageIndex] = useState(1);
    let inputPageIndexRef = useRef(null);

    const processRepoData = newRepoData => {
        let count = 0;
        let pageData = [];
        let newRepoPageData = repoPageData;
        newRepoData.forEach(repo => {
            count++;
            pageData.push(repo);
            if (count >= 10) {
                newRepoPageData.push(pageData);
                pageData = [];
                count = 0;
            }
        });
        if (pageData.length !== 0) {
            newRepoPageData.push(pageData);
        }
        return newRepoPageData;
    };

    const fetchData = async () => {
        const response = await axios.get(url, {
            headers: {
                Authorization: process.env.REACT_APP_GITHUB_TOKEN,
            },
        });
        const linkHeader = response.headers.link;
        const newPageData = processRepoData(response.data);
        setRepoPageData(newPageData);
        console.log(repoPageData);
        setLinkData(linkParse(linkHeader));
    };

    const fetchMorePage = async pageIndex => {
        while (typeof repoPageData[pageIndex] == 'undefined') {
            console.log('fetchMore run');
            setUrl(linkData.next.url);
            await fetchData();
        }
    };

    const handleClick = n => {
        if (pageIndex > 1 || n !== -1) {
            setPageIndex((pageIndex += n));
            if (pageIndex >= repoPageData.length) {
                fetchMorePage(pageIndex);
            }
        }
    };

    const handlePageIndexInput = () => {
        const newPageIndex = parseInt(inputPageIndexRef.current.value);
        setPageIndex(newPageIndex);
        fetchMorePage(newPageIndex);
    };

    useEffect(() => {
        fetchData().then(() => console.log('Use effect is runned'));
    }, []);

    return (
        <div className="App">
            <RepoContext.Provider className="App" value={{ repoPageData, pageIndex }}>
                <h1>Page Number: {pageIndex}</h1>
                <Repo></Repo>
                <button
                    onClick={() => {
                        handleClick(1);
                    }}
                >
                    next
                </button>
                <button
                    onClick={() => {
                        handleClick(-1);
                    }}
                >
                    prev
                </button>
                <div>
                    <input type="number" placeholder="go to page..." ref={inputPageIndexRef} />
                    <button onClick={handlePageIndexInput}>GO</button>
                </div>
            </RepoContext.Provider>
        </div>
    );
}

export default App;
