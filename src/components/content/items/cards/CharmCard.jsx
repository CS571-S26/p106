import { formatItemLabel, titleCase } from "../itemLabels";
import styles from "./CharmCard.module.css";

const TIER_CLASS = {
    common: styles.common,
    unique: styles.unique,
    rare: styles.rare,
    legendary: styles.legendary,
    fabled: styles.fabled,
    mythic: styles.mythic,
    set: styles.set
};

function formatRange(value) {
    if (value && typeof value === "object") {
        const min = value.min ?? value.raw;
        const max = value.max ?? value.raw;
        return min === max ? String(min) : `${min} to ${max}`;
    }

    return String(value);
}

function getTierClass(tier) {
    return TIER_CLASS[String(tier ?? "").toLowerCase()] ?? styles.common;
}

function StatSection({ title, entries }) {
    if (!entries.length) return null;

    return (
        <section className={styles.section}>
            <h2>{title}</h2>
            <div className={styles.statList}>
                {entries.map(([name, value]) => (
                    <div key={name} className={styles.statRow}>
                        <span>{formatItemLabel(name)}</span>
                        <strong>{formatRange(value)}</strong>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function CharmCard({ itemName, itemData }) {
    const tierClass = getTierClass(itemData.tier);
    const baseEntries = Object.entries(itemData.base ?? {});
    const identificationEntries = Object.entries(itemData.identifications ?? {});
    const requirementEntries = Object.entries(itemData.requirements ?? {});

    return (
        <article className={`${styles.card} ${tierClass}`}>
            <header className={styles.header}>
                <div className={styles.iconFrame} aria-hidden="true">
                    <span className={styles.iconText}>{itemData.emblem ?? "charm"}</span>
                </div>
                <div className={styles.heading}>
                    <h1>{itemData.displayName ?? itemData.internalName ?? itemName}</h1>
                    <div className={styles.typeLine}>
                        <span>{titleCase(itemData.tier ?? "common")}</span>
                        <span>{titleCase(itemData.type ?? "charm")}</span>
                    </div>
                </div>
            </header>

            <StatSection title="Requirements" entries={requirementEntries} />
            <StatSection title="Identifications" entries={identificationEntries} />
            <StatSection title="Base Stats" entries={baseEntries} />
        </article>
    );
}
