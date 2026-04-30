import { formatItemLabel, titleCase } from "../itemLabels";
import styles from "./EquipmentCard.module.css";

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

function formatSigned(value) {
    if (value && typeof value === "object") return formatRange(value);
    if (typeof value !== "number") return String(value);
    return value > 0 ? `+${value}` : String(value);
}

function stripHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.textContent ?? "";
}

function getTierClass(tier) {
    return TIER_CLASS[String(tier ?? "").toLowerCase()] ?? styles.common;
}

function StatSection({ title, entries, signed = false }) {
    if (!entries.length) return null;

    return (
        <section className={styles.section}>
            <h2>{title}</h2>
            <div className={styles.statList}>
                {entries.map(([name, value]) => (
                    <div key={name} className={styles.statRow}>
                        <span>{formatItemLabel(name)}</span>
                        <strong>{signed ? formatSigned(value) : formatRange(value)}</strong>
                    </div>
                ))}
            </div>
        </section>
    );
}

function RequirementSection({ requirements }) {
    const entries = Object.entries(requirements ?? {});
    if (!entries.length) return null;

    return (
        <section className={styles.section}>
            <h2>Requirements</h2>
            <div className={styles.requirementGrid}>
                {entries.map(([name, value]) => (
                    <div key={name} className={styles.requirementPill}>
                        <span>{formatItemLabel(name)}</span>
                        <strong>{titleCase(value)}</strong>
                    </div>
                ))}
            </div>
        </section>
    );
}

function DropInfo({ itemData }) {
    const dropMeta = itemData.dropMeta;
    const level = itemData.requirements?.level;

    if (dropMeta) {
        return (
            <section className={styles.section}>
                <h2>Drop Info</h2>
                <p className={styles.copy}>
                    Found from {titleCase(dropMeta.type)}: <strong>{dropMeta.name}</strong>
                    {dropMeta.coordinates ? ` at ${dropMeta.coordinates.join(", ")}` : ""}
                </p>
            </section>
        );
    }

    if (itemData.dropRestriction === "normal" && level) {
        return (
            <section className={styles.section}>
                <h2>Drop Info</h2>
                <p className={styles.copy}>This item can be dropped from hostile mobs and loot chests near level {level}.</p>
            </section>
        );
    }

    return null;
}

export default function EquipmentCard({ itemName, itemData }) {
    const tierClass = getTierClass(itemData.tier);
    const baseEntries = Object.entries(itemData.base ?? {});
    const identificationEntries = Object.entries(itemData.identifications ?? {});
    const lore = itemData.lore ? stripHtml(itemData.lore) : "";

    return (
        <article className={`${styles.card} ${tierClass}`}>
            <header className={styles.header}>
                <div className={styles.iconFrame} aria-hidden="true">
                    <span className={styles.iconText}>{itemData.emblem ?? itemData.subType ?? itemData.type}</span>
                </div>
                <div className={styles.heading}>
                    <h1>{itemData.displayName ?? itemData.internalName ?? itemName}</h1>
                    <div className={styles.typeLine}>
                        <span>{titleCase(itemData.tier ?? "common")}</span>
                        <span>{titleCase(itemData.subType ?? itemData.type)}</span>
                    </div>
                    {itemData.elements?.length ? (
                        <div className={styles.elementList}>
                            {itemData.elements.map((element) => (
                                <span key={element}>{titleCase(element)}</span>
                            ))}
                        </div>
                    ) : null}
                </div>
            </header>

            <StatSection title="Base Stats" entries={baseEntries} signed />

            {(itemData.averageDps || itemData.attackSpeed || itemData.powderSlots) ? (
                <section className={styles.section}>
                    <h2>Combat</h2>
                    <div className={styles.statList}>
                        {itemData.averageDps ? (
                            <div className={styles.statRow}>
                                <span>Average DPS</span>
                                <strong>{itemData.averageDps}</strong>
                            </div>
                        ) : null}
                        {itemData.attackSpeed ? (
                            <div className={styles.statRow}>
                                <span>Attack Speed</span>
                                <strong>{titleCase(itemData.attackSpeed)}</strong>
                            </div>
                        ) : null}
                        {itemData.powderSlots ? (
                            <div className={styles.statRow}>
                                <span>Powder Slots</span>
                                <strong>{itemData.powderSlots}</strong>
                            </div>
                        ) : null}
                    </div>
                </section>
            ) : null}

            <RequirementSection requirements={itemData.requirements} />
            <StatSection title="Identifications" entries={identificationEntries} signed />

            {lore ? (
                <section className={styles.section}>
                    <h2>Lore</h2>
                    <p className={styles.lore}>{lore}</p>
                </section>
            ) : null}

            <DropInfo itemData={itemData} />
        </article>
    );
}
