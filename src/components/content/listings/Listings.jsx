import { Link } from "react-router";
import emerald from "../../../assets/emerald.webp";
import emeraldBlock from "../../../assets/emeraldBlock.webp";
import liquidEmerald from "../../../assets/liquidEmerald.webp";
import styles from "./Listings.module.css";

const EMERALDS_PER_BLOCK = 64;
const BLOCKS_PER_LIQUID = 64;
const EMERALDS_PER_LIQUID = EMERALDS_PER_BLOCK * BLOCKS_PER_LIQUID;

const DENOMINATIONS = [
    { key: "liquid", label: "Liquid emeralds", icon: liquidEmerald, value: EMERALDS_PER_LIQUID },
    { key: "block", label: "Emerald blocks", icon: emeraldBlock, value: EMERALDS_PER_BLOCK },
    { key: "emerald", label: "Emeralds", icon: emerald, value: 1 }
];

function getPriceParts(price) {
    let remaining = Math.max(0, Math.floor(Number(price) || 0));

    const parts = DENOMINATIONS.map((denomination) => {
        const count = Math.floor(remaining / denomination.value);
        remaining %= denomination.value;
        return { ...denomination, count };
    }).filter((part) => part.count > 0);

    return parts.length > 0 ? parts : [{ ...DENOMINATIONS[2], count: 0 }];
}

function formatTotalEmeralds(price) {
    const emeralds = Math.max(0, Math.floor(Number(price) || 0));
    return `${emeralds.toLocaleString()} emerald${emeralds === 1 ? "" : "s"}`;
}

function PriceDisplay({ price }) {
    const parts = getPriceParts(price);

    return (
        <div className={styles.priceDisplay} aria-label={formatTotalEmeralds(price)} title={formatTotalEmeralds(price)}>
            {parts.map((part) => (
                <span key={part.key} className={styles.pricePart}>
                    <span className={styles.priceCount}>{part.count.toLocaleString()}</span>
                    <img src={part.icon} alt={part.label} className={styles.priceIcon} />
                </span>
            ))}
        </div>
    );
}

export default function Listings({ id, name, quantity, price, isFavorite = false, onToggleFavorite, showFavoriteAction = false }) {
    const itemPath = `/items/${encodeURIComponent(name)}`;

    return (
        <div className={styles.listingRow}>
            <Link to={itemPath} state={{ itemName: name }} className={styles.listingLink}>
                <div className={styles.itemName}>{name}</div>
                <div className={styles.quantity}>{Number(quantity || 0).toLocaleString()}</div>
                <PriceDisplay price={price} />
            </Link>
            {showFavoriteAction ? (
                <button
                    type="button"
                    className={styles.favoriteButton}
                    aria-label={isFavorite ? `Remove ${name} from favorites` : `Add ${name} to favorites`}
                    title={isFavorite ? "Unstar" : "Star"}
                    onClick={(event) => {
                        event.preventDefault();
                        event.stopPropagation();
                        onToggleFavorite?.(id);
                    }}
                >
                    {isFavorite ? "★" : "☆"}
                </button>
            ) : (
                <span className={styles.favoriteSpacer} aria-hidden="true" />
            )}
        </div>
    );
}
