import styles from "./LoadingBar.module.css"

export function LoadingBar({width}){
    return (
        <div className={styles.container}>
            <div className={styles.bar} style={{width:width+"%"}}>
            </div>
        </div>
    )
}