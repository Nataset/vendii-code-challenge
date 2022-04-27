import { useContext } from 'react';
import { RepoContext } from '../App';

export default function PageIndexInput() {
    const { inputPageIndexRef, handlePageIndexInput } = useContext(RepoContext);

    return (
        <div>
            <input type="number" placeholder="go to page..." ref={inputPageIndexRef} />
            <button onClick={handlePageIndexInput}>GO</button>
        </div>
    );
}
