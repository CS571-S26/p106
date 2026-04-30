import { formatItemLabel } from "../itemLabels";
import styles from "./IngredientCard.module.css";

const SKILL_LABELS = {
    armouring: "Armouring",
    cooking: "Cooking",
    jeweling: "Jeweling",
    tailoring: "Tailoring",
    weaponsmithing: "Weaponsmithing",
    woodworking: "Woodworking"
};

function formatTier(tier) {
    const tierNumber = Number.parseInt(String(tier ?? "").replace(/\D/g, ""), 10);
    return Number.isFinite(tierNumber) && tierNumber > 0 ? tierNumber : 1;
}

function formatValue(value) {
    if (value && typeof value === "object") {
        const min = value.min ?? value.raw;
        const max = value.max ?? value.raw;
        return min === max ? String(min) : `${min} to ${max}`;
    }

    return String(value);
}

function formatSkill(skill) {
    return SKILL_LABELS[skill] ?? skill.replace(/^./, (letter) => letter.toUpperCase());
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
                        <strong>{formatValue(value)}</strong>
                    </div>
                ))}
            </div>
        </section>
    );
}

export default function IngredientCard({ itemName, itemData }) {
    const tier = formatTier(itemData.tier);
    const skills = itemData.requirements?.skills ?? [];
    const droppedBy = itemData.droppedBy ?? [];
    const identifications = Object.entries(itemData.identifications ?? {});
    const itemOnlyIDs = Object.entries(itemData.itemOnlyIDs ?? {}).filter(([, value]) => value !== 0);
    const positionModifiers = Object.entries(itemData.ingredientPositionModifiers ?? {}).filter(([, value]) => value !== 0);

    return (
        <article className={styles.card}>
            <header className={styles.header}>
                <div className={styles.iconFrame} aria-hidden="true">
                    <span className={styles.iconText}>{itemData.emblem ?? "item"}</span>
                </div>
                <div className={styles.heading}>
                    <h1>{itemData.displayName ?? itemData.internalName ?? itemName}</h1>
                    <div className={styles.typeLine}>
                        <span className={styles.stars}>{"✦".repeat(tier)}</span>
                        <span>{itemData.type ?? "ingredient"}</span>
                    </div>
                </div>
            </header>

            <div className={styles.divider} />

            <section className={styles.section}>
                <h2>Requirements</h2>
                <div className={styles.requirements}>
                    {itemData.requirements?.level ? (
                        <div className={styles.statRow}>
                            <span>Level</span>
                            <strong>{itemData.requirements.level}</strong>
                        </div>
                    ) : null}
                    {skills.length > 0 ? (
                        <div className={styles.skillList}>
                            {skills.map((skill) => (
                                <span key={skill}>{formatSkill(skill)}</span>
                            ))}
                        </div>
                    ) : null}
                </div>
            </section>

            {droppedBy.length > 0 ? (
                <section className={styles.section}>
                    <h2>Dropped By</h2>
                    <div className={styles.dropList}>
                        {droppedBy.map((drop) => (
                            <div key={`${drop.name}-${drop.coords?.join("-")}`} className={styles.dropRow}>
                                <strong>{drop.name}</strong>
                                {drop.coords ? <span>{drop.coords.join(", ")}</span> : null}
                            </div>
                        ))}
                    </div>
                </section>
            ) : null}

            <StatSection title="Identifications" entries={identifications} />
            <StatSection title="Item Modifiers" entries={itemOnlyIDs} />
            <StatSection title="Position Modifiers" entries={positionModifiers} />
        </article>
    );
}
