import { useEffect, useMemo, useState } from "react";
import { Alert, Card, Spinner, Table } from "react-bootstrap";
import styles from "./ProfessionLeaderboard.module.css";

const WYNNCRAFT_API_BASE = import.meta.env.DEV ? "/api/wynncraft" : "https://api.wynncraft.com";

function formatInteger(value) {
    if (value === null || value === undefined) return "-";
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return "-";
    return numericValue.toLocaleString("en-US");
}

function formatPlaytime(value) {
    if (value === null || value === undefined) return "-";
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return "-";
    return `${numericValue.toFixed(2)} hrs`;
}

function normalizeProfessionRows(payload) {
    return Object.entries(payload ?? {})
        .filter(([position, row]) => /^\d+$/.test(position) && row && typeof row === "object")
        .map(([position, row]) => ({
            position: Number(position),
            name: row.name ?? "Unknown",
            uuid: row.uuid ?? null,
            score: row.score ?? null,
            xp: row.metadata?.xp ?? null,
            playtime: row.metadata?.playtime ?? null,
            characterType: row.characterType ?? "unknown",
            restricted: Boolean(row.restricted)
        }))
        .sort((left, right) => left.position - right.position);
}

export default function ProfessionLeaderboard({
    leaderboardId,
    resultLimit = 20,
    title = "Profession Leaderboard"
}) {
    const [rows, setRows] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const controller = new AbortController();

        async function loadLeaderboard() {
            setLoading(true);
            setError(null);

            try {
                const response = await fetch(
                    `${WYNNCRAFT_API_BASE}/v3/leaderboards/${encodeURIComponent(
                        leaderboardId
                    )}?resultLimit=${resultLimit}`,
                    { signal: controller.signal }
                );

                if (!response.ok) {
                    throw new Error(`Request failed (${response.status})`);
                }

                const payload = await response.json();
                const parsedRows = normalizeProfessionRows(payload);
                setRows(parsedRows);
            } catch (err) {
                if (err.name !== "AbortError") {
                    setError(err.message ?? "Failed to load leaderboard");
                }
            } finally {
                setLoading(false);
            }
        }

        loadLeaderboard();
        return () => controller.abort();
    }, [leaderboardId, resultLimit]);

    const visibleRows = useMemo(() => rows.filter((row) => !row.restricted), [rows]);

    return (
        <Card className={styles.card}>
            <Card.Header className={styles.header}>
                <div>
                    <h2 className={styles.title}>{title}</h2>
                    <code className={styles.key}>{leaderboardId}</code>
                </div>
            </Card.Header>
            <Card.Body>
                {loading ? (
                    <div className={styles.centered}>
                        <Spinner animation="border" size="sm" className="me-2" />
                        <span>Loading profession data...</span>
                    </div>
                ) : null}

                {!loading && error ? <Alert variant="danger">{error}</Alert> : null}

                {!loading && !error && visibleRows.length === 0 ? (
                    <Alert variant="secondary" className="mb-0">
                        No unrestricted entries available.
                    </Alert>
                ) : null}

                {!loading && !error && visibleRows.length > 0 ? (
                    <Table responsive hover className={styles.table}>
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Player</th>
                                <th>Level</th>
                                <th>XP</th>
                                <th>Playtime</th>
                                <th>Class</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleRows.map((row) => (
                                <tr key={`${row.position}-${row.uuid ?? row.name}`}>
                                    <td>{row.position}</td>
                                    <td>{row.name}</td>
                                    <td>{formatInteger(row.score)}</td>
                                    <td>{formatInteger(row.xp)}</td>
                                    <td>{formatPlaytime(row.playtime)}</td>
                                    <td className={styles.classCell}>{row.characterType}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : null}
            </Card.Body>
        </Card>
    );
}
