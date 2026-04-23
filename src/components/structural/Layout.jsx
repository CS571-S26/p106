import { Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, Outlet } from "react-router";
import liquidEmerald from "../../assets/liquidEmerald.webp";
import styles from "./Layout.module.css";

export default function Layout() {
    return (
        <div className={styles.layout}>
            <Navbar className={styles.navbar}>
                <Container>
                    <Navbar.Brand as={NavLink} end to="/" className={styles.brand}>
                        <img src={liquidEmerald} alt="Wynnmarket logo" className={styles.brandLogo} />
                        <span>Wynnmarket</span>
                    </Navbar.Brand>
                    <Nav className="ms-auto">
                        <Nav.Link as={NavLink} to="/leaderboards" className={styles.navLink}>
                            Leaderboards
                        </Nav.Link>
                        <Nav.Link as={NavLink} to="/login" className={styles.navLink}>
                            Login
                        </Nav.Link>
                    </Nav>
                </Container>
            </Navbar>
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
}
