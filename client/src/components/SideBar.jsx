import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import './../styles/sidebar.css'
// const base = import.meta.env.VITE_BASE_URL || '/'
const base = "http://localhost:3000/tlebrun/"


const Sidebar = ({userT}) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        fetch(base+'api/session', {
            credentials: 'include'
        })
        .then(response => {
            if(response.status === 200) return response.json()
            else throw new Error("Account not found")
        })
        .then(data => {
            console.log(data)
            setUser(data.user)
        })
            .catch(error => setUser(null))
    }, [])
    useEffect(() => {
        console.log(userT)
        fetch(base+'api/session', {
            credentials: 'include'
        })
            .then(response => {
                if(response.status === 200) return response.json()
                else throw new Error("Account not found")
            })
            .then(data => setUser(data.user))
            .catch(error => setUser(null))
    }, [userT])


    const [csrfToken, setCsrfToken] = useState("")

    useEffect(() => {

        fetch(base + 'api/csrf-token', {
          method: 'GET', 
          headers: {
            'Content-Type': 'application/json', 
            
          },
        })
        .then(response => response.json()) 
        .then(data => {
          setCsrfToken(data.csrfToken)
        })
        .catch(error => {
          console.error('Erreur lors de la récupération du CSRF token:', error);
        });
      }, []);

    const handleLogout = () => {
        fetch(base+'api/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                CSRF: csrfToken

            },
            credentials: 'include'
        })
            .then(() => {
                setUser(null);
                window.location.href = '/';
            })
    }

    return (
        <nav id="sidebar">
            <ul>
                {user?.role ? (
                    <>
                        <li>Bonjour {user.email}</li>
                        <li style={{textAlign: 'right'}}><i>{user.role}</i></li>
                        <li><Link to="/books">Voir la liste des livres</Link></li>
                        <li><Link to="/profile">Mon profil</Link></li>
                        <li><button onClick={handleLogout}>Déconnexion</button></li>
                    </>
                ) : (
                    <>
                        <li><Link to="/login">Connexion</Link></li>
                        <li><Link to="/register">Inscription</Link></li>
                    </>
                )}
            </ul>
        </nav>
    )
}

export default Sidebar