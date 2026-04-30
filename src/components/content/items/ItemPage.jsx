import { useEffect, useMemo, useState } from "react";
import { Container } from "react-bootstrap";
import { Link, useLocation, useParams } from "react-router";
import CharmCard from "./cards/CharmCard";
import EquipmentCard from "./cards/EquipmentCard";
import IngredientCard from "./cards/IngredientCard";
import MaterialCard from "./cards/MaterialCard";
import ToolCard from "./cards/ToolCard";
import TomeCard from "./cards/TomeCard";
import styles from "./ItemPage.module.css";

const ITEMS_URL = "https://cficcvgkmczstibcahjv.supabase.co/rest/v1/Items";
const SUPABASE_KEY = "sb_publishable_G2raB45AQ15nbqji1jZwPw_AN_BiMcP";

function normalizeItemRow(row) {
    return {
        id: row.id ?? row.ID ?? row.item_name,
        itemName: row.item_name ?? row.itemName ?? row["Item name"] ?? row.name ?? row.Name,
        itemType: row.item_type ?? row.itemType ?? row.type ?? row.Type,
        itemData: row.item_data ?? row.itemData ?? row.data ?? row.Data ?? {}
    };
}

function getLookupItemName(itemName) {
    return itemName.replace(/^shiny\s+/i, "");
}

function buildItemQuery(itemName) {
    const params = new URLSearchParams({
        item_name: `eq.${getLookupItemName(itemName)}`,
        limit: "1"
    });

    return `${ITEMS_URL}?${params.toString()}`;
}

async function fetchItem(itemName, signal) {
    const headers = { apiKey: SUPABASE_KEY };
    const response = await fetch(buildItemQuery(itemName), { headers, signal });

    if (!response.ok) {
        throw new Error(`Request failed with status ${response.status}`);
    }

    const data = await response.json();
    const item = Array.isArray(data) ? data[0] : null;

    return item ? normalizeItemRow(item) : null;
}

function UnsupportedItemCard({ item }) {
    return (
        <article className={styles.unsupportedCard}>
            <h1>{item.itemName}</h1>
            <p>No card exists for item type "{item.itemType ?? "unknown"}" yet.</p>
            <pre>{JSON.stringify(item.itemData, null, 2)}</pre>
        </article>
    );
}

function ItemCard({ item }) {
    switch (item.itemType?.toLowerCase()) {
        case "accessory":
        case "armour":
        case "weapon":
            return <EquipmentCard itemName={item.itemName} itemData={item.itemData} />;
        case "charm":
            return <CharmCard itemName={item.itemName} itemData={item.itemData} />;
        case "ingredient":
            return <IngredientCard itemName={item.itemName} itemData={item.itemData} />;
        case "material":
            return <MaterialCard itemName={item.itemName} itemData={item.itemData} />;
        case "tool":
            return <ToolCard itemName={item.itemName} itemData={item.itemData} />;
        case "tome":
            return <TomeCard itemName={item.itemName} itemData={item.itemData} />;
        default:
            return <UnsupportedItemCard item={item} />;
    }
}

export default function ItemPage() {
    const { itemName: encodedItemName } = useParams();
    const location = useLocation();
    const itemName = useMemo(
        () => location.state?.itemName ?? decodeURIComponent(encodedItemName ?? ""),
        [encodedItemName, location.state]
    );
    const [item, setItem] = useState(null);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadItem() {
            try {
                setStatus("loading");
                const nextItem = await fetchItem(itemName, controller.signal);
                setItem(nextItem);
                setStatus(nextItem ? "ready" : "not-found");
            } catch (err) {
                if (err.name === "AbortError") return;
                setError(err.message);
                setStatus("error");
            }
        }

        loadItem();
        return () => controller.abort();
    }, [itemName]);

    return (
        <Container>
            <Link to="/" className={styles.backLink}>Back to listings</Link>
            <div className={styles.pageShell}>
                {status === "loading" ? <p className={styles.message}>Loading {itemName}...</p> : null}
                {status === "error" ? <p className={styles.message}>Could not load item: {error}</p> : null}
                {status === "not-found" ? <p className={styles.message}>No item data found for {itemName}.</p> : null}
                {status === "ready" ? <ItemCard item={item} /> : null}
            </div>
        </Container>
    );
}
