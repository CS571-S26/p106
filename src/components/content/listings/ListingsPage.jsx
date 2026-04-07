import { Col, Container, Row } from "react-bootstrap";
import Listings from "./Listings";
import liquidEmerald from "../../../assets/liquidEmerald.webp";
//test
const MOCK_LISTINGS = [
    {
        id: 1,
        name: "Fatal",
        rarity: "Mythic",
        icon: liquidEmerald,
        rollPct: "72.7%",
        tierText: "Mythic Item [3]",
        amount: 1,
        price: "2stx 16le",
        avgPct: "99.7%",
        recorded: "0 minutes ago",
        stats: [
            { value: "7", name: "Mana Steal", pct: "83.3%", positive: true },
            { value: "25%", name: "Spell Damage", pct: "68.0%", positive: true },
            { value: "13%", name: "Walk Speed", pct: "53.3%", positive: true },
            { value: "-23%", name: "1st Spell Cost", pct: "81.2%", positive: false }
        ]
    },
    {
        id: 2,
        name: "Viral Tentacle",
        rarity: "Common",
        icon: liquidEmerald,
        tierText: "Common Item",
        amount: 1,
        price: "21e",
        avgPct: "14.7%",
        recorded: "0 minutes ago",
        stats: []
    },
    {
        id: 3,
        name: "Darkweaver",
        rarity: "Rare",
        icon: liquidEmerald,
        unidentified: true,
        tierText: "Rare Item",
        amount: 1,
        price: "12eb 38e",
        avgPct: "50.8%",
        recorded: "0 minutes ago",
        stats: []
    },
    {
        id: 4,
        name: "Stardew",
        rarity: "Mythic",
        icon: liquidEmerald,
        rollPct: "61.5%",
        tierText: "Mythic Item [4]",
        amount: 1,
        price: "35le 44eb 51e",
        avgPct: "48.6%",
        recorded: "2 minutes ago",
        stats: [
            { value: "11", name: "Mana Steal", pct: "40.0%", positive: true },
            { value: "26%", name: "Reflection", pct: "72.0%", positive: true },
            { value: "-15", name: "Mana Regen", pct: "60.0%", positive: false },
            { value: "45%", name: "Thunder Damage", pct: "97.1%", positive: true }
        ]
    }
];

export default function ListingsPage() {
    return (
        <Container>
            <h1>Trademarket Listings</h1>
            <Row xs={1} sm={2} lg={3} xl={4} xxl={5}>
                {MOCK_LISTINGS.map((listing) => (
                    <Col key={listing.id}>
                        <Listings {...listing} />
                    </Col>
                ))}
            </Row>
        </Container>
    );
}
