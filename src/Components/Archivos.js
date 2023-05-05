import styles from "./Archivos.module.css"
import {Contenido} from "./Contenido";
import {useEffect, useState} from "react";
import ReactPaginate from "react-paginate";
import {useLocation, useNavigate} from "react-router-dom";
import {Archivo} from "./Archivo";
import {STORAGE} from "../Utilidad/Storage";
export function Archivos({archivosSubidos,showAlert, preview, auth, postsLikes,likesQuery, archivosRef, userName}){
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

    const mapped = (actuales) =>{
        return actuales.map((archivo, index) =>
        {
            return <Archivo key={archivo.postId + "file"} showAlert={showAlert} archivo={archivo} fileIndex={index} loadIndex={loadIndex} setLoadIndex={setLoadIndex}
                              disabledButton={disabledButton} setDisabledButton={setDisabledButton} postsLikes={postsLikes} uid={auth.currentUser.uid}
                              archivosRef={archivosRef} likesQuery={likesQuery} preview={preview} userName={userName}/>
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
                pageRangeDisplayed={5}
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
        </div>

    )
}