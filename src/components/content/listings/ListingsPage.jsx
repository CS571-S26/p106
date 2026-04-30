import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import { Navigate } from "react-router";
import { addFavoriteListing, removeFavoriteListing, subscribeToFavorites } from "../../../firebase/favorites";
import { useAuth } from "../../../contexts/useAuth";
import Listings from "./Listings";
import { fetchListings } from "./listingsApi";
import styles from "./Listings.module.css";

export default function ListingsPage({ favoritesOnly = false }) {
    const { currentUser, userLoggedIn } = useAuth();
    const [listings, setListings] = useState([]);
    const [favorites, setFavorites] = useState([]);
    const [status, setStatus] = useState("loading");
    const [error, setError] = useState("");
    const [favoriteError, setFavoriteError] = useState("");

    useEffect(() => {
        const controller = new AbortController();

        async function loadListings() {
            try {
                setListings(await fetchListings(controller.signal));
                setStatus("ready");
            } catch (err) {
                if (err.name === "AbortError") return;
                setError(err.message);
                setStatus("error");
            }
        }

        loadListings();
        return () => controller.abort();
    }, []);

    useEffect(() => {
        if (!currentUser) return undefined;

        const authCredential = { user: currentUser };

        return subscribeToFavorites(
            authCredential,
            (nextFavorites) => {
                setFavorites(nextFavorites);
                setFavoriteError("");
            },
            (err) => setFavoriteError(err.message)
        );
    }, [currentUser]);

    if (favoritesOnly && !userLoggedIn) {
        return <Navigate to="/login" replace />;
    }

    async function handleToggleFavorite(listingId) {
        const authCredential = currentUser ? { user: currentUser } : null;
        const numericListingId = Number(listingId);

        if (!authCredential) {
            setFavoriteError("You must be signed in to favorite listings.");
            return;
        }

        if (!Number.isFinite(numericListingId)) {
            setFavoriteError("This listing does not have a valid numeric id.");
            return;
        }

        const wasFavorite = favorites.includes(numericListingId);
        const previousFavorites = favorites;

        setFavoriteError("");
        setFavorites((currentFavorites) => (
            wasFavorite
                ? currentFavorites.filter((favorite) => favorite !== numericListingId)
                : [...new Set([...currentFavorites, numericListingId])]
        ));

        try {
            if (wasFavorite) {
                await removeFavoriteListing(authCredential, numericListingId);
            } else {
                await addFavoriteListing(authCredential, numericListingId);
            }
        } catch (err) {
            setFavorites(previousFavorites);
            setFavoriteError(err.message);
        }
    }

    const activeFavorites = currentUser ? favorites : [];
    const favoriteSet = new Set(activeFavorites);
    const visibleListings = favoritesOnly
        ? listings.filter((listing) => favoriteSet.has(listing.id))
        : listings;

    return (
        <Container>
            <h1 className={styles.pageTitle}>{favoritesOnly ? "Favorite Listings" : "Trademarket Listings"}</h1>

            <section className={styles.listingsPanel} aria-live="polite">
                <div className={styles.listingHeader}>
                    <span>Item</span>
                    <span>Quantity</span>
                    <span>Price</span>
                    <span className={styles.favoriteHeader}>Favorite</span>
                </div>

                {status === "loading" ? <p className={styles.message}>Loading listings...</p> : null}
                {status === "error" ? <p className={styles.message}>Could not load listings: {error}</p> : null}
                {favoriteError ? <p className={styles.errorMessage}>Could not update favorites: {favoriteError}</p> : null}
                {status === "ready" && visibleListings.length === 0 ? (
                    <p className={styles.message}>{favoritesOnly ? "You do not have any favorite listings yet." : "No listings found."}</p>
                ) : null}

                {visibleListings.map((listing) => (
                    <Listings
                        key={listing.id}
                        {...listing}
                        isFavorite={favoriteSet.has(listing.id)}
                        onToggleFavorite={handleToggleFavorite}
                        showFavoriteAction={userLoggedIn}
                    />
                ))}
            </section>
        </Container>
    );
}
