import styles from "./Archivos.module.css"
import {Contenido} from "./Contenido";
import {useEffect, useState} from "react";
import ReactPaginate from "react-paginate";
import {useLocation, useNavigate} from "react-router-dom";
import {Archivo} from "./Archivo";
import {STORAGE} from "../Utilidad/Storage";
import {POSTDESTACADO} from "../Utilidad/Constantes";
export function Archivos({archivosSubidos,showAlert, preview, postsLikes, setPostsLikes, userData}){
    const [loadIndex, setLoadIndex] = useState(2)
    const archivosPorPagina = STORAGE.get("preview") === "false"?16:12;
    const [disabledButton, setDisabledButton] = useState(true);
    const navigate = useNavigate();
    const query = new URLSearchParams(useLocation().search);
    const pageCount = Math.ceil(archivosSubidos.length / archivosPorPagina);
    const page =  query.get("page") && Number(query.get("page")) > 0 && Number(query.get("page")) <= pageCount
        ? Number(query.get("page"))
        : 1

    useEffect(() =>{
        if(!preview){
            setDisabledButton(false)
        }else{
            setDisabledButton(true)
        }
    },[preview])

    if(archivosSubidos.length === 0) {
        return;
    }
    const archivosEndOffset = page*archivosPorPagina;
    const archivosActuales = archivosSubidos.slice(archivosEndOffset-archivosPorPagina, archivosEndOffset);
    const handlePageClick = (event) => {
        const newOffset = (event.selected * archivosPorPagina) % archivosSubidos.length;
        query.set("page",((newOffset/archivosPorPagina)+1).toString())
        navigate("/?" + query)
        setLoadIndex(2)
    };

    function moverDestacado(arr, indexFind) {
        const indexDestacado = arr.findIndex(archivo => archivo.id === indexFind)
        if(indexDestacado === -1){
            return
        }
        arr.splice(0, 0, arr.splice(indexDestacado, 1)[0]);
    };

    const mapped = (actuales) =>{
        for(let index in POSTDESTACADO){
            moverDestacado(actuales, POSTDESTACADO[index])
        }
        return actuales.map((archivo, index) =>
        {
            return <Archivo key={archivo.id + "file"} showAlert={showAlert}  setPostsLikes={setPostsLikes} userData={userData} archivo={archivo} fileIndex={index} loadIndex={loadIndex} setLoadIndex={setLoadIndex}
                              disabledButton={disabledButton} setDisabledButton={setDisabledButton} postsLikes={postsLikes}
                               preview={preview} />
        })}

    return(
        <div>
            <div className={styles.archivosContainer} onLoad={() =>setDisabledButton(false)}>
                {archivosActuales && mapped(archivosActuales)}
            </div>
            
            <ReactPaginate
                className={styles.pagination}
                previousLabel="<"
                nextLabel=">"
                breakLabel="..."
                pageClassName={styles.paginationPage}
                breakClassName={styles.paginationPage}
                previousClassName={styles.fastMove}
                nextClassName={styles.fastMove}
                onPageChange={handlePageClick}
                activeClassName={styles.activePage}
                pageRangeDisplayed={3}
                marginPagesDisplayed={1}
                pageCount={pageCount}
                renderOnZeroPageCount={null}
                forcePage={page-1}
                onClick={(clickEvent) => {
                    if(clickEvent.nextSelectedPage){
                        query.set("page",(clickEvent.nextSelectedPage+1).toString())
                        navigate("/?" + query)
                        setLoadIndex(2)
                    }
                }}
            />
            <p style={{textAlign:"center", padding:"0 20px"}}>Sumáte a la Comunidad compartiendo los examenes y resumenes para que todos los puedan aprovechar</p>
        </div>

    )
}