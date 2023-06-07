import styles from "./Archivos.module.css";
import {useEffect, useState} from "react";
import {BiHeart} from "react-icons/bi";
import {Link} from "react-router-dom";
import {FiShare2} from "react-icons/fi";
import {POSTDESTACADO} from "../Utilidad/Constantes";

export function Contenido({archivo, disabledButton, verComentarios,showAlert, postsLikes, likePost}){
    const [sizeActual, setSizeActual] = useState(1.25)
    const [sizeMateria, setSizeMateria] = useState(1)
    const [sizeNombre, setSizeNombre] = useState(0.75);
    const titulo = archivo.title
    const url = archivo.url
    const materia = archivo.materia
    const anio = archivo.year
    let likes = archivo.likes
    const postId = archivo.id
    const usuario = archivo.username
    const slug = archivo.slug

    useEffect(() =>{
        if(sizeActual > 0.25){
            const currentTextHeight = document.getElementById("title" + postId).scrollHeight;
            if(currentTextHeight > 31){
                setSizeActual(prevState => prevState-0.05)
            }
        }
        if(sizeMateria > 0.2){
            const materiaText = document.getElementById("materia" + postId);
            const currentTextMateriaHeight = materiaText? materiaText.scrollHeight:""
            if(currentTextMateriaHeight > 30){
                setSizeMateria(prevState => prevState-0.05)
            }
        }
        if(sizeNombre > 0.2){
            const nombreText = document.getElementById("nombre" + postId);
            const currentTextNombreHeight = nombreText? nombreText.scrollHeight:""
            if(currentTextNombreHeight > 18){
                setSizeNombre(prevState => prevState-0.05)
            }
        }

    },[sizeActual, sizeMateria,sizeNombre])

    const copyLink = () =>{
        navigator.clipboard.writeText(window.location.host + "/post/" + slug).then(a => showAlert()).catch(e => console.log(e))
    }
    return (
        <div>
            <div className={`${styles.contentWrap} ${POSTDESTACADO.includes(postId)?styles.destacado:""}`} style={{marginTop:"1rem"}}>
                <div id={"iframeBottom" + postId}  className={styles.iframeBottom}>
                    <Link to={"/post/"+slug} style={{textDecoration:"none", width:"100%", lineHeight:"31px"}}>
                        <p id={"title" + postId} rel="noreferrer" style={{fontSize:sizeActual+"rem", minHeight:"31px"}}
                           className={styles.displayTitle}>{titulo}</p>
                    </Link>

                    <div className={styles.izq}>
                        <p id={"materia" + postId} style={{fontSize:sizeMateria+"rem"}}>{materia}</p>
                        <p id={"nombre"+postId} style={{fontSize:sizeNombre+"rem"}}>por <b>{usuario}</b></p>
                        <div className={styles.anioContainer}><span>{anio}</span> {POSTDESTACADO.includes(postId)?<span className={styles.textoDestacado}>Destacado</span>:""}</div>
                    </div>
                    <div className={styles.der}>
                        {/*
                        <button  disabled={disabledButton} className={styles.like} onClick={e => setVerComentarios(true)}>
                            {archivo.comentarios.length>0?<FaRegCommentDots className={styles.liked} style={{color:"white"}} size={20} />:<FaRegCommentDots className={styles.toLike} style={{color:"white"}} size={20}/>}</button>
                        */}
                        <button  disabled={disabledButton} className={styles.like} onClick={()=>likePost(postId)}>
                            {postsLikes.indexOf(postId)>-1?<BiHeart className={styles.liked} style={{color:disabledButton?"rgb(100,100,220)":"rgb(255,60,60)"}} size={22}/>:<BiHeart className={styles.toLike} size={22} style={{color:disabledButton?"rgb(100,100,220)":"white"}} />}</button>
                        <button className={styles.like}><FiShare2 style={{color:"white"}} size={20} onClick={copyLink}/></button>
                        {/*
                        <p style={{position:"relative", margin:"2px 0 0 0", width:"100%",textAlign:"center", color: "white", fontSize:"0.8rem"}}>{archivo.comentarios.length}</p>
                        */}
                        <p style={{position:"relative", margin:"2px 0 0 0", width:"100%",textAlign:"center", color: "white", fontSize:"0.8rem"}}>{likes}</p>

                    </div>
                </div>
            </div>
        </div>

    )
}