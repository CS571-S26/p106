import { useEffect, useMemo, useState } from "react";
import { Alert, Card, Spinner, Table } from "react-bootstrap";
import styles from "./ProfessionLeaderboard.module.css";

const WYNNCRAFT_API_BASE = import.meta.env.DEV ? "/api/wynncraft" : "https://api.wynncraft.com";

const EXCLUDED_TOP_LEVEL_FIELDS = new Set([
    "metaScore",
    "uuid",
    "characterUuid",
    "rank",
    "supportRank",
    "legacyRankColour",
    "rankBadge",
    "banner",
    "restricted",
    "metadata"
]);

const PRIMARY_KEY_ORDER = [
    "score",
    "level",
    "totalLevel",
    "completions",
    "territories",
    "wars",
    "gambits",
    "xp",
    "playtime",
    "created",
    "prefix",
    "characterType"
];

function isPrimitive(value) {
    return value === null || value === undefined || ["string", "number", "boolean"].includes(typeof value);
}

function formatNumeric(value) {
    if (Number.isInteger(value)) return value.toLocaleString("en-US");
    return value.toLocaleString("en-US", { maximumFractionDigits: 2 });
}

function formatPlaytime(value) {
    if (value === null || value === undefined) return "-";
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return "-";
    return `${numericValue.toFixed(2)} hrs`;
}

function prettyLabel(key) {
    if (key === "totalLevel") return "Total Level";
    if (key === "xp") return "XP";
    return key
        .replace(/([a-z])([A-Z])/g, "$1 $2")
        .replace(/^./, (letter) => letter.toUpperCase());
}

function formatCellValue(value, key) {
    if (value === null || value === undefined || value === "") return "-";

    if (typeof value === "number") {
        if (key === "playtime") return formatPlaytime(value);
        return formatNumeric(value);
    }

    if (key === "created") {
        const parsed = Date.parse(value);
        if (!Number.isNaN(parsed)) {
            return new Date(parsed).toLocaleDateString("en-US", {
                year: "numeric",
                month: "short",
                day: "numeric"
            });
        }
    }

    if (typeof value === "boolean") {
        return value ? "Yes" : "No";
    }

    return String(value);
}

function flattenLeaderboardEntry(row) {
    const values = {};

    Object.entries(row).forEach(([key, value]) => {
        if (EXCLUDED_TOP_LEVEL_FIELDS.has(key)) return;
        if (!isPrimitive(value)) return;
        values[key] = value;
    });

    if (!values.name) {
        values.name = "Unknown";
    }

    if (row.metadata && typeof row.metadata === "object") {
        Object.entries(row.metadata).forEach(([key, value]) => {
            if (!isPrimitive(value)) return;
            if (values[key] === undefined) {
                values[key] = value;
            }
        });
    }

    return values;
}

function pickPrimaryKey(values) {
    const matchedKey = PRIMARY_KEY_ORDER.find((key) => values[key] !== undefined);
    if (matchedKey) return matchedKey;
    return Object.keys(values).find((key) => key !== "name") ?? null;
}

function buildDetailsText(values, primaryKey) {
    const detailKeys = Object.keys(values).filter((key) => key !== "name" && key !== primaryKey);
    if (detailKeys.length === 0) return "-";

    return detailKeys
        .slice(0, 3)
        .map((key) => `${prettyLabel(key)}: ${formatCellValue(values[key], key)}`)
        .join(" | ");
}

function normalizeLeaderboardRows(payload) {
    return Object.entries(payload ?? {})
        .filter(([position, row]) => /^\d+$/.test(position) && row && typeof row === "object")
        .map(([position, row]) => {
            const values = flattenLeaderboardEntry(row);
            const primaryKey = pickPrimaryKey(values);

            return {
                position: Number(position),
                rowKey: row.uuid ?? row.name ?? position,
                name: values.name ?? "Unknown",
                primaryLabel: primaryKey ? prettyLabel(primaryKey) : "Value",
                primaryValue: primaryKey ? formatCellValue(values[primaryKey], primaryKey) : "-",
                details: buildDetailsText(values, primaryKey),
                restricted: Boolean(row.restricted)
            };
        })
        .sort((left, right) => left.position - right.position);
}

export default function ProfessionLeaderboard({
    leaderboardId,
    resultLimit = 20,
    title = "Leaderboard"
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
                const parsedRows = normalizeLeaderboardRows(payload);
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
                        <span>Loading leaderboard data...</span>
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
                                <th>Rank</th>
                                <th>Name</th>
                                <th>Scoring Method</th>
                                <th>Details</th>
                            </tr>
                        </thead>
                        <tbody>
                            {visibleRows.map((row) => (
                                <tr key={`${row.position}-${row.rowKey}`}>
                                    <td>{row.position}</td>
                                    <td>{row.name}</td>
                                    <td>{`${row.primaryLabel}: ${row.primaryValue}`}</td>
                                    <td>{row.details}</td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                ) : null}
            </Card.Body>
        </Card>
    );
}
