import {useState} from "react";
import {Comentarios} from "./Comentarios";
import {Contenido} from "./Contenido";
import {useNavigate} from "react-router-dom";

export function Archivo({archivo,disabledButton,setDisabledButton,
                            postsLikes, showAlert, userData, setPostsLikes}){

    const [verComentarios,setVerComentarios] = useState(false)
    const navigate = useNavigate();
    const likePost = (postId) =>{
        if(!userData){
            navigate("/login")
            return
        }
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

    return(
        <div>
            {/*<Comentarios setVerComentarios={setVerComentarios} verComentarios={verComentarios} comentarios={archivo.comentarios}
                         comentariosRef={archivo.comentariosRef} userName={userName} uid={uid} fileIndex={fileIndex}/>*/}
            <Contenido archivo={archivo} verComentarios={verComentarios}
                       disabledButton={disabledButton} postsLikes={postsLikes} showAlert={showAlert}
                       likePost={likePost}/>
        </div>
    )
}