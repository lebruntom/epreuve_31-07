import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import './../styles/emprunt.css'

const EmpruntLivre = () => {
 // const base = import.meta.env.VITE_BASE_URL || '/'
    const base = "http://localhost:3000/tlebrun/"
    const location = useLocation()

const [book, setBook] = useState({})
const {id} = useParams()
useEffect(()=>{
    setBook(location.state)
}, [location.state])


const [maxDate, setMaxDate] = useState('');
const [minDate, setMinDate] = useState('');

useEffect(() => {
  const today = new Date();
  const maxDate = new Date(today);

  const formattedMinDate = maxDate.toISOString().split('T')[0];
  setMinDate(formattedMinDate);


  maxDate.setDate(today.getDate() + 30);

  const formattedMaxDate = maxDate.toISOString().split('T')[0];
  setMaxDate(formattedMaxDate);
}, []);

const [selectedDate, setSelectedDate] = useState('')

const [csrfToken, setCsrfToken] = useState("")

const navigate = useNavigate()

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


const handleEmpruntLivre = () => {
    console.log("ici");
    fetch(base+'api/emprunts', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            CSRF: csrfToken
        },
        body: JSON.stringify({
            selectedDate,
            idLivre: id
        }),
        credentials: 'include'
    })
    .then(data => {      navigate("/profile")
    
})
        .catch(error => console.error('Erreur:', error))
}

    return (
        <div className='containerdd'>
          {book.statut === "disponible"  ? <>
        <div className='flex'>
            <img className="book-image" src={book.photo_url} alt={book.titre} />
            <div>{book.titre}</div>
                                <div>écrit par {book.auteur}</div>
                                <div>publié le {book.date_publication}</div>
            {/* Vous souhaitez emprunter le livre {location?.state.} */}
        </div>
        <div>Veuillez sélectionnez une date de retour :</div>
        <div className='margin_top'>
            <label htmlFor="date-input">Date de retour souhaité</label>
            <input type="date" id="date-input" min={minDate} max={maxDate} value={selectedDate} onChange={(e)=> setSelectedDate(e.target.value)}/>
        </div>
        <button disabled={selectedDate  !== '' ? false: true} onClick={handleEmpruntLivre}>Emprunter</button>
        </> : <div>Ce livre n'est pas disponible pour un emprunt</div>}
        </div>
    );
};

export default EmpruntLivre;