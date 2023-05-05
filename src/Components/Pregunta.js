import {useState} from "react";

import styles from "./Pregunta.module.css"
export function Pregunta({enunciado, solucion,ejercicioNumero,verMas}){
    const [verSolucion, setVerSolucion] = useState(false)

    return(
        <div>
            {enunciado}
            <div style={{width:"100%", display:"flex", marginTop:"10px", alignItems:"center",justifyContent:"center", flexWrap:"wrap"}}>
                <button className={styles.boton} onClick={() => setVerSolucion(prevState => !prevState)}>Ver Solucion</button>
            </div>
            {verSolucion?
                <div>
                    {solucion}
                    <p className={styles.referencia}>Referencia: <a style={{textDecoration:"none", color:"lightslategray"}} href={verMas} target={"_blank"}>Ejercicio Numero {ejercicioNumero}</a></p>
                </div>:""}
        </div>

    )

}