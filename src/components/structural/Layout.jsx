import { Container, Navbar } from "react-bootstrap";
import { Outlet } from "react-router";
import styles from "./Layout.module.css";

export default function Layout() {
    return (
        <div className={styles.layout}>
            <Navbar className={styles.navbar}>
                <Container>
                    <Navbar.Brand className={styles.brand}>WynnTrading</Navbar.Brand>
                </Container>
            </Navbar>
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
}
