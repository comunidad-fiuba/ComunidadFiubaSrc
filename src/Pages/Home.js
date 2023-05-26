import styles from "./HomeAlen.module.css"
import {useEffect, useState} from "react";
import {Archivos} from "../Components/Archivos";
import {ImSpinner8} from "react-icons/im";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {STORAGE} from "../Utilidad/Storage";
import {MATERIAS} from "../Utilidad/Constantes";
import {MdDateRange, MdFilterAlt} from "react-icons/md";
import {Top} from "./Top";
import {useDebounce} from "../hooks/useDebounce";
import {FcLike} from "react-icons/fc";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import {Alert} from "../Components/Alert";
import {Alerts} from "../Components/Alerts";
import {CargandoArchivos} from "../Components/CargandoArchivos";


export function Home({archivosSubidos, postsLikes,
                         isLoading, auth, userData, setPostsLikes}){
    const query = new URLSearchParams(useLocation().search);
    const navigate = useNavigate()
    const [showAlert, setShowAlert] = useState(null)
    const [archivosFiltered, setArchivosFiltered] = useState([])
    const [tipoElegido, setTipoElegido] = useState(query.get("tipo"))
    const [materiaElegida, setMateriaElegida] = useState("")
    const [anioElegido, setAnioElegido] = useState("")
    const [tituloElegido, setTituloElegido] = useState("")
    const [preview, setPreview] = useState(STORAGE.get("preview") !== "false")
    const [reset, setReset] = useState(false)
    const debounceMateriaElegida = useDebounce(materiaElegida,400)
    const debounceTituloElegido = useDebounce(tituloElegido,400)
    const [archivosOrdenados, setArchivosOrdenados] = useState(archivosSubidos)

    if(query.get("materia") && materiaElegida !== query.get("materia")){
        setMateriaElegida(query.get("materia"))
    }
    if(query.get("titulo") && tituloElegido !== query.get("titulo")){
        setTituloElegido(query.get("titulo"))
    }
    useEffect(() =>{
        setArchivosOrdenados(archivosSubidos.sort((a, b) => b.likes - a.likes))
    },[archivosSubidos])

    useEffect(() =>{
        setReset(true)
    },[debounceMateriaElegida, archivosSubidos, debounceTituloElegido])

    useEffect(() =>{
        document.getElementById("tipo").value = tipoElegido?tipoElegido.charAt(0).toUpperCase() + tipoElegido.slice(1):""
        document.getElementById("materia").value = materiaElegida?materiaElegida.charAt(0).toUpperCase() + materiaElegida.slice(1):""
        document.getElementById("anio").value = anioElegido?anioElegido:""
        document.getElementById("search").value = tituloElegido?tituloElegido:""
    },[])
    const changeTipo = (e) =>{
        if(e.target.value){
            query.set("tipo",e.target.value)
        }else{
            query.delete("tipo")
        }
        setTipoElegido(e.target.value)
        setReset(true)
        navigate("/?" + query)

    }
    const changeMateria = (e) =>{
        if(e.target.value){
            query.set("materia",e.target.value)
        }else{
            query.delete("materia")
        }
        setMateriaElegida(e.target.value)
        navigate("/?" + query)
    }
    const changeAnio = (e) =>{
        if(e.target.value){
            query.set("año",e.target.value)
        }else{
            query.delete("año")
        }
        setAnioElegido(e.target.value)
        setReset(true)
        navigate("/?" + query)

    }

    const ordenarLikes = (e) =>{
        setArchivosOrdenados(prevState => prevState.sort((a, b) => b.likes - a.likes))
        setReset(true)

    }
    const ordenarFecha = (e) =>{
        setArchivosOrdenados(prevState => prevState.sort((a, b) => b.id - a.id))
        setReset(true)
    }

    const changeTitulo = (e) =>{
        if(e.target.value){
            query.set("titulo",e.target.value)
        }else{
            query.delete("titulo")
        }
        setTituloElegido(e.target.value)
        navigate("/?" + query)
    }

    const filterFunc = (archivo) =>{
        if(tipoElegido && archivo.tipo.toLowerCase() !== tipoElegido.toLowerCase()){
            return false;
        }
        if(debounceMateriaElegida && archivo.materia.toLowerCase() !== debounceMateriaElegida.toLowerCase()){
            return false;
        }
        if(anioElegido && archivo.year !== anioElegido){
            return false;
        }

        if(debounceTituloElegido && !archivo.title.toLowerCase().includes(debounceTituloElegido.toLowerCase())){
            return false;
        }

        return true;
    }

    const changed = () =>{
        setArchivosFiltered(prevstate => {
            prevstate = []
            for(let i =0; i<archivosOrdenados.length;i++){
                if(filterFunc(archivosOrdenados[i])){
                    prevstate.push(archivosOrdenados[i])
                }
            }
            return prevstate
        })
    }

    useEffect(() =>{
        if(reset){
            changed()
            setReset(false)
        }
    },[reset])

    const logOut = () =>{
        auth.signOut()
    }

    const setPreviewAndSave = (value) =>{
        setPreview(value)
        STORAGE.set("preview", value?"true":"false")
    }
    return(
        <div className={styles.container}>
            <Alerts>
                <Alert tipo="neutral" texto="Link del post copiado" setShowAlert={setShowAlert}/>
            </Alerts>
            <nav>
                <div className={styles.izq}>
                    <a href="#inicio">Inicio</a>
                    <a href="#contenido">Explorar</a>
                    <a href="#top">Top</a>
                    <a href="#recomendados">Más</a>
                </div>
                <div className={styles.der}>
                    <Link to="/subir" className={styles.linkContainer}>
                        <p>Subir</p>
                        <ion-icon name="cloud-upload-outline"></ion-icon>
                    </Link>
                    <Link to="/perfil" className={styles.linkContainer}>
                        <p>Perfil</p>
                        <ion-icon name="person-outline"></ion-icon>
                    </Link>
                    <Link to="/" className={styles.linkContainer} onClick={logOut}>
                        <p>Salir</p>
                        <ion-icon name="log-out-outline"></ion-icon>
                    </Link>
                </div>
            </nav>
            <a href="#inicio" className={styles.arriba}>
                <ion-icon name="chevron-up-outline"></ion-icon>
            </a>
            <div className={styles.fiubaImagen}  id="inicio">
                <h1 className={styles.mainTitulo}
                    onClick={e =>{ navigate("/")
                    window.location.reload()}}>Comunidad Fiuba</h1>
                <h3 style={{position:"relative",fontWeight:"lighter", margin:"0px", textAlign:"center"}}>Esta página <b>no</b> es oficial, su contenido es manejado por alumnos de la FIUBA, <b>valoralo</b> y sumate a compartir</h3>
                <div className={styles.subrrayado}></div>
            </div>
            <div className={styles.filterWrapper} id="contenido">
                <div className={styles.selectContainer}>
                    <ion-icon name="chevron-down-outline"></ion-icon>
                    <select id="tipo" name="tipo" title="tipo" form="formArchivo" onChange={changeTipo} className={styles.filterInput}>
                        <option value="">Tipo</option>
                        <option value="Resumen">Resumen</option>
                        <option value="Final">Final</option>
                        <option value="Final Resuelto">Final Resuelto</option>
                        <option value="Parcial">Parcial</option>
                        <option value="Parcial Resuelto">Parcial Resuelto</option>
                        <option value="Ejercicios">Ejercicios</option>
                    </select>
                </div>
                <div className={styles.selectContainer}>
                    <ion-icon name="chevron-down-outline"></ion-icon>
                    <input id="materia" type="text" list="materias" placeholder="Materia" onChange={changeMateria} className={styles.filterInput}/>
                        <datalist id="materias">
                            {MATERIAS.map(materia =>(<option key={materia + "filter"} value ={materia}/>))}
                        </datalist>
                </div>
                <div className={styles.selectContainer}>
                    <ion-icon name="chevron-down-outline"></ion-icon>
                    <select id="anio" onChange={changeAnio} className={styles.filterInput}>
                        <option value="">Año</option>
                        <option value="2023">2023</option>
                        <option value="2022">2022</option>
                        <option value="2021">2021</option>
                        <option value="2020">2020</option>
                        <option value="2019">2019</option>
                        <option value="2018">2018</option>
                    </select>
                </div>
                <div className={styles.selectContainer + " " + styles.c1C2}>
                    <button onClick={ordenarLikes}><FcLike size={16}/></button>
                    <button onClick={ordenarFecha}><MdDateRange size={16}/></button>
                </div>
                <div className={styles.buscador}>
                    <ion-icon name="search-outline"></ion-icon>
                    <input type="text" id="search" onChange={changeTitulo} placeholder="Buscar por titulo..."/>
                </div>
            </div>
            <div style={{display:"flex",justifyContent:"center", gap:"10px"}}>
                { preview?<button className={styles.previewButton} onClick={() => setPreviewAndSave(false)}><AiFillEye size={22}/></button>
                    :<button className={styles.previewButton} onClick={() => setPreviewAndSave(true)}><AiFillEyeInvisible size={22}/></button>}
            </div>
             <div>
                {!isLoading
                    ? archivosFiltered.length>0
                        ? <Archivos archivosSubidos={archivosFiltered} setPostsLikes={setPostsLikes} userData={userData}
                                    showAlert={showAlert} preview={preview} auth={auth} postsLikes={postsLikes}
                                    />
                        : <div><MdFilterAlt className={styles.filtroVacio} size={35}/><p style={{textAlign:"center"}}>{"No hay resultados!, intentá reajustar los filtros"}</p></div>
                    :<CargandoArchivos size={60} />}
            </div>
            <Top archivos={archivosSubidos}/>
            <footer id="top" className={styles.footer}>
                <p style={{width:"50%", textAlign:"center"}}>&copy; 2023. Todos los derechos reservados.</p>
                <p style={{width:"50%", textAlign:"center"}}>Creado por Andres Melnik y Alen Monti <i
                    className="fas fa-laptop-code"></i></p>
                <p style={{width:"50%", textAlign:"center", userSelect:"all", overflow:"hidden"}}>andres.d.melnik@gmail.com</p>
                <p style={{width:"50%", textAlign:"center", userSelect:"all"}}>montialen@gmail.com</p>
            </footer>
            <div id="recomendados" style={{width:"95%", display:"flex",marginLeft:"5%",  gap:"10px"}}>
                <p style={{display:"inline"}}>Recomendamos:</p>
                <a href={"https://linktr.ee/lapizarraonline"} target="_blank" className={styles.pizarraLogo}></a>
            </div>
        </div>
    )
}