import { Router } from "express";
import { pool } from "../config/db.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const {
      search = "",
      zone = "",
      minPrice = "",
      maxPrice = "",
      minRating = "",
    } = req.query;

    const values = [
      search.trim(),
      zone.trim(),
      minPrice === "" ? null : Number(minPrice),
      maxPrice === "" ? null : Number(maxPrice),
      minRating === "" ? null : Number(minRating),
    ];

    const { rows } = await pool.query(
      `SELECT
         p.*,
         COALESCE(ROUND(AVG(r.overall)::numeric, 1), 0) AS rating,
         COUNT(r.id)::int AS review_count
       FROM places p
       LEFT JOIN reviews r ON r.place_id = p.id
       WHERE
         ($1 = '' OR p.name ILIKE '%' || $1 || '%' OR p.description ILIKE '%' || $1 || '%')
         AND ($2 = '' OR p.zone = $2)
         AND ($3::numeric IS NULL OR p.price_max >= $3)
         AND ($4::numeric IS NULL OR p.price_min <= $4)
       GROUP BY p.id
       HAVING ($5::numeric IS NULL OR COALESCE(AVG(r.overall), 0) >= $5)
       ORDER BY rating DESC, p.name ASC`,
      values
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const id = Number(req.params.id);

    if (!Number.isInteger(id)) {
      return res.status(400).json({ message: "Identificador inválido." });
    }

    const placeResult = await pool.query(
      `SELECT
         p.*,
         COALESCE(ROUND(AVG(r.overall)::numeric, 1), 0) AS rating,
         COUNT(r.id)::int AS review_count
       FROM places p
       LEFT JOIN reviews r ON r.place_id = p.id
       WHERE p.id = $1
       GROUP BY p.id`,
      [id]
    );

    if (!placeResult.rows[0]) {
      return res.status(404).json({ message: "Establecimiento no encontrado." });
    }

    const [productsResult, reviewsResult] = await Promise.all([
      pool.query(
        "SELECT id, name, description, price FROM products WHERE place_id = $1 ORDER BY price, name",
        [id]
      ),
      pool.query(
        `SELECT
           r.id, r.overall, r.food, r.price, r.service, r.comment,
           r.created_at, r.updated_at,
           u.id AS user_id, u.name AS user_name
         FROM reviews r
         JOIN users u ON u.id = r.user_id
         WHERE r.place_id = $1
         ORDER BY r.updated_at DESC`,
        [id]
      ),
    ]);

    res.json({
      ...placeResult.rows[0],
      products: productsResult.rows,
      reviews: reviewsResult.rows,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
