import { Router } from "express";
import { pool } from "../config/db.js";
import { requireAuth } from "../middleware/auth.js";

const router = Router();

router.post("/", requireAuth, async (req, res, next) => {
  try {
    const { placeId, overall, food, price, service, comment } = req.body;
    const ratings = [overall, food, price, service].map(Number);

    if (!Number.isInteger(Number(placeId))) {
      return res.status(400).json({ message: "El establecimiento es obligatorio." });
    }

    if (ratings.some((rating) => !Number.isInteger(rating) || rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Todas las calificaciones deben estar entre 1 y 5." });
    }

    if (!comment?.trim() || comment.trim().length < 3) {
      return res.status(400).json({ message: "Escribe un comentario de al menos 3 caracteres." });
    }

    const { rows } = await pool.query(
      `INSERT INTO reviews
         (user_id, place_id, overall, food, price, service, comment)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       ON CONFLICT (user_id, place_id)
       DO UPDATE SET
         overall = EXCLUDED.overall,
         food = EXCLUDED.food,
         price = EXCLUDED.price,
         service = EXCLUDED.service,
         comment = EXCLUDED.comment,
         updated_at = NOW()
       RETURNING *`,
      [
        req.user.id,
        Number(placeId),
        ratings[0],
        ratings[1],
        ratings[2],
        ratings[3],
        comment.trim(),
      ]
    );

    res.status(201).json(rows[0]);
  } catch (error) {
    next(error);
  }
});

export default router;
