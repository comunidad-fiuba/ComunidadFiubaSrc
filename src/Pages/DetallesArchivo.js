import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import styles from "./DetallesArchivo.module.css";
import {BiHeart} from "react-icons/bi";
import {FaRegCommentDots} from "react-icons/fa";
import {DetallesComentarios} from "./DetallesComentarios";
import {ImSpinner8} from "react-icons/im";

export function DetallesArchivo({archivosSubidos, postsLikes, likesQuery, archivosRef, userName, uid}){
    const {postIdParam} = useParams();
    const postId = Number(postIdParam)
    const [archivo, setArchivo] = useState(null)
    const [disabledButton, setDisabledButton] = useState(false)
    const [verComentarios, setVerComentarios] = useState(false)
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
    useEffect(() =>{
        for(let i =0; i<archivosSubidos.length;i++){
            if(archivosSubidos[i].postId ===postId){
                setArchivo(archivosSubidos[i])
                return
            }
        }
    },[archivosSubidos])
    if(archivosSubidos.length === 0){
        return(
            <div>
                <ImSpinner8 size={60} className={styles.spinner}/>
            </div>
        )
    }
    if(!archivo){
        return(
            <div>
            No existe el archivo
            </div>
        )
    }
    const titulo = archivo.titulo
    const url = archivo.url
    const likes = archivo.likes
    const comentarios = archivo.comentarios.length
    console.log(postsLikes)
    return(
        <div className={styles.mainDiv}>
            <div className={styles.navBar}>
                <div style={{width:"25%", display:"flex", justifyContent:"center"}}>
                    <Link to="/" style={{textDecoration:"none",overflow:"hidden"}}>
                        <p style={{color: "white",margin:"0", cursor:"pointer", fontSize:"1.25em",
                            left:"0px", width:"fit-content"}}>Comunidad Fiuba</p>
                    </Link>
                </div>
                <span style={{overflow:"hidden", width:"50%"}}>{titulo}</span>
                <div style={{color: "white", width:"25%",overflow:"hidden", display:"flex"}}>
                    <span style={{height:"45px", display:"flex", alignItems:"center"}}>{likes}</span>
                    <button className={styles.boton} disabled={disabledButton} onClick={likePost}><BiHeart className={styles.botonIcon} style={{color:disabledButton?"lightblue":"rgb(255,60,60)",transform:"translate(0,10%)", opacity:postsLikes.indexOf(postId)>-1?1:0.5}}/></button>
                    <span style={{height:"45px", display:"flex", alignItems:"center"}}>{comentarios}</span>
                    <button className={styles.boton} onClick={() =>setVerComentarios(true)}><FaRegCommentDots className={styles.botonIcon} style={{color:"white", fontSize:"0.9em",transform:"translate(0,10%)"}}/></button>
                </div>
            </div>
            <DetallesComentarios verComentarios={verComentarios} setVerComentarios={setVerComentarios} comentarios={archivo.comentarios} comentariosRef={archivo.comentariosRef} userName={userName} uid={uid} fileIndex={postId} />

            <embed id={titulo+"embed"} className={styles.archivo} src={url}/>
        </div>
    )
}