import React, { useState } from 'react'
import { Navigate, Link } from 'react-router'
import { Alert, Button, Card, Col, Container, Form, Row } from 'react-bootstrap'
import { useAuth } from '../../../contexts/useAuth'
import { doCreateUserWithEmailAndPassword } from '../../../firebase/auth'
import styles from './Auth.module.css'

const Register = () => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isRegistering, setIsRegistering] = useState(false)
    const [errorMessage, setErrorMessage] = useState('')

    const { userLoggedIn } = useAuth()

    const onSubmit = async (e) => {
        e.preventDefault()
        if(!isRegistering) {
            if (password !== confirmPassword) {
                setErrorMessage('Passwords do not match.')
                return
            }

            setIsRegistering(true)
            setErrorMessage('')
            try {
                await doCreateUserWithEmailAndPassword(email, password)
            } catch (err) {
                setErrorMessage(err.message)
                setIsRegistering(false)
            }
        }
    }

    return (
        <>
            {userLoggedIn && (<Navigate to={'/'} replace={true} />)}

            <main className={styles.authPage}>
                <Container>
                    <Row className="justify-content-center">
                        <Col xs={12} sm={10} md={7} lg={5} xl={4}>
                            <Card className={styles.authCard}>
                                <Card.Body>
                                    <Card.Title as="h1" className={styles.authTitle}>Create a New Account</Card.Title>
                                    <Form onSubmit={onSubmit} className={styles.authForm}>
                                        <Form.Group controlId="registerEmail">
                                            <Form.Label>Email</Form.Label>
                                            <Form.Control
                                                type="email"
                                                autoComplete="email"
                                                required
                                                value={email}
                                                onChange={(e) => { setEmail(e.target.value) }}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="registerPassword">
                                            <Form.Label>Password</Form.Label>
                                            <Form.Control
                                                disabled={isRegistering}
                                                type="password"
                                                autoComplete="new-password"
                                                required
                                                value={password}
                                                onChange={(e) => { setPassword(e.target.value) }}
                                            />
                                        </Form.Group>

                                        <Form.Group controlId="registerConfirmPassword">
                                            <Form.Label>Confirm Password</Form.Label>
                                            <Form.Control
                                                disabled={isRegistering}
                                                type="password"
                                                autoComplete="new-password"
                                                required
                                                value={confirmPassword}
                                                onChange={(e) => { setConfirmPassword(e.target.value) }}
                                            />
                                        </Form.Group>

                                        {errorMessage && (
                                            <Alert variant="danger" className={styles.authAlert}>{errorMessage}</Alert>
                                        )}

                                        <Button type="submit" disabled={isRegistering} className={styles.primaryButton}>
                                            {isRegistering ? 'Signing Up...' : 'Sign Up'}
                                        </Button>
                                        <p className={styles.authSwitch}>
                                            Already have an account? <Link to={'/login'}>Continue</Link>
                                        </p>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </Col>
                    </Row>
                </Container>
            </main>
        </>
    )
}

export default Register
