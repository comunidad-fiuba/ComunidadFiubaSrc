import styles from "./Archivos.module.css";
import {useEffect, useState} from "react";
import {FaRegCommentDots} from "react-icons/fa";
import {BiHeart} from "react-icons/bi";
import {Link} from "react-router-dom";
import {FiShare2} from "react-icons/fi";
import {POSTDESTACADO} from "../Utilidad/Constantes";

export function Contenido({archivo, disabledButton, setDisabledButton, setVerComentarios, fileIndex, verComentarios,
                              loadIndex, setLoadIndex, preview, archivosRef, showAlert, postsLikes ,likesQuery}){
    const [sizeActual, setSizeActual] = useState(1.25)
    const [sizeMateria, setSizeMateria] = useState(1)
    const [sizeNombre, setSizeNombre] = useState(0.75);
    const titulo = archivo.titulo
    const url = archivo.url
    const titleUrl = "https://drive.google.com/uc?id=" + archivo.url.split("/")[5]
    const materia = archivo.materia
    const anio = archivo.year
    let likes = archivo.likes
    const postId = archivo.postId
    const usuario = archivo.usuario
    useEffect(() =>{
        if(!preview && fileIndex===loadIndex){
            setLoadIndex(fileIndex+16)
        }
    },[preview])

    useEffect(() =>{
        if(sizeActual > 0.25){
            const currentTextHeight = document.getElementById("title" + postId).scrollHeight;
            if(currentTextHeight > 31){
                setSizeActual(prevState => prevState-0.25)
            }
        }
        if(sizeMateria > 0.2){
            const materiaText = document.getElementById("materia" + postId);
            const currentTextMateriaHeight = materiaText? materiaText.scrollHeight:""
            if(currentTextMateriaHeight > 30){
                setSizeMateria(prevState => prevState-0.1)
            }
        }
        if(sizeNombre > 0.2){
            const nombreText = document.getElementById("nombre" + postId);
            const currentTextNombreHeight = nombreText? nombreText.scrollHeight:""
            if(currentTextNombreHeight > 18){
                setSizeNombre(prevState => prevState-0.1)
            }
        }

    },[loadIndex, sizeActual, sizeMateria,sizeNombre])

    if(fileIndex > loadIndex){

        return (
            <div style={{marginTop:"1rem"}}>
                <div id={"iframeBottom" + postId} className={styles.iframeBottom}>
                    <a href={url} id={"title" + postId} style={{textDecoration:"none", fontSize:sizeActual+"rem", minHeight:"30px"}} target="_blank" className={styles.displayTitle}>Cargando...</a>
                    <p style={{position:"relative", margin:"2px 0 0 0", width:"100%",textAlign:"center", color: postsLikes.indexOf(postId)>-1?"green":"red", fontSize:"0.8rem"}}>{likes}</p>
                </div>
            </div>
        )
    }
    const likePost = async() =>{
        setDisabledButton(true)
        let like;
        if(postsLikes.includes(postId)){
            const index = postsLikes.indexOf(postId);
            postsLikes.splice(index, 1);
            like = -1
        }else{
            postsLikes.push(postId)
            like = 1
        }
        try {
            await likesQuery.set({
                postsLikeados: postsLikes
            }, {merge:true})
            const algo =  await archivosRef.where("postId", "==", postId).get()
            const data = algo.docs[0].data()
            data.likes = data.likes + like
            await archivosRef.doc(algo.docs[0].id).set(data)
            archivo.likes = archivo.likes + like
            setTimeout(() => {
                setDisabledButton(false);
            }, 500);
        }catch (e) {
            console.log(e)
        }
    }

    const copyLink = () =>{
        navigator.clipboard.writeText(window.location.host + "/post/" + postId).then(a => showAlert()).catch(e => console.log(e))
    }
    return (
        <div>
            <div className={`${styles.contentWrap} ${postId===POSTDESTACADO?styles.destacado:""}`} style={{marginTop:"1rem", height:preview||verComentarios?"320px":"unset"}}>
                {preview
                    ? <embed id={titulo+"embed"} className={styles.archivo} src={url} onLoad={e => fileIndex===loadIndex?setLoadIndex(fileIndex+4):true}/>
                    : ""
                }
                <div id={"iframeBottom" + postId}  className={styles.iframeBottom}>
                    <Link to={"/post/"+postId} style={{textDecoration:"none", width:"100%", lineHeight:"31px"}}>
                        <p id={"title" + postId} rel="noreferrer" style={{fontSize:sizeActual+"rem", minHeight:"31px"}}
                           className={styles.displayTitle}>{titulo}</p>
                    </Link>

                    <div className={styles.izq}>
                        <p id={"materia" + postId} style={{fontSize:sizeMateria+"rem"}}>{materia}</p>
                        <p id={"nombre"+postId} style={{fontSize:sizeNombre+"rem"}}>por <b>{usuario}</b></p>
                        <div className={styles.anioContainer}><span>{anio}</span> {postId===POSTDESTACADO?<span className={styles.textoDestacado}>Destacado</span>:""}</div>
                    </div>
                    <div className={styles.der}>
                        <button  disabled={disabledButton} className={styles.like} onClick={e => setVerComentarios(true)}>
                            {archivo.comentarios.length>0?<FaRegCommentDots className={styles.liked} style={{color:"white"}} size={20} />:<FaRegCommentDots className={styles.toLike} style={{color:"white"}} size={20}/>}</button>
                        <button  disabled={disabledButton} className={styles.like} onClick={likePost}>
                            {postsLikes.indexOf(postId)>-1?<BiHeart className={styles.liked} style={{color:disabledButton?"rgb(100,100,220)":"rgb(255,60,60)"}} size={22}/>:<BiHeart className={styles.toLike} size={22} style={{color:disabledButton?"rgb(100,100,220)":"white"}} />}</button>
                        <button className={styles.like}><FiShare2 style={{color:"white"}} size={20} onClick={copyLink}/></button>
                        <p style={{position:"relative", margin:"2px 0 0 0", width:"100%",textAlign:"center", color: "white", fontSize:"0.8rem"}}>{archivo.comentarios.length}</p>
                        <p style={{position:"relative", margin:"2px 0 0 0", width:"100%",textAlign:"center", color: "white", fontSize:"0.8rem"}}>{likes}</p>

                    </div>
                </div>
            </div>
        </div>

    )
}