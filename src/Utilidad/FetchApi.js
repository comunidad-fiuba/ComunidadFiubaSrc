const fetchData = async (auth) =>{
    //fetch a la api que da info del usuario
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
                        //Este error Surge cuando el usuario aun no fue creado
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
                                    .catch(e =>alert(e))
                            //error en el fetch, servidor caido o error no captado en el servidor
                        ).catch(e =>alert(e))
                    }else{
                        //no deberia entrar nunca aca, pero por las dudas
                        alert(resJson.error)
                    }
                }
            })
            //error en el json, no deberia entrar nunca
            .catch(e =>alert(e))
        //error en el fetch, servidor caido o error no captado en el servidor
    ).catch(e =>alert(e))
    //estos errores se alertan porque provocarian que no funcione la app

    //fetch a la api que da los posts
    await fetch(process.env.REACT_APP_POSTS,{
        method:"GET"
    }).then(result=>result.json().then(resJson=>{
        //guardar los posts
        setArchivosSubidos(resJson)
    }).catch(e =>{
        //error en el json, no deberia entrar nunca
        alert(e)
    })).catch(e => {
        //error en el fetch, servidor caido o error no captado en el servidor
        alert(e)
    })
}