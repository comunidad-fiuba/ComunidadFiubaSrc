import styles from "./Archivos.module.css";
import {Timestamp} from "firebase/firestore";
import {HiOutlineTrash} from "react-icons/hi";


export function Comentario({comentario, miUid, borrarComentario, setConfirmando}){

    const fechaActual = Timestamp.now()
    const secondsDifference = fechaActual.seconds - comentario.fecha.seconds
    const borrarEsteComentario = () =>{
        if(miUid === comentario.uid){
            borrarComentario(comentario.docId, comentario)
        }
    }
    const getFecha = () =>{
        if(secondsDifference < 5){
            return "Recién"
        } else if(secondsDifference < 60){
            return "Hace " + secondsDifference + " segundos"
        }else if(secondsDifference < 3600){
            const redondeado = Math.floor(secondsDifference/60)
            const s = redondeado!==1?"s":""
            return "Hace " + redondeado + " minuto" + s
        }else if(secondsDifference < 86400){
            const redondeado = Math.floor((secondsDifference/60)/60)
            const s = redondeado!==1?"s":""
            return "Hace " + redondeado + " hora"+ s
        }else if (secondsDifference < 259200){
            return "Hace " + Math.floor(((secondsDifference/60)/60)/24) + " dias"
        }else{
            return comentario.fecha.toDate().toLocaleDateString()
        }
    }
    const fechaMostrar = getFecha()
    const usuario = comentario.usuario
    const texto = comentario.texto
    return(
        <div>
            <div className={styles.comentario}><span className={styles.usuario}>{usuario}</span><span
                className={styles.fecha}>{fechaMostrar}</span>{miUid===comentario.uid?<span className={styles.borrar} onClick={() => setConfirmando(() => borrarEsteComentario)}><HiOutlineTrash size={18}/></span>:""}<p className={styles.texto}>{texto}</p></div>
        </div>
    )
}