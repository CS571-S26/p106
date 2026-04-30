import { Button, Container, Nav, Navbar } from "react-bootstrap";
import { NavLink, Outlet, useNavigate } from "react-router";
import { doSignOut } from "../../firebase/auth";
import { useAuth } from "../../contexts/useAuth";
import liquidEmerald from "../../assets/liquidEmerald.webp";
import styles from "./Layout.module.css";

export default function Layout() {
    const navigate = useNavigate();
    const { userLoggedIn } = useAuth();

    function handleSignOut() {
        doSignOut().then(() => {
            navigate("/login");
        });
    }

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
                        {userLoggedIn ? (
                            <Nav.Link as={NavLink} to="/favorites" className={styles.navLink}>
                                Favorites
                            </Nav.Link>
                        ) : null}
                        {userLoggedIn ? (
                            <Button variant="link" className={styles.navButton} onClick={handleSignOut}>
                                Logout
                            </Button>
                        ) : (
                            <Nav.Link as={NavLink} to="/login" className={styles.navLink}>
                                Login
                            </Nav.Link>
                        )}
                    </Nav>
                </Container>
            </Navbar>
            <div className={styles.content}>
                <Outlet />
            </div>
        </div>
    );
}
