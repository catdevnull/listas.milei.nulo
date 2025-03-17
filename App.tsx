import React, { useState, useEffect } from "react";

// Interfaz para los datos de usuario
interface Usuario {
  username: string;
  name: string;
  avatar: string;
  banner?: string;
  biography?: string;
  followersCount: number;
  followingCount?: number;
  friendsCount?: number;
  mediaCount?: number;
  isPrivate?: boolean;
  isVerified?: boolean;
  isBlueVerified?: boolean;
  likesCount?: number;
  listedCount?: number;
  location?: string;
  tweetsCount?: number;
  userId?: string;
  canDm?: boolean;
  joined?: string;
  website?: string;
}

const LIST_BUT_NAICER: Record<string, string> = {
  "misa-1900366536683987325.json": "Misa",
  "batalla-cultural-1887428180774166853.json": "Batalla Cultural",
  "el-legado-de-milei-1895967272730312893.json": "EL LEGADO DE MILEI",
  "la-legion-1860870345080648177.json": "La Legion",
  "la-orden-liberal-1856442024137810295.json": "La Orden Liberal",
  "las-fuerzas-de-x-1727800991611797926.json": "LAS FUERZAS DE X",
  "libertarios-organizados-boap-1741097325747994767.json":
    "Libertarios organizados -  BOAP",
  "libertarios-unidos-del-uruguay-1812845733281763576.json":
    "Libertarios Unidos del Uruguay",
  "lla-comuna-7-1861564935492325826.json": "LlA Comuna 7",
};

export function App() {
  const [nombreUsuario, setNombreUsuario] = useState("");
  const [resultado, setResultado] = useState<string[] | null>(null);
  const [tipoResultado, setTipoResultado] = useState<
    "success" | "error" | null
  >(null);
  const [usuariosTop, setUsuariosTop] = useState<Usuario[]>([]);
  const [cargando, setCargando] = useState(false);

  // Cargar los usuarios principales al iniciar
  useEffect(() => {
    cargarUsuariosTop();
  }, []);

  const cargarUsuariosTop = async () => {
    try {
      const respuesta = await fetch("/api/top-usuarios");
      if (!respuesta.ok) {
        throw new Error("Error al cargar usuarios principales");
      }
      const datos = await respuesta.json();
      setUsuariosTop(datos);
    } catch (error) {
      console.error("Error al cargar usuarios top:", error);
    }
  };

  const verificarUsuario = async () => {
    if (!nombreUsuario.trim()) {
      setTipoResultado("error");
      return;
    }

    setCargando(true);
    setResultado(null);

    try {
      const respuesta = await fetch(
        `/api/verificar?username=${encodeURIComponent(nombreUsuario)}`
      );
      if (!respuesta.ok) {
        throw new Error("Error al verificar el usuario");
      }

      const datos = await respuesta.json();

      setResultado(datos.listasNames);
      setTipoResultado("success");
    } catch (error) {
      console.error("Error:", error);
      alert("Error al verificar el usuario. Por favor, intente nuevamente.");
      setTipoResultado("error");
    } finally {
      setCargando(false);
    }
  };

  return (
    <>
      <header>
        <h1>Buscador de Fachos en Twitter</h1>
        <p>Busca la lista negra de los libertarios en Twitter.</p>
      </header>

      <div className="container">
        <div className="search-box" style={{ minHeight: "300px" }}>
          <h2>Buscar usuario en la lista negra</h2>
          <div>
            <input
              type="text"
              value={nombreUsuario}
              onChange={(e) => setNombreUsuario(e.target.value)}
              placeholder="Ingresá tu nombre de usuario"
              onKeyDown={(e) => e.key === "Enter" && verificarUsuario()}
            />
            <button onClick={verificarUsuario}>Buscar</button>
          </div>

          {cargando && <div className="loading">Buscando...</div>}

          {resultado &&
            ((resultado.length > 0 && (
              <div className={`result ${tipoResultado}`}>
                Se encontró al usuario en las siguientes listas:
                <ul>
                  {resultado.map((lista) => (
                    <li key={lista}>{LIST_BUT_NAICER[lista] || lista}</li>
                  ))}
                </ul>
              </div>
            )) || (
              <div className={`result ${tipoResultado}`}>
                No se encontró al usuario en ninguna lista
              </div>
            ))}
        </div>

        <div className="top-users">
          <h2>Top 100 libertarios por Seguidores</h2>
          {usuariosTop.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>Usuario</th>
                  <th>Nombre</th>
                  <th>Seguidores</th>
                </tr>
              </thead>
              <tbody>
                {usuariosTop.map((usuario) => (
                  <tr key={usuario.username}>
                    <td>
                      <img
                        height="60"
                        src={usuario.avatar}
                        alt={usuario.name}
                        loading="lazy"
                      />
                    </td>
                    <td className="hide-on-mobile">@{usuario.username}</td>
                    <td>{usuario.name}</td>
                    <td>{usuario.followersCount.toLocaleString("es-AR")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>Cargando usuarios...</p>
          )}
        </div>
      </div>
    </>
  );
}
