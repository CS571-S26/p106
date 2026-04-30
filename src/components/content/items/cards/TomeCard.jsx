import { formatItemLabel, titleCase } from "../itemLabels";
import styles from "./TomeCard.module.css";

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

function RequirementSection({ requirements }) {
    const entries = Object.entries(requirements ?? {});
    if (!entries.length) return null;

    return (
        <section className={styles.section}>
            <h2>Requirements</h2>
            <div className={styles.statList}>
                {entries.map(([name, value]) => (
                    <div key={name} className={styles.statRow}>
                        <span>{formatItemLabel(name)}</span>
                        <strong>{titleCase(value)}</strong>
                    </div>
                ))}
            </div>
        </section>
    );
}

function IdentificationSection({ identifications }) {
    const entries = Object.entries(identifications ?? {});
    if (!entries.length) return null;

    return (
        <section className={styles.section}>
            <h2>Identifications</h2>
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

function DropInfo({ itemData }) {
    const dropMeta = itemData.dropMeta;
    if (!dropMeta) return null;

    return (
        <section className={styles.section}>
            <h2>Drop Info</h2>
            <p className={styles.copy}>
                Earned from {titleCase(dropMeta.type)}: <strong>{dropMeta.name}</strong>
                {dropMeta.coordinates ? ` at ${dropMeta.coordinates.join(", ")}` : ""}
            </p>
        </section>
    );
}

export default function TomeCard({ itemName, itemData }) {
    const tierClass = getTierClass(itemData.tier);

    return (
        <article className={`${styles.card} ${tierClass}`}>
            <header className={styles.header}>
                <div className={styles.iconFrame} aria-hidden="true">
                    <span className={styles.iconText}>{itemData.emblem ?? "tome"}</span>
                </div>
                <div className={styles.heading}>
                    <h1>{itemData.displayName ?? itemData.internalName ?? itemName}</h1>
                    <div className={styles.typeLine}>
                        <span>{titleCase(itemData.tier ?? "common")}</span>
                        <span>{titleCase(itemData.subType ?? itemData.type ?? "tome")}</span>
                    </div>
                </div>
            </header>

            <RequirementSection requirements={itemData.requirements} />
            <IdentificationSection identifications={itemData.identifications} />

            <section className={styles.section}>
                <h2>Properties</h2>
                <div className={styles.statList}>
                    {itemData.restriction ? (
                        <div className={styles.statRow}>
                            <span>Restriction</span>
                            <strong>{titleCase(itemData.restriction)}</strong>
                        </div>
                    ) : null}
                    {typeof itemData.allowCraftsman === "boolean" ? (
                        <div className={styles.statRow}>
                            <span>Craftsman Allowed</span>
                            <strong>{itemData.allowCraftsman ? "Yes" : "No"}</strong>
                        </div>
                    ) : null}
                </div>
            </section>

            <DropInfo itemData={itemData} />
        </article>
    );
}
