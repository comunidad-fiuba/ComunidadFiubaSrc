import styles from "./Archivos.module.css";
import {Comentario} from "./Comentario";
import {Timestamp} from 'firebase/firestore'
import 'firebase/compat/firestore';
import {useEffect, useState} from "react";

export function Comentarios({verComentarios, setVerComentarios, comentarios, comentariosRef, userName, uid, fileIndex}){
    const[reset, setReset] = useState(false)
    const[confirmando, setConfirmando] = useState(null)

    useEffect(() =>{
        const commentsBox = document.getElementById("comentarios" + fileIndex)
        commentsBox.scrollTo(0, commentsBox.scrollHeight)
    },[reset])
    const addComment = (e) =>{
        e.preventDefault()
        const newComment = {
            fecha: Timestamp.now(),
            texto:e.target.commentText.value,
            usuario:userName,
            uid:uid
        }
        comentariosRef.add(
            newComment
        )
        comentarios.push(newComment)
        setReset(prevState => !prevState)
        e.target.commentText.value = ""
    }

    const borrarComentario = (docId, comentario) =>{
        comentariosRef.doc(docId).delete()
        comentarios.splice(comentarios.indexOf(comentario),1)
        setReset(prevState => !prevState)
        setConfirmando(null)
    }

    if(comentarios.length === 0){
        return(
            <div className={styles.contentWrap} hidden={!verComentarios} style={{marginTop:"1rem", position:"absolute", zIndex:"10", height:"320px"}}>
                <div id={"comentarios" + fileIndex} className={styles.comentarios}>
                    <p style={{textAlign:"center", color:"gray", marginTop:"10px"}}>Sin Comentarios</p>
                </div>
                <form autoComplete="off" className={styles.comentar} action="" onSubmit={addComment} style={{width:"100%", margin:"0"}}>
                    <input  name="commentText" type="text" className={styles.inputComentario} placeholder="Deja un comentario..."/>
                    <button type="submit"><i className="fa-solid fa-paper-plane fa-bounce"></i></button>
                </form>
                <div className={styles.cerrarComentarios} onClick={()=>setVerComentarios(false)}><i className="fa-regular fa-circle-xmark"></i></div>
            </div>
        )
    }
    return(
        <div className={styles.contentWrap} hidden={!verComentarios} style={{marginTop:"1rem", position:"absolute", zIndex:"10", height:"320px"}}>
            <div className={styles.confirmationBox} style={{display:confirmando?"flex":"none"}}>
                <p style={{width:"100%", fontSize:"18px"}}>¿Seguro?</p>
                <button className={styles.confirmationButton} onClick={confirmando}>Si</button>
                <button className={styles.cancelButton} onClick={() => setConfirmando(null)}>No</button>
            </div>
            <div id={"comentarios" + fileIndex} className={styles.comentarios}>
                {comentarios.map(comentario => <Comentario comentario={comentario} setConfirmando={setConfirmando} miUid={uid} borrarComentario={borrarComentario}/>)}
            </div>
            <form autoComplete="off" className={styles.comentar} action="" onSubmit={addComment} style={{width:"100%", margin:"0"}}>
                <input  name="commentText" type="text" className={styles.inputComentario} placeholder="Deja un comentario..."/>
                <button type="submit"><i className="fa-solid fa-paper-plane fa-bounce"></i></button>
            </form>
            <div className={styles.cerrarComentarios} onClick={()=>setVerComentarios(false)}><i className="fa-regular fa-circle-xmark"></i></div>
        </div>
    )
}