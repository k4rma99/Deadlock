import React,{Component,useEffect} from "react"
import "../assets/css/playGameButton.css"
import {useSelector} from 'react-redux';
import { useFirebase, isLoaded, isEmpty } from 'react-redux-firebase'
import {useHistory} from 'react-router-dom'
import Svg from "./playGameSVG"
var Cookie = require('js-cookie');
export const PlayGameButton = (props) =>{

        const firebase =useFirebase();
        var history = useHistory();

        let auth = useSelector(state=>state.fireBaseReducer.auth);
        let profile = useSelector(state=>state.fireBaseReducer.profile);
        let authError = useSelector(state=>state.fireBaseReducer.authError)

        useEffect(()=>{
                /*if(auth.isEmpty==false){
                        Cookie.set("LoggedIn","true");
                        props.SetStateChange(props.forceStateChange * -1);
                }
                */
        })

        function loginWithGoogle() {
                firebase.auth().setPersistence(firebase.auth.Auth.Persistence.LOCAL)
                .then(function() {
                        return firebase.login(
                                { provider: 'google', type: 'popup' }
                                );
                })
        }
    
        return(<div className="main-grid">
                        <div className="main-header">
                                <div style={{position:"relative"}}>
                                <div id="glitch-holder">
                                        <h1  class="heading glitch" data-text="DEADLOCK">DEADLOCK</h1>
                                </div></div>
                                <h1 className="span-header">Lorem ipsum dolor</h1>
                                {
                                        authError!=null
                                        ?<span>{auth.authError}</span>
                                        :""
                                }
                        </div>
                        <div className="wrapper">
                                <div onClick={()=>{isLoaded(auth)?loginWithGoogle():console.log("")}} className="cta" >
                                        {
                                                !isLoaded(auth)
                                                ? <span>Loading</span>
                                                : isEmpty(auth)
                                                ? <span>LOGIN</span>
                                                : <span>LOGGEDIN</span>
                                        }
                                        <Svg />
                                </div>
                        </div>
                </div>
        )
}

export default PlayGameButton
