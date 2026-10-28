export function errorHandler(error, req, res, next) {
  console.error(error);

  if (error.code === "23505") {
    return res.status(409).json({ message: "El registro ya existe." });
  }

  if (error.code === "23503") {
    return res.status(404).json({ message: "El recurso relacionado no existe." });
  }

  res.status(500).json({ message: "Ocurrió un error interno." });
}
