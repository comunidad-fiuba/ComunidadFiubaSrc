import {Link, useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import styles from "./DetallesArchivo.module.css";
import {BiHeart} from "react-icons/bi";
import {ImSpinner8} from "react-icons/im";

export function DetallesArchivo({archivosSubidos,isLoading, postsLikes, userData, setPostsLikes, caughtError}){
    //obtener el slug del archivo pasado por el link
    const {postSlug} = useParams();
    const navigate = useNavigate();
    
    //obtener el id usando el slug
    const postId = archivosSubidos.find(post => post.slug===postSlug)?.id
    //declarar variables
    const [archivo, setArchivo] = useState(null)
    const [disabledButton, setDisabledButton] = useState(false)
    const [verComentarios, setVerComentarios] = useState(false)
    const titulo = archivo?.title
    const url = archivo?.url
    const likes = archivo?.likes
    const comentarios = archivo?.comentarios?.length
    if(postId==12){
        console.log("12")
    }
    document.title = `${(postSlug.charAt(0).toUpperCase() + postSlug.slice(1)).replace(/-/g, " ")} - Comunidad Fiuba`;
    const likePost = (postId) =>{
        if(!userData){
            navigate("/login")
            return
        }
        //likear post
        setDisabledButton(true)
        //fetch a la api de likear
        fetch(process.env.REACT_APP_LIKE,{
            method:"POST",
            body: JSON.stringify({token:userData.token,uid:userData.uid,postId:postId})
        }).then(result =>
            result.json()
                .then(resultJson=>{
                    if(resultJson.error === 'Usuario invalido'){
                        //probablemente alguien intentando dar like desde otra cuenta
                        alert("Error Usuario invalido,Intenta reiniciar la pagina o contactar a un administrador")
                    }else{
                        if(resultJson.action==='dislike'){
                            //el server marcó la accion como un dislike
                            setPostsLikes(prevState=>{
                                //guardar el like localmente
                                const index = prevState.indexOf(postId);
                                prevState.splice(index, 1);
                                return prevState
                            })
                            //cambiar los likes del archivo localmente
                            archivo.likes = resultJson.likes
                        }else if(resultJson.action==='like'){
                            //el server marcó la accion como un likes
                            setPostsLikes(prevState=>{
                                //guardar el like localmente
                                prevState.push(postId)
                                return prevState
                            })
                            //cambiar los likes del archivo localmente
                            archivo.likes = resultJson.likes
                        }else{
                            alert("Error desconocido,Intenta reiniciar la pagina o contactar a un administrador")
                        }
                    }

                    setTimeout(() => {
                        setDisabledButton(false);
                    }, 300);
                }).catch(e=>alert("Error desconocido,Intenta reiniciar la pagina o contactar a un administrador"))
        ).catch(e =>alert("Error desconocido,Intenta reiniciar la pagina o contactar a un administrador"))
    }
    useEffect(() =>{
        if(isLoading){
            return
        }
        //buscar el archivo por el id, podria hacerse sin el for
        for(let i =0; i<archivosSubidos.length;i++){
            if(archivosSubidos[i].id ===postId){
                setArchivo(archivosSubidos[i])
                return
            }
        }
    },[isLoading])
    //no cargaron los archivos
    if(archivosSubidos.length === 0){
        //NOTA cambiar el spinner por algo mejor
        if(caughtError){
            return (<div>
                ERROR INESPERADO, REINICIAR LA PAGINA
            </div>)
        }else{
            return(
                <div>
                    <ImSpinner8 size={60} className={styles.spinner}/>
                </div>
            )
        }
        
    }
    if(!archivo){
        return(
            <div>
            No existe el archivo
            </div>
        )
    }
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
                    <span style={{display:"flex", alignItems:"center"}}>{likes}</span>
                    <button className={styles.boton} disabled={disabledButton} onClick={() =>likePost(postId)}><BiHeart className={styles.botonIcon} style={{color:disabledButton?"lightblue":"rgb(255,60,60)",transform:"translate(0,10%)", opacity:postsLikes.indexOf(postId)>-1?1:0.5}}/></button>
                </div>
            </div>
            <embed id={titulo+"embed"} className={styles.archivo} src={url}/>
        </div>
    )
}