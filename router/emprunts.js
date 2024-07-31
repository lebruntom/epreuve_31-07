const express = require("express");
const router = express.Router();
const db = require("./../services/database");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const JWT_SECRET = "HelloThereImObiWan";

function authenticateToken(req, res, next) {
  const token = req.cookies.token;
  if (!token) return res.sendStatus(401);

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.sendStatus(403);
    req.user = user;
    next();
  });
}

function getFormattedDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0"); // Les mois sont indexés à partir de 0
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

router

  .get("/", authenticateToken, (req, res) => {
    const sql =
      "SELECT * FROM emprunts e JOIN livres l ON l.id = e.id_livre  where e.id_utilisateur = ?";
    db.query(sql, [req.user.id], (err, results) => {
      if (err) throw err;
      res.json(results);
    });
  })

  .post("/", authenticateToken, (req, res) => {
    const { selectedDate, idLivre } = req.body;
    console.log(req.user.id);
    const today = getFormattedDate();

    const sql =
      "INSERT INTO emprunts (id_utilisateur, id_livre , date_emprunt, date_retour_emprunt) VALUES (?, ?, ?, ?)";
    db.query(sql, [req.user.id, idLivre, today, selectedDate], (err) => {
      if (err) res.status(400).send("Erreur d'envoi");

      const sql = "UPDATE livres SET statut = 'emprunté' WHERE id = ?";
      db.query(sql, [idLivre], (err) => {
        if (err) res.status(400).send("Erreur d'envoi");
        res.status(200).send("Emprunt reussi");
      });
    });
  })

  .put("/back/:id", authenticateToken, (req, res) => {
    const id = req.params.id;

    const today = getFormattedDate();

    const sql1 =
      "SELECT * FROM emprunts WHERE id_utilisateur = ? AND id_emprunt = ?";
    db.query(sql1, [req.user.id, id], async (err, results) => {
      if (err) throw err;
      if (results.length === 0) {
        return res.status(400).send("Utilisateur non trouvé");
      }

      const sql =
        "UPDATE emprunts SET date_retour_effective = ? WHERE id_emprunt = ?";
      db.query(sql, [today, id], (err) => {
        if (err) res.status(400).send("Erreur d'envoi");

        const sql3 = "UPDATE livres SET statut = 'disponible' WHERE id = ?";
        db.query(sql3, [results[0].id_livre], (err) => {
          if (err) res.status(400).send("Erreur d'envoi");
          res.status(200).send("Retour reussi");
        });
      });
    });
  });

module.exports = router;
