import { formatItemLabel, titleCase } from "../itemLabels";
import styles from "./MaterialCard.module.css";

function stripHtml(html) {
    const template = document.createElement("template");
    template.innerHTML = html;
    return template.content.textContent?.replace(/\s+/g, " ").trim() ?? "";
}

function formatTierName(tier) {
    return titleCase(String(tier).replace("TIER_", "Tier "));
}

export default function MaterialCard({ itemName, itemData }) {
    const requirementEntries = Object.entries(itemData.requirements ?? {});
    const chanceEntries = Object.entries(itemData.chances ?? {});
    const lore = itemData.lore ? stripHtml(itemData.lore) : "";

    return (
        <article className={styles.card}>
            <header className={styles.header}>
                <div className={styles.iconFrame} aria-hidden="true">
                    <span className={styles.iconText}>{itemData.emblem ?? "material"}</span>
                </div>
                <div className={styles.heading}>
                    <h1>{itemData.displayName ?? itemData.internalName ?? itemName}</h1>
                    <div className={styles.typeLine}>
                        <span>Material</span>
                        {itemData.subType ? <span>{titleCase(itemData.subType)}</span> : null}
                    </div>
                </div>
            </header>

            {requirementEntries.length > 0 ? (
                <section className={styles.section}>
                    <h2>Requirements</h2>
                    <div className={styles.statList}>
                        {requirementEntries.map(([name, value]) => (
                            <div key={name} className={styles.statRow}>
                                <span>{formatItemLabel(name)}</span>
                                <strong>{titleCase(value)}</strong>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            {lore ? (
                <section className={styles.section}>
                    <h2>Use</h2>
                    <p className={styles.lore}>{lore}</p>
                </section>
            ) : null}

            {chanceEntries.length > 0 ? (
                <section className={styles.section}>
                    <h2>Drop Chances</h2>
                    <div className={styles.statList}>
                        {chanceEntries.map(([tier, chance]) => (
                            <div key={tier} className={styles.statRow}>
                                <span>{formatTierName(tier)}</span>
                                <strong>{chance}%</strong>
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            {itemData.subType && itemData.requirements?.level ? (
                <section className={styles.section}>
                    <h2>Gathering</h2>
                    <p className={styles.copy}>
                        This material can be obtained by gathering Lv. {itemData.requirements.level}{" "}
                        {titleCase(itemData.subType)} nodes.
                    </p>
                </section>
            ) : null}
        </article>
    );
}
