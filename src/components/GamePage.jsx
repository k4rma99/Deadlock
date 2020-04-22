import React, { useEffect,useState,useRef } from 'react';
import {FancyLoader} from "./fancyLoader.jsx"
import { useFirebase, isLoaded } from 'react-redux-firebase'
import {gsap} from "gsap";
import {updateLevel} from "../redux/actions.jsx"
import "../assets/css/GamePage.css"
import firebase from "../firebase/firebase.js"
import { useSelector,useDispatch } from 'react-redux';
var CryptoJS = require("crypto-js");

export const GamePage = (props) =>{
  var playerState = useSelector(state=>state.rootReducer);
  const lvl1=useRef("b16d7a03a24d35c3434f78ea1f09a0ac177f64769772df7d8f2cf07940de865f");
  var t = gsap.timeline();  
  var [content,setContent] = useState(
    {
      question:"",
      isLoading:true,
      submitting:false,
      error:{
        flag:false,
        message:""
      }
    }
  )

  var added = useRef(false);

  const openModal = () =>{

    setContent(
      {
        question:"",
        isLoading:false,
        submitting:false,
        error:{
          flag:false,
          message:""
        },
        success:true
      }
    )
  }

  const closeModal = () =>{
      t.reverse();
      setContent(
        {
          question:"",
          isLoading:true,
          submitting:false,
          error:{
            flag:false,
            message:""
          }
        }
      )
  }
 
  const check_ans =(ans_hash)=>{
    firebase.firestore().collection('testQnA').doc(ans_hash).get().then((doc)=>{
      if (doc.exists) {
        var date = new Date();
        var time_stamp = date.getTime();
        firebase.firestore().collection('users').doc(playerState.uid).update({
          prevhash: ans_hash,
          timestamp: time_stamp,
          level: content.level + 1
        }).then((success) => {
          console.log("success youve answered the question");
          openModal();
          /*firebase.firestore().collection('logs').add({
            uid:playerState.uid,
            prevhash:ans_hash,
            level:content.level+1
          })*/
        })
      } else {
        setContent(
          {
            question:content.question,
            encryptedans:content.encryptedans,
            isLoading:false,
            submitting:false,
        level:content.level,
        prevhash:content.prevhash,
            error:{
              flag:true,
              message:"Sorry wrong answer!"
            }
          }
        )
      }
    }).catch((error)=>{
      setContent(
        {
          question:content.question,
          isLoading:false,
          submitting:false,
      level:content.level,
      prevhash:content.prevhash,
          error:{
            flag:true,
            message:"Some error occurred!"
          }
        }
      )
    })
  }


 const hash_ans=()=>{
  var before_hash;
  console.log("question",content.question);
  console.log("answer",searchInput.value);
  console.log("lvl1",lvl1.current);
  if(content.level==1){
    before_hash = lvl1.current.concat(content.question,searchInput.value);
  }
  else{
    before_hash = content.prevhash.concat(content.question,searchInput.value);
  }
  let hash = CryptoJS.SHA256(before_hash);
  let encryptedans = hash.toString(CryptoJS.enc.Hex)
  //check_ans(encryptedans);
  console.log(encryptedans);
  setContent(
    {
      question:content.question,
      encryptedans:encryptedans,
      isLoading:true,
      level:content.level,
      prevhash:content.prevhash,
      submitting:true,
      error:{
        flag:false,
        message:""
      }
    }
  )
}
 const submitAnswer = async () =>{
  try{  
    if(searchInput){
        if(searchInput.value.trim()!=""){
          hash_ans();
        }
        else{
          setContent(
            {
              question:content.question,
              isLoading:false,
              submitting:false,

        level:content.level,
        prevhash:content.prevhash,
              error:{
                flag:true,
                message:"Please enter an answer!"
              }
            }
          )
        }
    }
    else{
      setContent(
        {
          question:content.question,
          isLoading:false,
          submitting:false,
        level:content.level,
        prevhash:content.prevhash,
          error:{
            flag:true,
            message:"Please enter an answer!"
          }
        }
      )
    }
    
  } 
  catch(error){
    console.log(error)
  }
}

 const get_ques =(actual_hash,level)=>{
  if(actual_hash!=null || actual_hash!=undefined ||actual_hash!=null){
    firebase.firestore().collection('testQnA').doc(actual_hash).get().then((doc)=>{
      console.log("question does exist");
      console.log(doc.data().question)
      setContent({
        question:doc.data().question,
        isLoading:false,
        level:level,
        prevhash:actual_hash,
        submitting:false,
        error:{
          flag:false,
          message:""
        }
      })
    }
    ).catch((error)=>{
      setContent(
        {
          question:"",
          isLoading:false,
          submitting:false,
          error:{
            flag:true,
            message:"That question does not exist"
          }
        }
      )
    });
  }
  else{
    setContent(
      {
        question:"",
        isLoading:false,
        submitting:false,
        error:{
          flag:true,
          message:"Check your internet connection"
        }
      }
    )
  }
  
}

 const check_lvl =(snapshot)=>{
  if(snapshot.level==1){
      get_ques(lvl1.current,1);
  }else{
      get_ques(snapshot.prevhash,snapshot.level);//field prevhash to be created in each user document
  }
}


  function playgame(){
    console.log('dsdsd');
    firebase.firestore().collection('users').doc(playerState.uid).get().then((snapshot) => {
        check_lvl(snapshot.data());
    }).catch((error)=>{setContent(
      {
        question:"",
        isLoading:false,
        submitting:false,
        error:{
          flag:true,
          message:"Check your internet connection"
        }
      }
    )
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

useEffect(()=>{

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
      if(content.isLoading){
        if(content.submitting==false){
          playgame();
        }
        else{
          check_ans(content.encryptedans);
          }
      }

      if(content.success){

        t.to('.modal-background',{visibility:"visible",duration:0})
        .to('.modal',{transform:"scale(1)",duration:0.2});
      }
//playgame();
    
})

    return (
        <div style={{width:"100vw",height:"100%",position:"fixed",zIndex:"-10",overflowY:"scroll",overflowX:"hidden"}}>
{
      content.isLoading
      ?<FancyLoader></FancyLoader>
      :(
        <div className="game-main" onClick={e=>ClosePage(e)} style={{width:"100vw",height:"100vh",paddingTop:"10vh",paddingLeft:"4vw",paddingRight:"4vw",backgroundColor:"black",display:"flex",flexDirection:"column",overflowY:"auto"}}>

<h4 className="game-header">Challenge</h4>
      <h3 style={{color:"red"}}>{content.error.flag?content.error.message:""}</h3>
      {
        !content.isLoading
        ?<h3 style={{color:"white"}}>{content.question?content.question:""}</h3>
        :""
      }
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
    
          </div>
        
      )
}
{content.success?
<div className="modal-background">
  <div className="modal">
  <button onClick={()=>closeModal()}>X</button>
  <span style={{margin:"auto auto",fontSize:"2em",display:"block"}}>Your answer is correct!</span>
  </div>
</div>:""}
    </div>
    )
}