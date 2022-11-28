((window.location.pathname == '/logout') 
  || (window.location.pathname == '/faillogin')) 
  && setTimeout(() => {
      location.href = '/login';
    }, 2000);

window.location.pathname == '/failsignup' 
  && setTimeout(() => {
    location.href = '/register';
  }, 2000);