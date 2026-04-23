import { Link } from "react-router";
import { Badge, Card, Col, Container, ListGroup, Row } from "react-bootstrap";
import { LEADERBOARD_CATEGORIES, formatLeaderboardId } from "./leaderboardCatalog";
import styles from "./Leaderboards.module.css";

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
                                            <Link to={`/leaderboards/${type}`} className={styles.professionLink}>
                                                <span className={styles.leaderboardLabel}>
                                                    {formatLeaderboardId(type)}
                                                </span>
                                                <code className={styles.leaderboardKey}>{type}</code>
                                            </Link>
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
