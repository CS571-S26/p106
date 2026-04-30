import React from 'react'
import { Link, useNavigate } from 'react-router'
import { Button, Nav, Navbar } from 'react-bootstrap'
import { useAuth } from '../../../contexts/useAuth'
import { doSignOut } from '../../../firebase/auth'
import styles from './Auth.module.css'

const Header = () => {
    const navigate = useNavigate()
    const { userLoggedIn } = useAuth()
    return (
        <Navbar className={styles.authNav}>
            <Nav className={styles.authNavLinks}>
            {
                userLoggedIn
                    ?
                    <>
                        <Button variant="outline-light" size="sm" onClick={() => { doSignOut().then(() => { navigate('/login') }) }}>Logout</Button>
                    </>
                    :
                    <>
                        <Nav.Link as={Link} to={'/login'}>Login</Nav.Link>
                        <Nav.Link as={Link} to={'/register'}>Register New Account</Nav.Link>
                    </>
            }
            </Nav>
        </Navbar>
    )
}

export default Header
