import { formatItemLabel, titleCase } from "../itemLabels";
import styles from "./ToolCard.module.css";

export default function ToolCard({ itemName, itemData }) {
    const requirementEntries = Object.entries(itemData.requirements ?? {});

    return (
        <article className={styles.card}>
            <header className={styles.header}>
                <div className={styles.iconFrame} aria-hidden="true">
                    <span className={styles.iconText}>{itemData.emblem ?? itemData.subType ?? "tool"}</span>
                </div>
                <div className={styles.heading}>
                    <h1>{itemData.displayName ?? itemData.internalName ?? itemName}</h1>
                    <div className={styles.typeLine}>
                        <span>{titleCase(itemData.tier ?? "normal")}</span>
                        <span>{titleCase(itemData.subType ?? itemData.type ?? "tool")}</span>
                    </div>
                </div>
            </header>

            <section className={styles.heroStats}>
                {itemData.gatheringSpeed ? (
                    <div>
                        <strong>{itemData.gatheringSpeed}</strong>
                        <span>Gathering Speed</span>
                    </div>
                ) : null}
                {itemData.durability ? (
                    <div>
                        <strong>{itemData.durability}</strong>
                        <span>Durability</span>
                    </div>
                ) : null}
            </section>

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
        </article>
    );
}
