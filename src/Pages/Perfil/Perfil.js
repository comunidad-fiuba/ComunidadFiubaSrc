import styles from "./PerfilAlen.module.css"
import {Link} from "react-router-dom";
import {FcLike} from "react-icons/fc";
import {BsPerson} from "react-icons/bs";
import {useEffect, useState} from "react";
import {ImSpinner8} from "react-icons/im";
import {HiOutlineTrash} from "react-icons/hi";
import {MdSearch, MdSort} from "react-icons/md";
import {httpPostDelete} from "../../Utilidad/HttpClient";
import {Alert} from "../SharedComponents/Alert";
import {Alerts} from "../SharedComponents/Alerts";
import {BiHeart} from "react-icons/bi";
import {useDebounce} from "../../hooks/useDebounce";

export function Perfil({archivosSubidos, isLoading, userData, setArchivosSubidos}){
    //declarar variables
    const[misArchivos, setMisArchivos] = useState([]);
    const[filteredArchivos, setFilteredArchivos] = useState([]);
    const [showNiceAlert, setShowNiceAlert] = useState(null)
    const [showBadAlert, setShowBadAlert] = useState(null)
    const [aBorrar, setABorrar] = useState(null)
    const[likesTotales, setLikesTotales] = useState(0)
    
    // New state for filters and search
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("date"); // date, likes, title
    const [sortOrder, setSortOrder] = useState("desc"); // asc, desc
    const [selectedMateria, setSelectedMateria] = useState("all");
    const [materias, setMaterias] = useState([]);
    
    const debouncedSearchTerm = useDebounce(searchTerm, 300);
    
    document.title = "Comunidad Fiuba - Perfil";
    userData = userData?userData:{};

    useEffect(() =>{
        const archivos = []
        let misLikes = 0;
        const uniqueMaterias = new Set();
        //el slug de cada usuario es unico y seguro de compartir
        const logged = userData.slug
        //buscar archivos solo del usuario
        for( let i=0; i<archivosSubidos.length;i++){
            const user = archivosSubidos[i].username
            const likes = archivosSubidos[i].likes
            const url = archivosSubidos[i].url
            const id = archivosSubidos[i].id
            const slug = archivosSubidos[i].userslug
            const titulo = archivosSubidos[i].title
            const materia = archivosSubidos[i].materia
            const fecha = archivosSubidos[i].fecha || archivosSubidos[i].date
            if(!user.length>0){
                continue
            }
            if (slug === logged){
                archivos.push({
                    titulo:titulo, 
                    likes:likes, 
                    url:url, 
                    id:id, 
                    materia:materia,
                    fecha:fecha
                })
                misLikes += likes
                if(materia) uniqueMaterias.add(materia);
            }
        }
        setMisArchivos(archivos)
        setLikesTotales(misLikes)
        setMaterias(Array.from(uniqueMaterias).sort())
    },[isLoading, archivosSubidos])

    // Filter and sort files
    useEffect(() => {
        let filtered = [...misArchivos];
        
        // Apply search filter
        if (debouncedSearchTerm) {
            filtered = filtered.filter(archivo => 
                archivo.titulo.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
                (archivo.materia && archivo.materia.toLowerCase().includes(debouncedSearchTerm.toLowerCase()))
            );
        }
        
        // Apply materia filter
        if (selectedMateria !== "all") {
            filtered = filtered.filter(archivo => archivo.materia === selectedMateria);
        }
        
        // Apply sorting
        filtered.sort((a, b) => {
            let comparison = 0;
            
            switch (sortBy) {
                case "likes":
                    comparison = b.likes - a.likes; // Descending by default
                    break;
                case "title":
                    comparison = (a.titulo || "").localeCompare(b.titulo || ""); // Ascending by default
                    break;
                case "date":
                default:
                    // Sort by date descending by default, otherwise by ID descending
                    if (a.fecha && b.fecha) {
                        comparison = new Date(b.fecha) - new Date(a.fecha);
                    } else {
                        comparison = String(b.id || "").localeCompare(String(a.id || ""));
                    }
                    break;
            }
            return sortOrder === "asc" ? -comparison : comparison;
            
        });
        
        setFilteredArchivos(filtered);
    }, [misArchivos, debouncedSearchTerm, selectedMateria, sortBy, sortOrder]);

    const deleteFile = () =>{
        //borrar archivo
        const id = aBorrar.id, url = aBorrar.url, titulo = aBorrar.titulo
        //fetch a la api para borrar el archivo
        fetch(process.env.REACT_APP_POST_DELETE, {
            method:"POST",
            body:JSON.stringify({token:userData.token,uid:userData.uid,id:id})
        }).then(result =>{
           result.json().then(resultJson=>{
               //deberia chequear errores aca, queda para otro dia
               setArchivosSubidos(prevstate =>{
                   //quitar de la lista local el archivo recien borrado de la base de datos
                   return prevstate.filter(archivo => archivo.id !== id)
               })
           }).catch(error=>alert(error))
        }).catch(error =>alert(error))
        let originalUrl = url.replace("preview", "view?usp=drivesdk")
        const callback = (tipo) =>{
            if(tipo === "succes"){
                setShowNiceAlert(true)
            }else{
                setShowBadAlert(true)
            }
            closeBorrar()
        }
        //borrar archivo del drive
        httpPostDelete(id, originalUrl, titulo, callback)
    }

    const openBorrar = (archivo) =>{
        //abrir menu de borrar
        document.getElementById("confirmacionBox").style.display="flex"
        document.getElementById("confirmacionBackdrop").style.display="flex"
        setABorrar(archivo)
    }
    
    const closeBorrar = () =>{
        //cerrar menu de borrar
        document.getElementById("confirmacionBox").style.display="none"
        document.getElementById("confirmacionBackdrop").style.display="none"
        setABorrar(null)
    }

    const handleSortChange = (newSortBy) => {
        if (sortBy === newSortBy) {
            setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
            setSortBy(newSortBy);
            setSortOrder("desc");
        }
    };

    return(
        <div className={styles.mainDiv}>
            <Alerts>
                <Alert tipo="buena" texto="Contenido borrado correctamente." setShowAlert={setShowNiceAlert}/>
                <Alert tipo="mala" texto="Error al borrar el archivo" setShowAlert={setShowBadAlert}/>
            </Alerts>
            <Link to="/"><ion-icon name="arrow-back-outline" style={{position: "absolute", color: "white", left: "10px", top :"10px", fontSize: "2em", cursor:"pointer"}}></ion-icon></Link>
            
            {/* Backdrop overlay */}
            <div 
                id="confirmacionBackdrop" 
                className={styles.confirmacionBackdrop}
                onClick={closeBorrar}
                style={{display: "none"}}
            >
                <div id="confirmacionBox" className={styles.confirmacion}>
                <p>¿Seguro querés borrar el archivo?</p>
                <div className={styles.confirmacionButtons}>
                    <button className={styles.confirmacionButton} onClick={e => deleteFile()}>
                        Borrar
                    </button>
                    <button className={styles.cancelarButton} onClick={e => closeBorrar()}>
                        Cancelar
                    </button>
                </div>
            </div>
            </div>
            
            
            <div className={styles.pagina}>
                <div className={styles.contenedor}>
                    <BsPerson className={styles.bigIcon}/>
                    <h2 className={styles.usuarioNombre}>{userData.name}</h2>
                    <div className={styles.usuarioDato}>
                        <FcLike size={20} className={styles.heartIcon}/>
                        <span><b className={styles.likes}>{likesTotales}</b> Likes</span>
                    </div>
                    <div className={styles.usuarioDato}>
                        <span><b className={styles.likes}>{misArchivos.length}</b> Archivos</span>
                    </div>
                    <Link to="/changeUser" className={styles.linkCambiarUsername}><p>Cambiar Nombre</p></Link>
                </div>
                <div className={styles.contenedor}>
                    <h2 style={{margin: "-10px 0 10px 0"}}>Mis archivos</h2>
                    
                    {/* Search and Filter Controls */}
                    <div className={styles.filterControls}>
                        <div className={styles.searchContainer}>
                            <MdSearch size={20} style={{color: "white"}}/>
                            <input
                                type="text"
                                placeholder="Buscar archivos..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>
                        
                        <div className={styles.filterRow}>
                            <select
                                value={selectedMateria}
                                onChange={(e) => setSelectedMateria(e.target.value)}
                                className={styles.materiaSelect}
                            >
                                <option value="all">Todas las materias</option>
                                {materias.map(materia => (
                                    <option key={materia} value={materia}>{materia}</option>
                                ))}
                            </select>
                            
                            <div className={styles.sortButtonsContainer}>
                                <button
                                    onClick={() => handleSortChange("title")}
                                    className={`${styles.sortButton} ${sortBy === "title" ? styles.active : ""}`}
                                >
                                    <MdSort size={16}/>
                                    Título {sortBy === "title" && (sortOrder === "asc" ? "↑" : "↓")}
                                </button>
                                
                                <button
                                    onClick={() => handleSortChange("likes")}
                                    className={`${styles.sortButton} ${sortBy === "likes" ? styles.active : ""}`}
                                >
                                    <BiHeart size={16}/>
                                    Likes {sortBy === "likes" && (sortOrder === "asc" ? "↑" : "↓")}
                                </button>
                                
                                <button
                                    onClick={() => handleSortChange("date")}
                                    className={`${styles.sortButton} ${sortBy === "date" ? styles.active : ""}`}
                                >
                                    Fecha {sortBy === "date" && (sortOrder === "asc" ? "↑" : "↓")}
                                </button>
                            </div>
                        </div>
                    </div>
                    
                    <ul id="misArchivosLista" className={styles.listaMisArchivos}>
                        {!isLoading
                            ?filteredArchivos.map(archivo =>{
                            return (
                                <li key={archivo.id + "miArchivo"} id={archivo.id + "miArchivo"}>
                                    <div className={styles.fileInfo}>
                                        <a href={archivo.url} target="_blank" rel="noopener noreferrer">
                                            {archivo.titulo}
                                        </a>
                                        <div className={styles.fileMetadata}>
                                            <span>
                                                {archivo.materia && `${archivo.materia} • `}
                                                {archivo.likes}<BiHeart style={{transform:"translate(2px,10%)"}}/>
                                            </span>
                                        </div>
                                    </div>
                                    <button className={styles.deleteButton} onClick={() => openBorrar(archivo)}>
                                        <HiOutlineTrash style={{marginRight:"4px"}} size={18}/>
                                    </button>
                                </li>
                            )})
                            :<ImSpinner8 size={24} className={styles.spinner}/>}
                    </ul>
                </div>
            </div>
        </div>
    )
}
