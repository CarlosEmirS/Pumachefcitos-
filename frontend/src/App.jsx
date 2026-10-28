import { useEffect, useMemo, useState } from "react";
import { getPlace, getPlaces, login, register, submitReview } from "./api.js";

const emptyFilters = { search: "", zone: "", minPrice: "", maxPrice: "", minRating: "" };

function Stars({ value }) {
  const rounded = Math.round(Number(value) || 0);
  return (
    <span className="stars" aria-label={String(value) + " de 5 estrellas"}>
      {"★".repeat(rounded)}{"☆".repeat(5 - rounded)}
    </span>
  );
}

function App() {
  const [filters, setFilters] = useState(emptyFilters);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notice, setNotice] = useState("");
  const [authMode, setAuthMode] = useState("login");
  const [authOpen, setAuthOpen] = useState(false);
  const [authForm, setAuthForm] = useState({ name: "", email: "", password: "" });
  const [session, setSession] = useState(() => {
    const saved = localStorage.getItem("pumachefcitos-session");
    return saved ? JSON.parse(saved) : null;
  });
  const [reviewForm, setReviewForm] = useState({ overall: 5, food: 5, price: 5, service: 5, comment: "" });

  useEffect(() => { loadPlaces(emptyFilters); }, []);

  async function loadPlaces(nextFilters = filters) {
    setLoading(true);
    setNotice("");
    try { setPlaces(await getPlaces(nextFilters)); }
    catch (error) { setNotice(error.message); }
    finally { setLoading(false); }
  }

  async function openPlace(id) {
    try { setSelectedPlace(await getPlace(id)); }
    catch (error) { setNotice(error.message); }
  }

  async function handleAuth(event) {
    event.preventDefault();
    setNotice("");
    try {
      const action = authMode === "register" ? register : login;
      const payload = authMode === "register"
        ? authForm
        : { email: authForm.email, password: authForm.password };
      const data = await action(payload);
      setSession(data);
      localStorage.setItem("pumachefcitos-session", JSON.stringify(data));
      setAuthOpen(false);
      setAuthForm({ name: "", email: "", password: "" });
      setNotice("¡Bienvenido, " + data.user.name + "!");
    } catch (error) { setNotice(error.message); }
  }

  function logout() {
    localStorage.removeItem("pumachefcitos-session");
    setSession(null);
    setNotice("Sesión cerrada.");
  }

  async function handleReview(event) {
    event.preventDefault();
    if (!session) {
      setAuthMode("login");
      setAuthOpen(true);
      return;
    }

    try {
      await submitReview({ placeId: selectedPlace.id, ...reviewForm }, session.token);
      const refreshed = await getPlace(selectedPlace.id);
      setSelectedPlace(refreshed);
      setReviewForm({ overall: 5, food: 5, price: 5, service: 5, comment: "" });
      setNotice("Tu reseña se guardó correctamente.");
      loadPlaces(filters);
    } catch (error) { setNotice(error.message); }
  }

  const activeFilterCount = useMemo(() => Object.values(filters).filter(Boolean).length, [filters]);

  return (
    <div>
      <header className="topbar">
        <a className="brand" href="#" onClick={() => setSelectedPlace(null)}>
          <span className="brand-mark">PC</span>
          <span><strong>Pumachefcitos</strong><small>Comer bien entre clases</small></span>
        </a>
        <nav>
          <button className="nav-link" onClick={() => setSelectedPlace(null)}>Explorar</button>
          {session ? (
            <div className="session-actions">
              <span>Hola, {session.user.name}</span>
              <button className="button secondary" onClick={logout}>Salir</button>
            </div>
          ) : (
            <button className="button secondary" onClick={() => setAuthOpen(true)}>Iniciar sesión</button>
          )}
        </nav>
      </header>

      <main>
        {!selectedPlace ? (
          <>
            <section className="hero">
              <div className="hero-copy">
                <span className="eyebrow">Facultad de Ingeniería · UNAM</span>
                <h1>Encuentra qué comer sin perder tu siguiente clase.</h1>
                <p>Compara precios, ubicación y opiniones de otros estudiantes en un solo lugar.</p>
                <div className="hero-search">
                  <input
                    aria-label="Buscar establecimiento"
                    placeholder="Buscar por nombre o algo que se te antoje..."
                    value={filters.search}
                    onChange={(event) => setFilters({ ...filters, search: event.target.value })}
                    onKeyDown={(event) => event.key === "Enter" && loadPlaces()}
                  />
                  <button className="button primary" onClick={() => loadPlaces()}>Buscar</button>
                </div>
              </div>
              <div className="hero-card">
                <span className="hero-emoji">🍽️</span>
                <strong>12 lugares para explorar</strong>
                <p>Datos ficticios para construir y probar el MVP.</p>
              </div>
            </section>

            <section className="content-shell">
              <aside className="filters">
                <div className="section-heading compact">
                  <div><span className="eyebrow">Refina tu búsqueda</span><h2>Filtros</h2></div>
                  {activeFilterCount > 0 && (
                    <button className="text-button" onClick={() => { setFilters(emptyFilters); loadPlaces(emptyFilters); }}>
                      Limpiar
                    </button>
                  )}
                </div>

                <label>Zona
                  <select value={filters.zone} onChange={(event) => setFilters({ ...filters, zone: event.target.value })}>
                    <option value="">Todas</option>
                    <option value="norte">Conjunto Norte</option>
                    <option value="pasillo">Pasillo</option>
                    <option value="sur">Conjunto Sur</option>
                  </select>
                </label>

                <div className="price-grid">
                  <label>Precio desde
                    <input type="number" min="0" placeholder="$0" value={filters.minPrice}
                      onChange={(event) => setFilters({ ...filters, minPrice: event.target.value })} />
                  </label>
                  <label>Precio hasta
                    <input type="number" min="0" placeholder="$150" value={filters.maxPrice}
                      onChange={(event) => setFilters({ ...filters, maxPrice: event.target.value })} />
                  </label>
                </div>

                <label>Calificación mínima
                  <select value={filters.minRating} onChange={(event) => setFilters({ ...filters, minRating: event.target.value })}>
                    <option value="">Cualquiera</option>
                    <option value="3">3★ o más</option>
                    <option value="4">4★ o más</option>
                    <option value="4.5">4.5★ o más</option>
                  </select>
                </label>

                <button className="button primary full" onClick={() => loadPlaces()}>Aplicar filtros</button>
              </aside>

              <section className="places-section">
                <div className="section-heading">
                  <div><span className="eyebrow">Explora</span><h2>Opciones cerca de tus clases</h2></div>
                  <span className="result-count">{places.length} resultados</span>
                </div>

                {notice && <div className="notice">{notice}</div>}
                {loading ? (
                  <div className="empty-state">Cargando lugares...</div>
                ) : places.length === 0 ? (
                  <div className="empty-state">No encontramos opciones con esos filtros.</div>
                ) : (
                  <div className="place-grid">
                    {places.map((place) => (
                      <article className="place-card" key={place.id}>
                        <button className="image-button" onClick={() => openPlace(place.id)}>
                          <img src={place.image_url} alt="" />
                          <span className="zone-chip">{zoneLabel(place.zone)}</span>
                        </button>
                        <div className="place-card-body">
                          <div className="card-title-row">
                            <h3>{place.name}</h3>
                            <span className="rating-badge">★ {place.rating}</span>
                          </div>
                          <p>{place.description}</p>
                          <div className="place-meta">
                            <span>📍 {place.location_text}</span>
                            <span>💵 ${Number(place.price_min).toFixed(0)}–${Number(place.price_max).toFixed(0)}</span>
                          </div>
                          <button className="button ghost full" onClick={() => openPlace(place.id)}>Ver menú y reseñas</button>
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </section>
            </section>
          </>
        ) : (
          <PlaceDetail
            place={selectedPlace}
            session={session}
            reviewForm={reviewForm}
            setReviewForm={setReviewForm}
            onBack={() => setSelectedPlace(null)}
            onSubmitReview={handleReview}
          />
        )}
      </main>

      {authOpen && (
        <div className="modal-backdrop" onMouseDown={() => setAuthOpen(false)}>
          <div className="modal" onMouseDown={(event) => event.stopPropagation()}>
            <button className="modal-close" onClick={() => setAuthOpen(false)}>×</button>
            <span className="eyebrow">Tu cuenta</span>
            <h2>{authMode === "login" ? "Inicia sesión" : "Crea tu cuenta"}</h2>
            <p>Tu cuenta te permitirá publicar y actualizar reseñas.</p>
            <form className="auth-form" onSubmit={handleAuth}>
              {authMode === "register" && (
                <label>Nombre
                  <input required value={authForm.name} onChange={(event) => setAuthForm({ ...authForm, name: event.target.value })} />
                </label>
              )}
              <label>Correo electrónico
                <input type="email" required value={authForm.email} onChange={(event) => setAuthForm({ ...authForm, email: event.target.value })} />
              </label>
              <label>Contraseña
                <input type="password" minLength="8" required value={authForm.password}
                  onChange={(event) => setAuthForm({ ...authForm, password: event.target.value })} />
              </label>
              <button className="button primary full" type="submit">{authMode === "login" ? "Entrar" : "Registrarme"}</button>
            </form>
            <button className="text-button switch-mode" onClick={() => setAuthMode(authMode === "login" ? "register" : "login")}>
              {authMode === "login" ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function PlaceDetail({ place, session, reviewForm, setReviewForm, onBack, onSubmitReview }) {
  return (
    <section className="detail-page">
      <button className="text-button back-button" onClick={onBack}>← Volver a explorar</button>

      <div className="detail-hero">
        <img src={place.image_url} alt="" />
        <div className="detail-overlay">
          <span className="zone-chip">{zoneLabel(place.zone)}</span>
          <h1>{place.name}</h1>
          <div className="detail-rating">
            <span className="rating-badge large">★ {place.rating}</span>
            <span>{place.review_count} reseñas</span>
          </div>
        </div>
      </div>

      <div className="detail-layout">
        <div className="detail-main">
          <section className="panel">
            <span className="eyebrow">Sobre este lugar</span>
            <h2>{place.description}</h2>
            <div className="info-row">
              <span>📍 {place.location_text}</span>
              <span>🕒 {place.opening_hours}</span>
              <span>💵 ${Number(place.price_min).toFixed(0)}–${Number(place.price_max).toFixed(0)}</span>
            </div>
          </section>

          <section className="panel">
            <span className="eyebrow">Qué puedes pedir</span>
            <h2>Menú</h2>
            <div className="menu-list">
              {place.products.map((product) => (
                <div className="menu-item" key={product.id}>
                  <div><strong>{product.name}</strong><p>{product.description}</p></div>
                  <span>${Number(product.price).toFixed(0)}</span>
                </div>
              ))}
            </div>
          </section>

          <section className="panel">
            <span className="eyebrow">Comunidad</span>
            <h2>Reseñas de estudiantes</h2>
            {place.reviews.length === 0 ? (
              <p>Todavía no hay reseñas. Puedes ser la primera persona en opinar.</p>
            ) : (
              <div className="reviews-list">
                {place.reviews.map((review) => (
                  <article className="review-card" key={review.id}>
                    <div className="review-top"><strong>{review.user_name}</strong><Stars value={review.overall} /></div>
                    <p>{review.comment}</p>
                    <div className="review-scores">
                      <span>Comida {review.food}/5</span>
                      <span>Precio {review.price}/5</span>
                      <span>Servicio {review.service}/5</span>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </section>
        </div>

        <aside className="panel review-panel">
          <span className="eyebrow">Comparte tu experiencia</span>
          <h2>Califica este lugar</h2>
          {!session && <p>Al enviar tu reseña te pediremos iniciar sesión.</p>}
          <form onSubmit={onSubmitReview}>
            {[["overall", "General"], ["food", "Comida"], ["price", "Precio"], ["service", "Servicio"]].map(([field, label]) => (
              <label key={field}>{label}
                <select value={reviewForm[field]} onChange={(event) => setReviewForm({ ...reviewForm, [field]: Number(event.target.value) })}>
                  {[5, 4, 3, 2, 1].map((value) => <option key={value} value={value}>{value} / 5</option>)}
                </select>
              </label>
            ))}
            <label>Comentario
              <textarea required minLength="3" rows="5"
                placeholder="¿Qué debería saber otro estudiante antes de venir?"
                value={reviewForm.comment}
                onChange={(event) => setReviewForm({ ...reviewForm, comment: event.target.value })} />
            </label>
            <button className="button primary full" type="submit">Publicar reseña</button>
          </form>
        </aside>
      </div>
    </section>
  );
}

function zoneLabel(zone) {
  return { norte: "Conjunto Norte", pasillo: "Pasillo", sur: "Conjunto Sur" }[zone] || zone;
}

export default App;
