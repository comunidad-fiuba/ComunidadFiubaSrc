import 'katex/dist/katex.min.css';
import {PREGUNTAS_ANALISIS_2} from "../Utilidad/Preguntas";
import styles from "./Practicar.module.css"
import {useEffect, useState} from "react";
import {MdKeyboardArrowDown} from "react-icons/md";
import {Link} from "react-router-dom";
import {STORAGE} from "../Utilidad/Storage";


export function  Practicar(){
    const [preguntaActual, setPreguntaActual] = useState(STORAGE.get("pregunta")?STORAGE.get("pregunta"):0)

    const siguientePregunta = () =>{
        let siguientePregunta = preguntaActual + 1
        if(siguientePregunta >= PREGUNTAS_ANALISIS_2.length){
            siguientePregunta = 0
        }
        STORAGE.set("pregunta", siguientePregunta)
        setPreguntaActual(siguientePregunta)
    }
    return(
        <div className={styles.mainDiv}>
            <div className={styles.header}>
                <h1 className={styles.titulo}>Practicar</h1>
                <h2 className={styles.subtitulo}>Analisis Matematico II</h2>
            </div>
            <div className={styles.contentDiv}>
                <div style={{position:"relative"}}>
                    <button onClick={siguientePregunta} className={styles.nuevaPregunta}>Siguiente</button>
                    {PREGUNTAS_ANALISIS_2[preguntaActual]}
                </div>
            </div>
            <footer id="top" className={styles.footer}>
                <p style={{width:"50%", textAlign:"center"}}>&copy; 2023. Todos los derechos reservados.</p>
                <p style={{width:"50%", textAlign:"center"}}>Creado por Andres Melnik y Alen Monti <i
                    className="fas fa-laptop-code"></i></p>
                <p style={{width:"50%", textAlign:"center", userSelect:"all", overflow:"hidden"}}>andres.d.melnik@gmail.com</p>
                <p style={{width:"50%", textAlign:"center", userSelect:"all"}}>montialen@gmail.com</p>
            </footer>
            <Link to="/"><ion-icon name="arrow-back-outline" style={{position: "absolute", color: "white", left: "10px", top :"10px", fontSize: "2em", cursor:"pointer"}}></ion-icon></Link>
        </div>
    )
}