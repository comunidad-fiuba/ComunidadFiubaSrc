import styles from "./MateriasModal.module.css"
import { MATERIAS } from "../../../../Utilidad/Constantes";
import {useEffect, useState} from "react";

export function MateriasModal({ isOpen, setIsOpen, materiaElegida, changeMateriaElegida,closeMateriaOnClick }) {
    const [materiasList, setMateriasList] = useState(MATERIAS)
    const close = () => {
        setIsOpen(false)
        document.documentElement.style.overflow = "unset"
    }
    const debounceFn = (func, interval) => {
        if (typeof func !== "function" || typeof interval !== "number") throw new TypeError("Arguments should be of type (function, number)")
        let timeout;
        return (...args) => {
            clearTimeout(timeout)
            timeout = setTimeout(() => {
                func(...args)
            }, interval);
        }
    }
    const filterMaterias = () =>{
        let text = document.getElementById("materias-input").value
        const numeros = ["4", "3", "2", "1"]
        const romanos = ["iv", "iii", "ii", "i"]
        text = text.toLowerCase().split(" ")
        setMateriasList(MATERIAS.filter(materia => {
            const materiaPalabras =  materia.split(" ");
            for(let word of text){
                let included = false
                const numeroIndex = numeros.indexOf(word);
                let romano = numeroIndex !== -1?romanos[numeroIndex]:null
                for(let palabra of materiaPalabras){
                    if(romano && palabra.toLowerCase() === romano){
                        included = true
                        break
                    }else if(palabra.toLowerCase().includes(word)){
                        included = true
                        break
                    } 
                }
                if(!included){
                    return false
                }
            }
            return true
        }))
    }
    const debouncedFilter = debounceFn(filterMaterias, 300)

    useEffect(() => {
        if(materiaElegida){
            document.getElementById(materiaElegida + "radio").checked = true
        }
    },[materiaElegida])

    const closeOnClickOutside = (e) =>{
        if(e.target.id !== "materias-modal-wrap"){
            e.bubbles = false
        }else if(e.bubbles){
            close()
        }
    }
    const clearFilter = () =>{
        document.getElementById("materias-input").value = ""
        setMateriasList(MATERIAS)
    }
    const clearAndClose = () =>{
        closeMateriaOnClick()
        close()
    }
    const changeAndClose = (e) =>{
        changeMateriaElegida(e)
        setTimeout(() => {
            close()
        }, 150);
    }
    return (
        <div className={styles.modalWrapper} id="materias-modal-wrap" style={{ display: isOpen ? "flex" : "none" }} onClick={closeOnClickOutside}>
            <div className={styles.modal}  onClick ={closeOnClickOutside}>
                <button className={styles.closeButton} onClick={close}><ion-icon name="checkmark-outline"></ion-icon></button>
                <button className={styles.removeButton} onClick={clearAndClose}><ion-icon name="refresh-outline" ></ion-icon></button>
                <h1 className={styles.titulo}>Materias</h1>
                <div className={styles.filterWrap}>
                <input type="text" onChange={debouncedFilter} className={styles.inputMateria} id="materias-input" placeholder="Buscar materia"/>
                <button onClick={clearFilter} className={styles.clear}><ion-icon name="close-outline" ></ion-icon></button>
                </div>
                <div className={styles.materiasList}>
                    {materiasList.length>0?materiasList.map(materia => {
                        return (<div key={materia + "filter"}>
                            <label className={styles.labelRadio}>
                                <input className={styles.hiddenRadio} onChange={changeAndClose} type="radio" id={materia + "radio"} name="materias-radio" value={materia} checked={materia===materiaElegida?true:false}/>{materia}
                                <i></i>
                            </label>
                        </div>)
                    }):<p>No se encontraron materias</p>}
                </div>
            </div>
        </div>
    )
}