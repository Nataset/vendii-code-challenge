import { useContext } from 'react';
import { RepoContext } from '../App';

export default function Repo() {
    const { repoPageData, pageIndex } = useContext(RepoContext);

    return (
        <div>
            {repoPageData.length > 0 &&
                repoPageData.length > pageIndex &&
                repoPageData[pageIndex - 1].map((repo, i) => (
                    <p key={i + 1}>
                        No.{i + 1} {repo.name} ID:{repo.id}
                    </p>
                ))}
        </div>
    );
}
