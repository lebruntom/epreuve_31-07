import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
// const base = import.meta.env.VITE_BASE_URL || '/'
const base = "http://localhost:3000/tlebrun/"


const Login = ({setUserT}) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()

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


    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        try {
            const response = await fetch(base+'api/users/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    CSRF: csrfToken

                },
                body: JSON.stringify({ email, password }),
                credentials: 'include'
            })

            const data = await response.json()

            if (response.ok) {
                setUserT(data)
                navigate('/dashboard') // Redirige vers le tableau de bord après une connexion réussie
            } else {
                setError(data.message || 'Une erreur est survenue. Veuillez réessayer.')
            }
        } catch (err) {
            setError('Une erreur est survenue. Veuillez réessayer.')
        }
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Mot de passe"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />
                <button type="submit">Se connecter</button>
            </form>
            {error && <p>{error}</p>}
            <p>Vous n'avez pas de compte ? <a href={`${base}/register`}>S'inscrire</a></p>
        </div>
    )
}

export default Login