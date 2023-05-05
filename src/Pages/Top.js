import {useEffect, useState} from "react";
import styles from "./HomeAlen.module.css";
import {FcLike} from "react-icons/fc";

export function Top({archivos}){
    const [topUsers, setTopUsers] = useState(null)

    useEffect(() =>{
        if(topUsers || !archivos || archivos.length === 0){
            return;
        }
        const top = new Map()
        for( let i=0; i<archivos.length;i++){
            const user = archivos[i].usuario
            const likes = archivos[i].likes
            const uid = archivos[i].uid
            if(!user.length>0){
                continue
            }
            if(top.get(uid)){
                const objeto = top.get(uid)
                top.set(uid,{user:user, likes:objeto.likes+likes})
            }else{
                top.set(uid, {user:user, likes:likes})
            }
        }
        const topSort = new Map([...top.entries()].sort((a, b) => b[1].likes - a[1].likes));
        setTopUsers(topSort)
    },[archivos])

    if(topUsers){
        const topList = [...topUsers]
        return(<section className={styles.topSection} style={{userSelect:"none"}}>
            <div className={styles.topSectionHeader}>
                <h2>Top creadores más likeados</h2>
            </div>
                <ol className={styles.topList}>
                <li>
                    <ion-icon name="trophy-outline" style={{color:"gold"}}></ion-icon>
                    <span>{topList[0][1].user} <FcLike size={16}/> {topList[0][1].likes}</span></li>
                <li>
                    <ion-icon name="trophy-outline" style={{color:"silver"}}></ion-icon>
                    {topList.length>1
                        ?<span>
                        {topList[1][1].user} <FcLike size={16}/> {topList[1][1].likes}
                    </span>
                        :<span>---</span>}</li>
                <li>
                    <ion-icon name="trophy-outline" style={{color:"rgb(205, 127, 50)"}}></ion-icon>
                    {topList.length>2
                        ?<span>
                        {topList[2][1].user} <FcLike size={16}/> {topList[2][1].likes}
                    </span>
                        :<span>---</span>}</li>
                <li>
                    <ion-icon name="ribbon-outline" style={{color:"lightblue"}}></ion-icon>
                    {topList.length>3
                        ?<span>
                        {topList[3][1].user} <FcLike size={16}/> {topList[3][1].likes}
                    </span>
                        :<span>---</span>}</li>
                <li>
                    <ion-icon name="ribbon-outline" style={{color:"lightblue"}}></ion-icon>
                    {topList.length>4
                        ?<span>
                        {topList[4][1].user} <FcLike size={16}/> {topList[4][1].likes}
                    </span>
                        :<span>---</span>}</li>
            </ol>
        </section>
        )

    }else{
        return(
            <section className={styles.topSection}>
                <div className={styles.topSectionHeader}>
                    <h2>Top creadores más likeados</h2>
                </div>
                <ol className={styles.topList}>
                    <li>
                        <ion-icon name="trophy-outline" style={{color:"gold"}}></ion-icon>
                        <span>---</span></li>
                    <li>
                        <ion-icon name="trophy-outline" style={{color:"silver"}}></ion-icon>
                        <span>---</span></li>
                    <li>
                        <ion-icon name="trophy-outline" style={{color:"rgb(205, 127, 50)"}}></ion-icon>
                        <span>---</span></li>
                    <li>
                        <ion-icon name="ribbon-outline" style={{color:"lightblue"}}></ion-icon>
                        <span>---</span></li>
                    <li>
                        <ion-icon name="ribbon-outline" style={{color:"lightblue"}}></ion-icon>
                        <span>---</span></li>
                </ol>
            </section>
        )
    }


}