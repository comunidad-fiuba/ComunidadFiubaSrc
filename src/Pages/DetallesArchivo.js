import {Link, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import styles from "./DetallesArchivo.module.css";
import {BiHeart} from "react-icons/bi";
import {FaRegCommentDots} from "react-icons/fa";
import {DetallesComentarios} from "./DetallesComentarios";
import {ImSpinner8} from "react-icons/im";

export function DetallesArchivo({archivosSubidos,isLoading, postsLikes, userData, setPostsLikes}){
    const {postSlug} = useParams();
    const postId = archivosSubidos.find(post => post.slug===postSlug)?.id
    const [archivo, setArchivo] = useState(null)
    const [disabledButton, setDisabledButton] = useState(false)
    const [verComentarios, setVerComentarios] = useState(false)
    const likePost = (postId) =>{
        setDisabledButton(true)
        fetch(process.env.REACT_APP_LIKE,{
            method:"POST",
            body: JSON.stringify({token:userData.token,uid:userData.uid,postId:postId})
        }).then(result =>
            result.json()
                .then(resultJson=>{
                    if(resultJson.error === 'Usuario invalido'){
                        alert("Error Usuario invalido,Intenta reiniciar la pagina o contactar a un administrador")
                    }else{
                        if(resultJson.action==='dislike'){
                            setPostsLikes(prevState=>{
                                const index = prevState.indexOf(postId);
                                prevState.splice(index, 1);
                                return prevState
                            })
                            archivo.likes = resultJson.likes
                        }else if(resultJson.action==='like'){
                            setPostsLikes(prevState=>{
                                prevState.push(postId)
                                return prevState
                            })
                            archivo.likes = resultJson.likes
                        }else{
                            alert("Error desconocido,Intenta reiniciar la pagina o contactar a un administrador")
                        }
                    }

                    setTimeout(() => {
                        setDisabledButton(false);
                    }, 500);
                }).catch(e=>alert(e))
        ).catch(e =>alert(e))
    }
    useEffect(() =>{
        if(isLoading){
            return
        }
        for(let i =0; i<archivosSubidos.length;i++){
            if(archivosSubidos[i].id ===postId){
                setArchivo(archivosSubidos[i])
                return
            }
        }
    },[isLoading])
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
    const titulo = archivo.title
    const url = archivo.url
    const likes = archivo.likes
    const comentarios = archivo.comentarios?.length
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
                    <button className={styles.boton} disabled={disabledButton} onClick={() =>likePost(postId)}><BiHeart className={styles.botonIcon} style={{color:disabledButton?"lightblue":"rgb(255,60,60)",transform:"translate(0,10%)", opacity:postsLikes.indexOf(postId)>-1?1:0.5}}/></button>
                    {/*<span style={{height:"45px", display:"flex", alignItems:"center"}}>{comentarios}</span>
                    <button className={styles.boton} onClick={() =>setVerComentarios(true)}><FaRegCommentDots className={styles.botonIcon} style={{color:"white", fontSize:"0.9em",transform:"translate(0,10%)"}}/></button>
                    */}
                </div>
            </div>
            {/*<DetallesComentarios verComentarios={verComentarios} setVerComentarios={setVerComentarios} comentarios={archivo.comentarios} comentariosRef={archivo.comentariosRef} userName={userName} uid={uid} fileIndex={postId} />*/}

            <embed id={titulo+"embed"} className={styles.archivo} src={url}/>
        </div>
    )
}