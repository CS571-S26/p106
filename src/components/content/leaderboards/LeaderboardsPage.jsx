import { Link } from "react-router";
import { Badge, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { PROFESSION_LEADERBOARD_IDS } from "./professionLeaderboards";
import styles from "./Leaderboards.module.css";

const LEADERBOARD_CATEGORIES = [
    {
        id: "guild",
        title: "Guild Rankings",
        description: "Guild progression, territory control, and wars.",
        leaderboards: ["guildLevel", "guildTerritories", "guildWars"]
    },
    {
        id: "global",
        title: "Global Rankings",
        description: "Overall account-level rankings across all players.",
        leaderboards: [
            "combatGlobalLevel",
            "professionsGlobalLevel",
            "totalGlobalLevel",
            "playerContent",
            "globalPlayerContent"
        ]
    },
    {
        id: "solo",
        title: "Solo Rankings",
        description: "Character progression for solo combat and professions.",
        leaderboards: ["combatSoloLevel", "professionsSoloLevel", "totalSoloLevel"]
    },
    {
        id: "profession",
        title: "Profession Levels",
        description: "Skill-specific level rankings for gathering and crafting.",
        leaderboards: PROFESSION_LEADERBOARD_IDS
    },
    {
        id: "completion",
        title: "Boss & War Completions",
        description: "Completion counts for raids, bosses, and war content.",
        leaderboards: [
            "grootslangCompletion",
            "colossusCompletion",
            "orphionCompletion",
            "namelessCompletion",
            "warsCompletion"
        ]
    },
    {
        id: "content",
        title: "Special Content Modes",
        description: "Mode and challenge-specific progression leaderboards.",
        leaderboards: [
            "huntedContent",
            "craftsmanContent",
            "huicContent",
            "ironmanContent",
            "ultimateIronmanContent",
            "hardcoreLegacyLevel",
            "hardcoreContent",
            "huichContent",
            "hicContent",
            "hichContent"
        ]
    },
    {
        id: "sr-players",
        title: "Speedrun Players",
        description: "Player speedrun placements across major encounters.",
        leaderboards: [
            "grootslangSrPlayers",
            "colossusSrPlayers",
            "orphionSrPlayers",
            "namelessSrPlayers",
            "NASrPlayers"
        ]
    },
    {
        id: "sr-guilds",
        title: "Speedrun Guilds",
        description: "Guild speedrun placements across major encounters.",
        leaderboards: [
            "grootslangSrGuilds",
            "colossusSrGuilds",
            "orphionSrGuilds",
            "namelessSrGuilds",
            "NASrGuilds"
        ]
    }
];

const SPECIAL_LABELS = {
    NASrPlayers: "NA Speedrun Players",
    NASrGuilds: "NA Speedrun Guilds",
    huicContent: "HUIC Content",
    huichContent: "HUICH Content",
    hicContent: "HIC Content",
    hichContent: "HICH Content"
};

function formatLeaderboardId(type) {
    if (SPECIAL_LABELS[type]) return SPECIAL_LABELS[type];

    return type
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/\bSr\b/g, "SR")
        .replace(/^./, (letter) => letter.toUpperCase());
}

export default function LeaderboardsPage() {
    return (
        <Container className={styles.page}>
            <header className={styles.pageHeader}>
                <h1 className={styles.title}>Leaderboards</h1>
                <p className={styles.subtitle}>
                    All leaderboard feeds, grouped by category for easier navigation.
                </p>
            </header>

            <Row xs={1} xl={2} className="g-3">
                {LEADERBOARD_CATEGORIES.map((category) => (
                    <Col key={category.id}>
                        <Card className={styles.categoryCard}>
                            <Card.Header className={styles.categoryHeader}>
                                <span>{category.title}</span>
                                <Badge bg="dark" pill className={styles.countBadge}>
                                    {category.leaderboards.length}
                                </Badge>
                            </Card.Header>
                            <Card.Body className={styles.categoryBody}>
                                <p className={styles.categoryDescription}>{category.description}</p>
                                <ListGroup variant="flush">
                                    {category.leaderboards.map((type) => (
                                        <ListGroup.Item key={type} className={styles.leaderboardRow}>
                                            {category.id === "profession" ? (
                                                <Link
                                                    to={`/leaderboards/professions/${type}`}
                                                    className={styles.professionLink}
                                                >
                                                    <span className={styles.leaderboardLabel}>
                                                        {formatLeaderboardId(type)}
                                                    </span>
                                                    <code className={styles.leaderboardKey}>{type}</code>
                                                </Link>
                                            ) : (
                                                <>
                                                    <span className={styles.leaderboardLabel}>
                                                        {formatLeaderboardId(type)}
                                                    </span>
                                                    <code className={styles.leaderboardKey}>{type}</code>
                                                </>
                                            )}
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
