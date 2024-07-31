import React, { useEffect, useState } from 'react'
import Total from './Total'
// const base = import.meta.env.VITE_BASE_URL || '/'
const base = "http://localhost:3000/tlebrun/"


const Dashboard = () => {
    const [statistics, setStatistics] = useState({ total_books: 0, total_users: 0 })

    useEffect(() => {
        fetch(base+'api/statistics', {
            credentials: 'include'
        })
            .then(response => response.status === 200 ?response.json() :(function(){throw "error"}()))
            .then(data => setStatistics(data))
            .catch(error => console.error('Erreur:', error))
    }, [])

    return (
        <div className="container">
            <h1>Dashboard</h1>
       
            <Total text={"Total des livres"} number={statistics.total_books}/>
            <Total text={"Utilisateurs Enregistrés"} number={statistics.total_users}/>
         
        </div>
    )
}

export default Dashboard