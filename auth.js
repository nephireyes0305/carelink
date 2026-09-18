const CARELINK_API = "https://script.google.com/macros/s/AKfycbztrKqI5Xme2iRUF5L5Hfno3jHEWQvqFRlC3_WF7YgEL_7ieZyTmAWR5s0aTWw5cavs/exec";

async function carelinkAuthPost(payload){
  const r=await fetch(CARELINK_API,{method:"POST",headers:{"Content-Type":"text/plain;charset=utf-8"},body:JSON.stringify(payload)});
  return await r.json();
}

document.addEventListener("DOMContentLoaded",()=>{
  const form=document.getElementById("loginForm");
  if(!form) return;

  form.addEventListener("submit",async e=>{
    e.preventDefault();
    e.stopImmediatePropagation();

    const username=document.getElementById("username").value.trim();
    const password=document.getElementById("password").value;
    const btn=form.querySelector('button[type="submit"]');
    const old=btn.textContent;
    btn.disabled=true; btn.textContent="Logging in...";

    try{
      const result=await carelinkAuthPost({action:"login",username,password});
      if(!result.ok) throw new Error(result.error || "Login failed.");
      sessionStorage.setItem("carelinkSessionToken",result.token);
      sessionStorage.setItem("carelinkMember",JSON.stringify(result.member||{}));
      window.location.href="members.html";
    }catch(err){
      alert(err.message);
    }finally{
      btn.disabled=false; btn.textContent=old;
    }
  },true);
});
