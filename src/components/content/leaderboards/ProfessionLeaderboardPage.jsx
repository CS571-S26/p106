import { Container } from "react-bootstrap";
import { Link } from "react-router";
import ProfessionLeaderboard from "./ProfessionLeaderboard";

function formatLeaderboardId(type) {
    return type
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (letter) => letter.toUpperCase());
}

export default function ProfessionLeaderboardPage({ leaderboardId }) {
    const title = `${formatLeaderboardId(leaderboardId)} Leaderboard`;

    return (
        <Container>
            <p className="mb-3">
                <Link to="/leaderboards">Back to Leaderboards</Link>
            </p>
            <ProfessionLeaderboard leaderboardId={leaderboardId} resultLimit={20} title={title} />
        </Container>
    );
}
