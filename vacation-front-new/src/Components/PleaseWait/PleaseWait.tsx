import "./PleaseWait.css";
import loading from "../../Assets/images/loading.gif";

function PleaseWait(): JSX.Element {
    return (
        <div className="PleaseWait">
			<img src={loading} alt="loading" />
        </div>
    );
}

export default PleaseWait;
