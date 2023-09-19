import styles from "./Archivos.module.css";
import {BiHeart} from "react-icons/bi";
import {FiShare2} from "react-icons/fi";

export function ArchivoCarga({index}){

    return (
        <div>
            <div className={`${styles.contentWrap}`} style={{marginTop:"1rem"}}>
                <div id={"iframeBottomCarga" + index}  className={styles.iframeBottom}>
                    <div style={{borderBottom:"1px solid gray", width:"100%", height:"31px",display:"flex",alignItems:"center"}}>
                        <div className={styles.loadingRow} style={{width:"100%",height:"9px",borderRadius:"100px", overflow:"hidden"}}>
                            <div className={styles.loadBackground}></div>
                        </div>
                    </div>

                    <div className={styles.izq}>
                        <div style={{width:"100%",height:"20px",display:"flex",alignItems:"center"}}>
                            <div className={styles.loadingRow} style={{width:"100%",height:"8px",borderRadius:"100px", overflow:"hidden"}}>
                                <div className={styles.loadBackground}></div>
                            </div>
                        </div>
                        <div style={{width:"75%",height:"20px",display:"flex",alignItems:"center"}}>
                            <div className={styles.loadingRow} style={{width:"100%",height:"6px",borderRadius:"100px", overflow:"hidden"}}>
                                <div className={styles.loadBackground}></div>
                            </div>
                        </div>
                        <div style={{width:"50%",height:"20px",display:"flex",alignItems:"center"}}>
                            <div className={styles.loadingRow} style={{width:"100%",height:"5px",borderRadius:"100px", overflow:"hidden"}}>
                                <div className={styles.loadBackground}></div>
                            </div>
                        </div>
                    </div>
                    <div className={styles.der}>
                        <button className={styles.like}>
                            <BiHeart className={styles.liked} style={{color:"gray"}} size={22}/>
                        </button>
                        <button className={styles.like}><FiShare2 style={{color:"gray"}} size={20} /></button>
                        <div style={{width:"40%",height:"20px",display:"flex",alignItems:"center", margin:"auto"}}>
                            <div className={styles.loadingRow} style={{width:"100%",height:"5px",borderRadius:"100px", overflow:"hidden"}}>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    )
}