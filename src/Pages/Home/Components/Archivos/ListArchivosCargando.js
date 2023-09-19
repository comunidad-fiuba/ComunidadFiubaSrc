import styles from "./Archivos.module.css"
import {ArchivoCarga} from "./ArchivoCarga";
export function CargandoArchivos({preview}){
    const cantidad = preview?12:16
    const archivos = () =>{
        const lista = Array.apply(null, Array(cantidad)).map(()=>{})
        return lista.map((archivo, index) =>
        {
            return <ArchivoCarga key={index + "fileCarga"} index={index} />
        })}

    return(
        <div>
            <div className={styles.archivosContainer}>
                {archivos()}
            </div>
            <div style={{height:"60px"}}></div>
        </div>


    )
}