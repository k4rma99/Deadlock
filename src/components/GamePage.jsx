import React, { useEffect,useState,useRef } from 'react';
import {FancyLoader} from "./fancyLoader.jsx"
import { useFirebase, isLoaded } from 'react-redux-firebase'

import "../assets/css/GamePage.css"
import { useSelector } from 'react-redux';

export const GamePage = (props) =>{
  var profile = useSelector(state=>state.fireBaseReducer.profile);
  var auth = useSelector(state=>state.fireBaseReducer.auth);
  const firebase = useFirebase()

  var added = useRef(false);
  const logout = () =>{
    props.firebase.logout();
    props.SetStateChange(props.forceStateChange*-1)
  }

  function updateUserProfile() {
    return firebase.updateProfile({
        email: "test",
      displayName:"test",
      mobno:"test",
      college:"test",
      rset:"test"
    })
  }

  // setting up DOM references

var searchOverlay = null;
var searchInput = null;
var searchButton = null;
var liRef = null;

// Status indicating that search is not active. 
	
var searchStatus = useRef(false);

const searchClicked = () =>{
    console.log("epe")
    if(searchOverlay && searchInput && searchButton &&liRef){
      if (!searchStatus.current) {
        requestAnimationFrame(()=>{ 
            searchOverlay.style.display = "flex"
            liRef.style.opacity = "0"
            searchInput.focus();
        })
  searchStatus.current = true;
  }
else  {
    requestAnimationFrame(()=>{
        searchOverlay.style.display = "none"
        liRef.style.opacity = "1"
        searchInput.textContent = ''
    })
    searchStatus.current = false;

}
    }
    
}

const SearchInputKeyUp = (e) =>{
  if(searchOverlay && searchInput && searchButton &&liRef){
    if (searchStatus) {
      if (!e.target.value) {
          requestAnimationFrame(()=>{
              searchOverlay.style.display = "none"
              liRef.style.opacity = "1"
              searchInput.textContent=''
          })
       searchStatus.current = false;
      }
   }
  }
}

const ClosePage = (e) =>{
    console.log("d")
    console.log(e.target.className)
    if(searchOverlay && searchInput && searchButton &&liRef){
      if(e.target.className!='search' && e.target.className!='text-area-search' && e.target.className!='search-button'){
        if(searchStatus.current == true){
            requestAnimationFrame(()=>{
                searchOverlay.style.display = "none"
                liRef.style.opacity = "1"
                searchInput.textContent = ''
            })
            searchStatus.current = false;
        }
    }
    }
}

const submitAnswer = async () =>{
  try{

    let querySnapshot = await firebase.firestore().collection('QnA').doc(profile.level+'').get();
    console.log(querySnapshot.data())
    
    //const docRef = firestore.doc('QnA/1')
    //docRef.get() (doc.data)
  } 
  catch(error){
    console.log(error)
  }
}

useEffect(()=>{

    console.log(added.current)
    if(added.current==false){

        document.addEventListener("keyup",(e)=>{
          if(searchOverlay && searchInput &&liRef){
            if (e.keyCode == 27 && searchStatus.current) {
              searchOverlay.style.display = "none"
              liRef.style.opacity = "1"
              searchInput.textContent = ''
          searchStatus.current = false;
           }
          }
            
        })

        window.addEventListener("keydown",(e)=>{
          if(searchOverlay && searchInput &&liRef){
            if (!e) e = window.event;
            if (!e.metaKey) {
              if(e.keyCode >= 65 && e.keyCode <= 90 || e.keyCode >= 48 && e.keyCode <= 57) {
                  if (!searchStatus.current) {
                        searchOverlay.style.display = "flex"
                        liRef.style.opacity = "0"
                        searchInput.focus();//
                      searchStatus.current = true;
                  }
              }
            }
          }
        })
        added.current = true;
    }
    if(searchOverlay){ 
      searchOverlay.style.display = "none"

    }
},[])

    return (
        <div style={{width:"100%",height:"100%"}}>
{
/*<FancyLoader></FancyLoader>*/
      !isLoaded(profile)
      ?<FancyLoader></FancyLoader>
      :(
        <div className="game-main" onClick={e=>ClosePage(e)} style={{width:"100vh",height:"100vh",paddingTop:"10vh",paddingLeft:"4vw",paddingRight:"4vw",backgroundColor:"black",display:"flex",flexDirection:"column"}}>

<h1 className="game-header">Challenge</h1>
<div className="img-wrapper">
<nav className="search-nav">
  <ul>
    <li ref={ref=>liRef=ref} style={{display:"flex",flexDirection:"row",height:"100%"}}>
        <button onClick={()=>searchClicked()} ref={ref=>searchButton=ref} className="search"></button>
        <div onClick={()=>searchClicked()} style={{width:"80%"}} className="text-area-search">Your answer here.</div>
    </li>
    <li>
    <div ref={ref=>searchOverlay=ref} id="searchOverlay" style={{display:"none"}}>
  
  <input ref={ref=>searchInput=ref} style={{fontSize:"3em",height:"100%"}} onKeyUp={(e)=>SearchInputKeyUp(e)} autofocus type="text" placeholder=""/>
    
  </div>
    </li>
  </ul>
  <br/>
  <button className="search-button" onClick={()=>submitAnswer()}>
     <h3>Submit</h3>
  </button>
</nav>
    <img src="https://htmlcolorcodes.com/assets/images/html-color-codes-color-tutorials-hero-00e10b1f.jpg"></img>
</div>
    <div style={{height:"100vh",backgroundColor:"white",color:"black",paddingTop:"10vh"}}>
        Game Page
      <button onClick={()=>logout()}>Logout</button>
    </div>
          </div>
        
      )
}
    </div>
    )
}