import styles from "./PerfilAlen.module.css"
import {Link} from "react-router-dom";
import {FcLike} from "react-icons/fc";
import {BsPerson} from "react-icons/bs";
import {useEffect, useState} from "react";
import {ImSpinner8} from "react-icons/im";
import {HiOutlineTrash} from "react-icons/hi";
import {MdKeyboardArrowDown, MdKeyboardArrowUp} from "react-icons/md";
import {httpPostDelete} from "../Utilidad/HttpClient";
import {Alert} from "../Components/Alert";
import {Alerts} from "../Components/Alerts";
import {FaRegCommentDots} from "react-icons/fa";
import {BiHeart} from "react-icons/bi";

export function Perfil({archivosSubidos, isLoading, userData, setArchivosSubidos}){
    const[misArchivos, setMisArchivos] = useState([]);
    const [showNiceAlert, setShowNiceAlert] = useState(null)
    const [showBadAlert, setShowBadAlert] = useState(null)
    const [aBorrar, setABorrar] = useState(null)
    const[actual, setActual] = useState(0)
    const[likesTotales, setLikesTotales] = useState(0)

    useEffect(() =>{
        const archivos = []
        let misLikes = 0;
        const logged = userData.slug
        for( let i=0; i<archivosSubidos.length;i++){
            const user = archivosSubidos[i].username
            const likes = archivosSubidos[i].likes
            const url = archivosSubidos[i].url
            const id = archivosSubidos[i].id
            const slug = archivosSubidos[i].userslug
            const titulo = archivosSubidos[i].title
            const comments = archivosSubidos[i].comentarios?archivosSubidos[i].comentarios.length:0
            if(!user.length>0){
                continue
            }
            if (slug === logged){
                archivos.push({titulo:titulo, likes:likes, url:url, id:id, comments:comments})
                misLikes += likes
            }
        }
        setMisArchivos(archivos)
        setLikesTotales(misLikes)
    },[isLoading, archivosSubidos])


    const scrollListDown =() => {
        setActual(prevState => {
            if(prevState < misArchivos.length-1){
                const inicial = document.getElementById("misArchivosLista").scrollTop
                document.getElementsByTagName("li")[prevState+1].scrollIntoView()
                const final = document.getElementById("misArchivosLista").scrollTop
                if(inicial === final){
                    return prevState
                }
                return prevState+1
            }
            return prevState
        })
    }
    const scrollListUp =() => {
        setActual(prevState => {
            if(prevState > 0){
                const inicial = document.getElementById("misArchivosLista").scrollTop
                document.getElementById(misArchivos[prevState-1].id + "miArchivo").scrollIntoView();
                const final = document.getElementById("misArchivosLista").scrollTop
                if(inicial === final){
                    return prevState
                }
                return prevState-1
            }
            return prevState
        })
    }

    const deleteFile = () =>{
        const id = aBorrar.id, url = aBorrar.url, titulo = aBorrar.titulo
        fetch(process.env.REACT_APP_POST_DELETE, {
            method:"POST",
            body:JSON.stringify({token:userData.token,uid:userData.uid,id:id})
        }).then(result =>{
           result.json().then(resultJson=>{
               setArchivosSubidos(prevstate =>{
                   return prevstate.filter(archivo => archivo.id !== id)
               })
           }).catch(error=>alert(error))
        }).catch(error =>alert(error))
        let originalUrl = url.replace("preview", "view?usp=drivesdk")
        const callback = (tipo) =>{
            if(tipo === "succes"){
                showNiceAlert()
            }else{
                showBadAlert()
            }
            closeBorrar()
        }
        httpPostDelete(id, originalUrl, titulo, callback)
    }

    const openBorrar = (archivo) =>{
        document.getElementById("confirmacionBox").style.display="flex"
        setABorrar(archivo)
    }
    const closeBorrar = () =>{
        document.getElementById("confirmacionBox").style.display="none"
        setABorrar(null)
    }


    return(
        <div className={styles.mainDiv}>
            <Alerts>
                <Alert tipo="buena" texto="Contenido borrado correctamente." setShowAlert={setShowNiceAlert}/>
                <Alert tipo="mala" texto="Error al borrar el archivo" setShowAlert={setShowBadAlert}/>
            </Alerts>
            <Link to="/"><ion-icon name="arrow-back-outline" style={{position: "absolute", color: "white", left: "10px", top :"10px", fontSize: "2em", cursor:"pointer"}}></ion-icon></Link>
            <div id="confirmacionBox" className={styles.confirmacion}>
                <p>Seguro querés borrar el archivo?</p>
                <button className={styles.confirmacionButton} onClick={e => deleteFile()}>Borrar</button>
                <button className={styles.cancelarButton} onClick={e => closeBorrar()}>Cancelar</button>
            </div>
            <div className={styles.pagina}>
                <div className={styles.contenedor}>
                    <BsPerson className={styles.bigIcon}/>
                    <h2 className={styles.usuarioNombre}>{userData.name}</h2>
                    <div className={styles.usuarioDato}>
                        <FcLike size={20} className={styles.heartIcon}/>
                        <span><b className={styles.likes}>{likesTotales}</b> Likes</span>
                    </div>
                    <Link to="/changeUser" className={styles.linkCambiarContrasenia}><p>Cambiar Nombre</p></Link>
                </div>
                <div className={styles.contenedor}>
                    <h2 style={{margin: "0"}}>Mis archivos</h2>
                    <button className={styles.arrowButton} onClick={scrollListUp}><MdKeyboardArrowUp size={20}/></button>
                    <ul id="misArchivosLista" className={styles.listaMisArchivos}>
                        {!isLoading
                            ?misArchivos.map(archivo =>{
                            return (
                                <li key={archivo.id + "miArchivo"} id={archivo.id + "miArchivo"}><a href={archivo.url} target="_blank">{archivo.titulo}<br/><span style={{color:"white"}}>{archivo.comments}<FaRegCommentDots style={{transform:"translate(2px,10%)"}}/> / {archivo.likes}<BiHeart style={{transform:"translate(2px,10%)"}}/></span></a>
                                    <button className={styles.deleteButton} onClick={() => openBorrar(archivo)}><HiOutlineTrash style={{marginRight:"4px"}} size={18}/></button></li>
                            )})
                            :<ImSpinner8 size={24} className={styles.spinner}/>}
                    </ul>
                    <button className={styles.arrowButton} onClick={scrollListDown}><MdKeyboardArrowDown size={20}/></button>
                </div>
            </div>
        </div>
    )
}