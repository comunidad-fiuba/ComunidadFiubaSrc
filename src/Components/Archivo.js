import {useState} from "react";
import {Comentarios} from "./Comentarios";
import {Contenido} from "./Contenido";

export function Archivo({archivo, fileIndex,loadIndex,setLoadIndex,disabledButton,setDisabledButton,
                            postsLikes,archivosRef,likesQuery,preview, uid, showAlert, userName}){

    const [verComentarios,setVerComentarios] = useState(false)

    return(
        <div>
            <Comentarios setVerComentarios={setVerComentarios} verComentarios={verComentarios} comentarios={archivo.comentarios}
                         comentariosRef={archivo.comentariosRef} userName={userName} uid={uid} fileIndex={fileIndex}/>
            <Contenido archivo={archivo} fileIndex={fileIndex} loadIndex={loadIndex} setLoadIndex={setLoadIndex} verComentarios={verComentarios}
                       disabledButton={disabledButton} setDisabledButton={setDisabledButton} postsLikes={postsLikes} showAlert={showAlert}
                       archivosRef={archivosRef} likesQuery={likesQuery} preview={preview} setVerComentarios={setVerComentarios}/>
        </div>
    )
}