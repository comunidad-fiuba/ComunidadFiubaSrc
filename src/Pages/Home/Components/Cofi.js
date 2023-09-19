import styles from "./Cofi.module.css"
import { useRef } from "react";

export function Cofi(){
    const animationRef = useRef(null);
    const startAnimation = () => {
        if(animationRef.current.classList.contains(styles.animateNow)){
            animationRef.current.classList.remove(styles.animateNow);
            return
        }
        animationRef.current.classList.add(styles.animateNow);
        setTimeout(() => {
            animationRef.current.classList.remove(styles.animateNow);
        }, 6800);
    }
    return(
        <div>
            <div className={styles.cofiContainer}>
                <img onClick={startAnimation} className={styles.cofi} src="./cofi_sleep2.png" alt="cofi"/>
                <img className={styles.cofi2} src="./cofi_wake.png" alt="cofi"/>
            </div>
            <div ref={animationRef} className={styles.animated}>
                <h2 className={styles.comunidadFiuba}><span className={styles.hiddenText}>Co</span>munidad <span className={styles.hiddenText}>Fi</span>uba</h2>
                <h2 className={`${styles.cofiText}`}><span className={styles.comunidad}><span className={styles.co}>Co</span><span className={styles.hiddenText}>munidad</span></span> <span className={styles.fiuba}><span className={styles.fi}>Fi</span><span className={styles.hiddenText}>uba</span></span></h2>
            </div>
        </div>


    )
}