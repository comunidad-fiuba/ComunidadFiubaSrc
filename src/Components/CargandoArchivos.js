import styles from "./Archivos.module.css"
import {useEffect, useState} from "react";
import ReactPaginate from "react-paginate";
import {useLocation, useNavigate} from "react-router-dom";
import {Archivo} from "./Archivo";
import {STORAGE} from "../Utilidad/Storage";
import {POSTDESTACADO} from "../Utilidad/Constantes";
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