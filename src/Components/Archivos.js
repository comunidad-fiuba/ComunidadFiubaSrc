import styles from "./Archivos.module.css"
import {useState} from "react";
import ReactPaginate from "react-paginate";
import {useLocation, useNavigate} from "react-router-dom";
import {Archivo} from "./Archivo";
import {POSTDESTACADO} from "../Utilidad/Constantes";
export function Archivos({archivosSubidos,showAlert, postsLikes, setPostsLikes, userData}){
    const archivosPorPagina = 16;
    const [disabledButton, setDisabledButton] = useState(false);
    const navigate = useNavigate();
    const query = new URLSearchParams(useLocation().search);
    const pageCount = Math.ceil(archivosSubidos.length / archivosPorPagina);
    const page =  query.get("page") && Number(query.get("page")) > 0 && Number(query.get("page")) <= pageCount
        ? Number(query.get("page"))
        : 1

    if(archivosSubidos.length === 0) {
        return;
    }
    const archivosEndOffset = page*archivosPorPagina;
    const archivosActuales = archivosSubidos.slice(archivosEndOffset-archivosPorPagina, archivosEndOffset);
    const handlePageClick = (event) => {
        const newOffset = (event.selected * archivosPorPagina) % archivosSubidos.length;
        query.set("page",((newOffset/archivosPorPagina)+1).toString())
        navigate("/?" + query)
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
        return actuales.map((archivo) =>
        {
            return <Archivo key={archivo.id + "file"} showAlert={showAlert}  setPostsLikes={setPostsLikes} userData={userData} archivo={archivo}
                              disabledButton={disabledButton} setDisabledButton={setDisabledButton} postsLikes={postsLikes}/>
        })}

    return(
        <div>
            <div className={styles.archivosContainer}>
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
                    }
                }}
            />
            <p style={{textAlign:"center", padding:"0 20px"}}><b>No te quedes afuera</b>, sumáte a la Comunidad compartiendo tus examenes y resumenes.</p>
        </div>

    )
}