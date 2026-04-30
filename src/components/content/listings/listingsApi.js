export const ITEMS_URL = "https://cficcvgkmczstibcahjv.supabase.co/rest/v1/Prices?order=created_at.desc&limit=100";
export const SUPABASE_KEY = "sb_publishable_G2raB45AQ15nbqji1jZwPw_AN_BiMcP";

const FIELD_ALIASES = {
  name: ["Item name", "item name", "item_name", "itemName", "name", "Name", "Item"],
  price: ["price", "Price"],
  quantity: ["quantity", "Quantity", "qty", "Qty", "amount", "Amount"],
};

function readField(item, aliases, fallback = "") {
  const matchingKey = aliases.find((alias) => Object.prototype.hasOwnProperty.call(item, alias));
  return matchingKey ? item[matchingKey] : fallback;
}

function normalizeListing(item, index) {
  const rawId = item.id ?? item.ID ?? index;

  return {
    id: Number(rawId),
    name: readField(item, FIELD_ALIASES.name, "Unknown item"),
    price: readField(item, FIELD_ALIASES.price, 0),
    quantity: readField(item, FIELD_ALIASES.quantity, 0),
  };
}

export async function fetchListings(signal) {
  const response = await fetch(ITEMS_URL, {
    headers: {
      apiKey: SUPABASE_KEY,
    },
    signal,
  });

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  const data = await response.json();
  return Array.isArray(data) ? data.map(normalizeListing).filter((listing) => Number.isFinite(listing.id)) : [];
}
