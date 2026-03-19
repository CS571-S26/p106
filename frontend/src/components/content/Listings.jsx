import { Card, Stack } from "react-bootstrap";
import styles from "./Listings.module.css";

const RARITY_CLASS = {
    mythic: styles.mythic,
    fabled: styles.fabled,
    legendary: styles.legendary,
    rare: styles.rare,
    unique: styles.unique,
    common: styles.common,
    normal: styles.common,
    set: styles.set
};

const RARITY_BORDER_CLASS = {
    mythic: styles.mythicCard,
    fabled: styles.fabledCard,
    legendary: styles.legendaryCard,
    rare: styles.rareCard,
    unique: styles.uniqueCard,
    common: styles.commonCard,
    normal: styles.commonCard,
    set: styles.setCard
};

const join = (...classNames) => classNames.filter(Boolean).join(" ");

function getRarityClass(rarity) {
    if (!rarity) return styles.common;
    return RARITY_CLASS[rarity.toLowerCase()] ?? styles.common;
}

function getCardBorderClass(rarity) {
    if (!rarity) return styles.commonCard;
    return RARITY_BORDER_CLASS[rarity.toLowerCase()] ?? styles.commonCard;
}

function getAvgClass(avgPct) {
    if (!avgPct) return styles.avgNeutral;

    const numericPct = Number.parseFloat(String(avgPct).replace("%", ""));
    if (Number.isNaN(numericPct)) return styles.avgNeutral;
    return numericPct > 100 ? styles.avgHigh : styles.avgGood;
}

export default function Listings({
    name,
    rarity,
    icon,
    rollPct,
    tierText,
    amount,
    price,
    avgPct,
    recorded,
    stats,
    unidentified
}) {
    const rarityClass = getRarityClass(rarity);
    const cardBorderClass = getCardBorderClass(rarity);
    const safeStats = stats ?? [];

    return (
        <Card className={join("h-100 border-2 shadow-sm", styles.listingCard, cardBorderClass)}>
            <Card.Body className="d-flex flex-column p-3">
                <header className="d-flex align-items-center justify-content-center gap-2">
                    {icon ? <img src={icon} alt={`${name} icon`} className={styles.icon} /> : null}
                    <Card.Title as="h5" className={join("mb-0 text-center", styles.title, rarityClass)}>
                        {unidentified ? <span className={styles.unidentified}>Unidentified </span> : null}
                        {name}
                        {rollPct ? <span className={styles.overallPct}>[{rollPct}]</span> : null}
                    </Card.Title>
                </header>

                {safeStats.length > 0 ? (
                    <Stack gap={1} className="mt-3">
                        {safeStats.map((stat, idx) => (
                            <div key={`${stat.name}-${idx}`} className={styles.statRow}>
                                <span
                                    className={join(
                                        styles.statValue,
                                        stat.positive ? styles.positive : styles.negative
                                    )}
                                >
                                    {stat.value}
                                </span>
                                <span className={styles.statName}>{stat.name}</span>
                                <span className={styles.statPct}>[{stat.pct}]</span>
                            </div>
                        ))}
                    </Stack>
                ) : null}

                <div className="mt-auto pt-2">
                    {tierText ? (
                        <p className={join("text-center fw-semibold mb-2", rarityClass)}>{tierText}</p>
                    ) : null}

                    <hr className="my-2 border-secondary-subtle" />

                    <p className="mb-2 small text-secondary-emphasis">
                        Amount
                        <br />
                        <strong className="text-light-emphasis">{amount}</strong>
                    </p>

                    <p className="mb-0 small text-secondary-emphasis">
                        Price
                        <br />
                        <strong className="text-light-emphasis">{price}</strong>
                        {avgPct ? (
                            <small className={styles.priceMeta}>
                                (<span className={getAvgClass(avgPct)}>{avgPct}</span> of avg)
                            </small>
                        ) : null}
                    </p>

                    <footer className={styles.itemFooter}>
                        <small>{recorded}</small>
                    </footer>
                </div>
            </Card.Body>
        </Card>
    );
}
