import styles from "./MateriasModal.module.css"
import { MATERIAS } from "../../../Utilidad/Constantes";
import {useEffect, useState} from "react";

function cargarRecientes(){
    const recientes = localStorage.getItem("recientes")
    if(recientes){
        return JSON.parse(recientes)
    }
    return []
}
function cargarTodas(recientes){
    return MATERIAS.filter(materia => recientes.indexOf(materia) === -1)
}

export function MateriasModal({ isOpen, setIsOpen, materiaElegida, changeMateriaElegida,closeMateriaOnClick }) {
    let recientesList = cargarRecientes()
    const [materiasList, setMateriasList] = useState(cargarTodas(recientesList))
    const close = () => {
        setIsOpen(false)
        document.documentElement.style.overflow = "unset"
        document.getElementById("materias-input").value = ""
        filterMaterias()
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
        if(text.length === 0 || text[0] === ""){
            setMateriasList(cargarTodas(recientesList))
            return
        }
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
        if(materiaElegida && materiaElegida !== "Materia"){
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
        setMateriasList(cargarTodas(recientesList))
    }
    const clearAndClose = () =>{
        closeMateriaOnClick()
        close()
    }
    const changeAndClose = (e) =>{
        if(recientesList.length >= 7){
            recientesList.pop()
        }
        if(recientesList.indexOf(e.target.value) !== -1){
            recientesList.splice(recientesList.indexOf(e.target.value),1)
        }
        recientesList.unshift(e.target.value)
        localStorage.setItem("recientes",JSON.stringify(recientesList))
        changeMateriaElegida(e)
        setTimeout(() => {
            close()
        }, 150);
    }

    const shouldShowRecientes = () =>{
        const materiasInput = document.getElementById("materias-input");
        if(!materiasInput){
            return true
        }
        return materiasInput.value === ""
    }

    const mapRecientes = () =>{
        return recientesList.map(materia => {
            return (<div key={materia + "filter"}>
                <label className={styles.labelRadio}>
                    <input className={styles.hiddenRadio} onChange={changeAndClose} type="radio" id={materia + "radio"} name="materias-radio" value={materia} checked={materia===materiaElegida?true:false}/>{materia}
                    <i></i>
                </label>
            </div>)
        })
    }
    const clearRecientes = () =>{
        localStorage.removeItem("recientes")
        recientesList = []
        setMateriasList(cargarTodas(recientesList))
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
                    {recientesList.length>0 && shouldShowRecientes()?<p>Recientes <button onClick={clearRecientes} className={styles.clearRecientes}><ion-icon name="trash-outline" ></ion-icon></button></p>:""}
                    {shouldShowRecientes()?mapRecientes():""}
                    {recientesList.length>0  && shouldShowRecientes()?<p>Otras</p>:""}
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