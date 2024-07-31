import React, { useEffect, useState } from 'react';
import dayjs from"dayjs"
const Profile = () => {

    const [books, setBooks] = useState([])
    // const base = import.meta.env.VITE_BASE_URL || '/'
    const base = "http://localhost:3000/tlebrun/"

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


    useEffect(() => {
        fetch(base+'api/emprunts', {
            credentials: 'include'
        })
            .then(response => response.json())
            .then(data => setBooks(data))
            .catch(error => console.error('Erreur:', error))
        
    }, [])

    
    const handleHome = () => {
        navigate('/')
    }

    const handleBackBook = (id_emprunt) => {
        fetch(base+`api/emprunts/back/${id_emprunt}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                CSRF: csrfToken
            },
          
            credentials: 'include'
        })
        .then(data => {      
            console.log("c'est ok");
            setBooks((ps)=> {
                const idxToUpdate = ps.findIndex((el)=> el.id_emprunt === id_emprunt)
                ps.splice(idxToUpdate, 1, {...ps[idxToUpdate], date_retour_effective: dayjs().format('YYYY-MM-DD')})
                return ([...ps])
            })
        
    })
            .catch(error => console.error('Erreur:', error))
    }



    return (
        <div className="container">
            <h2>Récapitulatifs des emprunts</h2>
            {books.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>Image</th>
                            <th>Titre</th>
                            <th>Auteur</th>
                            <th>Date d'emprunt</th>
                            <th>Date de retour prévu</th>
                            <th>Date de rendu</th>
                        </tr>
                    </thead>
                    <tbody>
                        {books.map(book => (
                            <tr key={book.id} className={dayjs(book.date_retour_emprunt) < dayjs() && !book.date_retour_effective && "red"}>
                                <td><img className="book-image" src={book.photo_url} alt={book.titre} /></td>
                                <td>{book.titre}</td>
                                <td>{book.auteur}</td>
                                <td>{dayjs(book.date_emprunt).format('DD/MM/YYYY')}</td>
                                <td>{dayjs(book.date_retour_emprunt).format('DD/MM/YYYY')}</td>
                                <td>{book.date_retour_effective ? "Rendu le : " + dayjs(book.date_retour_effective).format('DD/MM/YYYY') : <div className='emprunt' onClick={()=> handleBackBook(book.id_emprunt)}>Rendre</div>}</td>  
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Vous n'avez emprunté aucun livre</p>
            )}
           
            <button onClick={handleHome}>Retour à l'accueil</button>
        </div>
    );
};

export default Profile;