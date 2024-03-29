import './App.css';
import {useEffect, useState} from "react";
import {
    BrowserRouter as Router,
    Routes,
    Route, Navigate,
} from "react-router-dom";
import {Subir} from "./Pages/Subir/Subir";
import {Home} from "./Pages/Home/Home";
import {Perfil} from "./Pages/Perfil/Perfil";
import {CambiarUsername} from "./Pages/CambiarUsername/CambiarUsername";
import 'firebase/compat/firestore';
import 'firebase/compat/auth';
import {DetallesArchivo} from "./Pages/DetallesArchivo/DetallesArchivo";
import {MATERIASREMPLAZABLES, MATERIASREMPLAZO} from "./Utilidad/Constantes";
import {LoginNuevo} from "./Pages/Login/Login";
export default function Main({auth}) {
    //declarar los datos importantes
    const [archivosSubidos, setArchivosSubidos] = useState([])
    const [userData, setUserData] = useState(null)
    const [isLoading, setIsLoading] = useState(true)
    const [postsLikes, setPostsLikes] = useState([])
    const [caughtError, setCaughtError] = useState(null)
    const filtrarMaterias = (archivos) =>{
        for(let index in archivos){
            const indexReemplazo = MATERIASREMPLAZABLES.indexOf(archivos[index].materia)
            if(indexReemplazo !== -1){
                archivos[index].materia = MATERIASREMPLAZO[indexReemplazo]
            }
        }
        return archivos
    }
    /*const setArchivosSubidos = () =>{

    }
    //fix desesperado
    const archivosSubidos = filtrarMaterias(data);
    */

    useEffect(() =>{
        const fetchData = async () =>{
            //fetch a la api que da info del usuario
            //fetch a la api que da los posts
            await fetch(process.env.REACT_APP_POSTS,{
                method:"GET"
            }).then(result=>result.json().then(resJson=>{
                //guardar los posts
                setArchivosSubidos(filtrarMaterias(resJson))
            }).catch(e =>{
                //error en el json, no deberia entrar nunca
                setCaughtError(e)
            })).catch(e => {
                //error en el fetch, servidor caido o error no captado en el servidor
                setCaughtError(e)
            })
        }
        //realizar el fetch para obtener todos los datos y dejar de mostrar el icono de carga
        fetchData().then(res =>setIsLoading(false))
    },[])
    useEffect(() =>{
        const fetchData = async () =>{
            if(auth.currentUser){
            await fetch(process.env.REACT_APP_USER_DATA+auth.currentUser.uid,{
                method:"GET"
            }).then(result=>result.json()
                    .then(resJson=>{
                        //resJson.error es un error captado y entendido en el servidor de la api
                        if(!resJson.error){
                            //si no hay error guardar los datos
                            setUserData(resJson)
                            setPostsLikes(resJson.likes)
                        }else{
                            //si hay error checkear el tipo
                            if(resJson.error==='Usuario no encontrado'){
                                //Este error surge cuando el usuario aun no fue creado
                                //Crear el usuario
                                fetch(process.env.REACT_APP_USER,{
                                    method:"POST",
                                    body:JSON.stringify({
                                        userName:auth.currentUser.displayName,
                                        uid:auth.currentUser.uid
                                    })
                                }).then(result=>
                                        result.json()
                                            .then(resJson=>{
                                                //guardar la info del usuario nuevo
                                                setUserData(resJson)})
                                            //error en el json, no deberia entrar nunca
                                            .catch(e =>setCaughtError(e))
                                    //error en el fetch, servidor caido o error no captado en el servidor
                                ).catch(e =>setCaughtError(e))
                            }else{
                                //no deberia entrar nunca aca, pero por las dudas
                                setCaughtError(resJson?.error)
                            }
                        }
                    })
                    //error en el json, no deberia entrar nunca
                    .catch(e =>setCaughtError(e))
                //error en el fetch, servidor caido o error no captado en el servidor
            ).catch(e =>setCaughtError(e))
            //estos errores se alertan porque provocarian que no funcione la app
        }else{
                setUserData(null)
                setPostsLikes([])
            }
        }
        fetchData().then(res =>{})
    },[auth.currentUser])
    return (
        <Router>
            <main>
                <Routes>
                    <Route path="/subir" element={auth.currentUser?
                        <Subir user={userData} setArchivosSubidos={setArchivosSubidos} auth={auth}/>:
                        <Navigate replace to="/login" />}/>
                    <Route path="/perfil" element={auth.currentUser?<Perfil archivosSubidos={archivosSubidos} setArchivosSubidos={setArchivosSubidos} auth={auth} userData={userData}
                                                           isLoading={isLoading} />:<Navigate replace to="/login" /> }/>
                    <Route path="/changeUser" element={auth.currentUser?
                        <CambiarUsername userData={userData} setUserData={setUserData} auth={auth}/>:<Navigate replace to="/login" />}/>
                    <Route exact path="/post/:postSlug" element={<DetallesArchivo isLoading={isLoading} archivosSubidos={archivosSubidos}  postsLikes={postsLikes}
                                                                                userData={userData} setPostsLikes={setPostsLikes} caughtError={caughtError}/>}/>
                    <Route path="/login" element={<LoginNuevo auth={auth}/> }/>

                    <Route path="/" element={<Home archivosSubidos={archivosSubidos} isLoading={isLoading}  postsLikes={postsLikes}
                                                   auth={auth}  setPostsLikes={setPostsLikes} userData={userData} caughtError={caughtError}/>}/>
                    <Route path="*" element={<Navigate replace to="/" />}/>
                </Routes>
            </main>
        </Router>
    );
}