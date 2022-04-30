import './Repo.css';
import { useContext } from 'react';
import { RepoContext } from './App';

export default function Repo() {
    let { repoData, pageIndex } = useContext(RepoContext);

    return (
        <div className="repo">
            {repoData[pageIndex - 1] &&
                repoData[pageIndex - 1].map((repo, i) => (
                    <a href={repo.html_url} key={repo.id}>
                            
                        <div
                            className={`repo__content ${i % 2 === 0 ? 'left' : 'right'}`}
                        >
                            <div className="repo__detail">
                                <h4>Repositories NO: {(pageIndex - 1) * 10 + i + 1}</h4>
                                <p>
                                    Name: {repo.name} ID:{repo.id}
                                </p>
                                <p>
                                    Description {repo.description?.slice(0, 25)}
                                    {repo.description?.length > 25 ? '...' : ''}
                                </p>
                            </div>
                            <div className="repo__owner">
                                <img
                                    src={repo.owner.avatar_url}
                                    height={75}
                                    widht={75}
                                    alt={repo.owner.url}
                                ></img>
                                <p> Owner: {repo.owner.login}</p>
                            </div>
                        </div>
                    </a>
                ))}
        </div>
    );
}
