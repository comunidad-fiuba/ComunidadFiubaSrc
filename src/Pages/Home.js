import styles from "./HomeAlen.module.css"
import {useEffect, useState} from "react";
import {Archivos} from "../Components/Archivos";
import {ImSpinner8} from "react-icons/im";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {STORAGE} from "../Utilidad/Storage";
import {MATERIAS, MATERIASREMPLAZABLES, MATERIASREMPLAZO} from "../Utilidad/Constantes";
import {MdDateRange, MdFilterAlt} from "react-icons/md";
import {Top} from "./Top";
import {useDebounce} from "../hooks/useDebounce";
import {FcLike} from "react-icons/fc";
import {AiFillEye, AiFillEyeInvisible} from "react-icons/ai";
import {Alert} from "../Components/Alert";
import {Alerts} from "../Components/Alerts";
import {CargandoArchivos} from "../Components/CargandoArchivos";
import {ArchivosPorMateria} from "../Components/ArchivosPorMateria";
import {IoIosClose} from "react-icons/io";


export function Home({archivosSubidos, postsLikes,
                         isLoading, auth, userData, setPostsLikes}){
    //obtener la query desde el link
    const query = new URLSearchParams(useLocation().search);
    //declarar variables
    const navigate = useNavigate()
    const [showAlert, setShowAlert] = useState(null)
    const [archivosFiltered, setArchivosFiltered] = useState([])
    const [tipoElegido, setTipoElegido] = useState(query.get("tipo"))
    const [materiaElegida, setMateriaElegida] = useState("")
    const [anioElegido, setAnioElegido] = useState("")
    const [tituloElegido, setTituloElegido] = useState("")
    const [reset, setReset] = useState(false)
    const [archivosOrdenados, setArchivosOrdenados] = useState(archivosSubidos)
    //los debounce hacen que al escribir una busqueda, se espere a que el usuario haya dejado de escribir para buscar
    const debounceMateriaElegida = useDebounce(materiaElegida,400)
    const debounceTituloElegido = useDebounce(tituloElegido,400)

    document.title = "Comunidad Fiuba";
    //obtener datos de la query
    if(query.get("materia") && materiaElegida !== query.get("materia")){
        setMateriaElegida(query.get("materia"))
    }
    if(query.get("titulo") && tituloElegido !== query.get("titulo")){
        setTituloElegido(query.get("titulo"))
    }
    useEffect(() =>{
        //cuando pas algo en los archivos subidos se ordenan por likes
        setArchivosOrdenados(archivosSubidos.sort((a, b) => b.likes - a.likes))
    },[archivosSubidos])

    useEffect(() =>{
        //permite recargar el componente cuando se cambia el valor de un debounce
        setReset(true)
    },[debounceMateriaElegida, archivosSubidos, debounceTituloElegido])

    useEffect(() =>{
        //si hay query poner esos valores en los filtros
        document.getElementById("tipo").value = tipoElegido?tipoElegido.charAt(0).toUpperCase() + tipoElegido.slice(1):""
        document.getElementById("materia").value = materiaElegida?materiaElegida.charAt(0).toUpperCase() + materiaElegida.slice(1):""
        document.getElementById("anio").value = anioElegido?anioElegido:""
        document.getElementById("search").value = tituloElegido?tituloElegido:""
    },[])

    const changeTipo = (e) =>{
        //cambiar el tipo de post buscado
        if(e.target.value){
            //poner el valor en la query
            query.set("tipo",e.target.value)
        }else{
            query.delete("tipo")
        }
        setTipoElegido(e.target.value)
        setReset(true)
        //ir a la pagina con la query
        navigate("/?" + query)

    }
    const closeMateriaOnClick = (e) =>{
        const materiaInput = document.getElementById("materia");
        materiaInput.value = ""
        query.delete("materia")
        setMateriaElegida(materiaInput.value)
        navigate("/?" + query)
    }

    const changeMateria = (e) =>{
        //cambiar el tipo de materia buscada
        let materia = e.target.value

        const indexReemplazo = MATERIASREMPLAZABLES.indexOf(materia)
        if(indexReemplazo !== -1){
            materia = MATERIASREMPLAZO[indexReemplazo]
        }

        if(materia){
            query.set("materia",materia)
        }else{
            query.delete("materia")
        }
        setMateriaElegida(materia)
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
        //funcion filtro, devuelve true si el elemento cumple con los filtros activos
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
        //aplica los filtros activados
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
            //si hay algun cambio aplicar los filtros
            changed()
            setReset(false)
        }
    },[reset])

    const logOut = () =>{
        auth.signOut().then(res =>navigate("/login"))

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
                    <a href="#recomendados">Clases</a>
                </div>
                <div className={styles.der}>
                    <Link to="/perfil" className={styles.linkContainer}>
                        <ion-icon name="person-outline"></ion-icon>
                        <p>Perfil</p>
                    </Link>
                    {auth.currentUser?<Link to="/login" className={styles.linkContainer} onClick={logOut}>
                        <ion-icon name="log-out-outline" ></ion-icon>
                        <p>Salir</p>
                    </Link>:
                    <Link to="/" className={styles.linkContainer} onClick={logOut}>
                        <ion-icon name="log-in-outline"></ion-icon>
                        <p>Entrar</p>
                    </Link>}
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
                <Link to="/subir" className={styles.subir}>
                    <ion-icon name="cloud-upload-outline"></ion-icon>
                    <p>Subir</p>
                </Link>
            </div>
            <div className={styles.filterWrapper} id="contenido">
                <div className={styles.selectContainer}>
                    {materiaElegida?
                        <div className={styles.closeMateria} onClick={closeMateriaOnClick}>
                            <ion-icon name="close-outline" ></ion-icon>
                        </div>
                        : <ion-icon name="chevron-down-outline"></ion-icon>}

                    <input id="materia" type="text" list="materias" placeholder="Materia" onChange={changeMateria}  className={styles.filterInput} style={materiaElegida? {background:"rgb(0,139,130)"} : {}}/>
                        <datalist id="materias">
                            {MATERIAS.map(materia =>(<option key={materia + "filter"} value ={materia}/>))}
                        </datalist>
                </div>
                <div className={styles.selectContainer}>
                    <ion-icon name="chevron-down-outline"></ion-icon>
                    <select id="tipo" name="tipo" title="tipo" form="formArchivo" onChange={changeTipo} className={styles.filterInput} style={tipoElegido? {background:"rgb(0,139,130)"} : {}}>
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
                    <select id="anio" onChange={changeAnio} className={styles.filterInput} style={anioElegido? {background:"rgb(0,139,130)"} : {}}>
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
             <div>
                {!isLoading
                    ? archivosFiltered.length>0
                        ? <Archivos archivosSubidos={archivosFiltered} setPostsLikes={setPostsLikes} userData={userData}
                                    showAlert={showAlert} auth={auth} postsLikes={postsLikes}
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
                <p style={{display:"inline"}}>Clases con:</p>
                <a href={"https://linktr.ee/lapizarraonline"} target="_blank" className={styles.pizarraLogo}></a>
            </div>
        </div>
    )
}