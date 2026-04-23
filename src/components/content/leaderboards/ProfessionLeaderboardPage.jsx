import { Container } from "react-bootstrap";
import { Link } from "react-router";
import ProfessionLeaderboard from "./ProfessionLeaderboard";
import { formatLeaderboardId } from "./leaderboardCatalog";

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
