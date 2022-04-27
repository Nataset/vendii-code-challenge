export default function Button(props) {
    return (
        <button
            onClick={() => {
                props.handleClick(1);
            }}
        >
            {props.word}
        </button>
    );
}
