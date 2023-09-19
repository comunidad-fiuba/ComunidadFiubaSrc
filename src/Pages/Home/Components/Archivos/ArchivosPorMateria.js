import {useEffect, useState} from "react";
import {Link, useLocation, useNavigate} from "react-router-dom";
import {Archivo} from "./Archivo";
import styles from "./Archivos.module.css";
import {MdUnfoldMore} from "react-icons/md";

export function ArchivosPorMateria({archivosSubidos,showAlert, preview, postsLikes, setPostsLikes, userData}){
    const [loadIndex, setLoadIndex] = useState(2)
    const [disabledButton, setDisabledButton] = useState(true);
    const [archivosDivididos, setArchivosDivididos] = useState([])

    useEffect(() =>{
        if(!preview){
            setDisabledButton(false)
        }else{
            setDisabledButton(true)
        }
    },[preview])
    useEffect(() =>{
        let divisionDeArchivos = new Map()
        for(let index in archivosSubidos){
            const archivo = archivosSubidos[index];
            const materia = archivo.materia;
            if(divisionDeArchivos.has(materia)){
                if(divisionDeArchivos.get(materia).length < 8)
                divisionDeArchivos.get(materia).push(archivo)
            }else{
                divisionDeArchivos.set(materia,[archivo])
            }
        }
        const nuevaLista = []
        for (let [materia, archivos] of divisionDeArchivos) {
            nuevaLista.push([materia, archivos])
        }
        setArchivosDivididos(nuevaLista)
    },[])

    if(archivosSubidos.length === 0) {
        return;
    }
    const slugify = (materia) =>{
        return materia.toLowerCase()
            .replace(/[^\w ]+/g, '')
            .replace(/ +/g, '-');
    }


    const mapped = (actuales) => {
        return actuales.map((par, parIndex) => {
            return (
                <div style={{width:"100%", display:"flex", flexWrap:"wrap", gap:"20px" ,justifyContent:"center"}}>
                    <div style={{width:"100%"}}>
                        <h1 style={{width:"100%", textAlign:"center"}}>{par[0]}</h1>
                        <p style={{width:"100%" ,textAlign:"center" ,margin:"0", marginBottom:"-20px"}}>Mas Likes | Nuevas</p>
                    </div>
                    {par[1].map((archivo, index) => {
                        return <Archivo key={archivo.id + "file"} showAlert={showAlert} setPostsLikes={setPostsLikes}
                                        userData={userData} archivo={archivo} fileIndex={index} loadIndex={1000000}
                                        setLoadIndex={setLoadIndex}
                                        disabledButton={disabledButton} setDisabledButton={setDisabledButton}
                                        postsLikes={postsLikes}
                                        preview={preview}/>
                    })}
                    <Link style={{width:"100%", textAlign:"center", color:"white",textDecoration:"none" ,display:"flex", alignItems:"center", justifyContent:"center"}} to={"/"+slugify(par[0])}><span style={{fontSize:"1.25em"}}>Ver Todas</span><MdUnfoldMore size={20}/></Link>
                </div>
            )
        })
    }

    return(
        <div style={{marginBottom:"40px"}}>
            <div className={styles.archivosContainer} onLoad={() =>setDisabledButton(false)}>
                {archivosDivididos && mapped(archivosDivididos)}
            </div>
        </div>

    )
}