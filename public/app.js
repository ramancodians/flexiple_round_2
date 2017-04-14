$(document).ready(()=>{
   
    $('#open-signup').click(()=>{
       $('.login-wrap.sign-up').slideDown(); 
       $('.login-wrap.signin').slideUp(); 
    });
    
     $('#cancel-signup').click(()=>{
       $('.login-wrap.sign-up').slideUp(); 
       $('.login-wrap.signin').slideDown(); 
    });
    
}); 