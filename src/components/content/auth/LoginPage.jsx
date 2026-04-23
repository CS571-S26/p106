import { useState } from "react";
import { Alert, Button, Card, Col, Container, Form, Row } from "react-bootstrap";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
    const [formData, setFormData] = useState({
        username: "",
        password: ""
    });
    const [message, setMessage] = useState(null);

    function handleFieldChange(event) {
        const { name, value } = event.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    }

    function handleSubmit(event) {
        event.preventDefault();
        setMessage(`Login submitted for ${formData.username}.`);
    }

    return (
        <Container className={styles.page}>
            <Row className="justify-content-center">
                <Col xs={12} sm={10} md={8} lg={6} xl={5}>
                    <Card className={styles.card}>
                        <Card.Body>
                            <h1 className={styles.title}>Login</h1>
                            <p className={styles.subtitle}>
                                Access your account to track listings, favorites, and leaderboard history.
                            </p>

                            {message ? (
                                <Alert variant="success" className="mb-3">
                                    {message}
                                </Alert>
                            ) : null}

                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" controlId="loginUsername">
                                    <Form.Label>Username or Email</Form.Label>
                                    <Form.Control
                                        type="text"
                                        name="username"
                                        value={formData.username}
                                        onChange={handleFieldChange}
                                        placeholder="Enter your username or email"
                                        required
                                    />
                                </Form.Group>

                                <Form.Group className="mb-3" controlId="loginPassword">
                                    <Form.Label>Password</Form.Label>
                                    <Form.Control
                                        type="password"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleFieldChange}
                                        placeholder="Enter your password"
                                        required
                                    />
                                </Form.Group>

                                <div className={styles.actions}>
                                    <Button type="submit" variant="success">
                                        Sign In
                                    </Button>
                                    <a href="#/login" className={styles.helpLink}>
                                        Need help?
                                    </a>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
}
