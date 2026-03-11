const toggleSwitch = document.querySelector('#color_mode');
const body = document.body;

/* default theme */
const DEFAULT_THEME = 'dark-mode';

/* load saved theme */
const currentTheme = localStorage.getItem('theme') || DEFAULT_THEME;

if(currentTheme === 'dark-mode'){
    body.classList.add('dark-mode');
    toggleSwitch.checked = true;
}else{
    body.classList.add('light-mode');
    toggleSwitch.checked = false;
}

/* toggle theme */
toggleSwitch.addEventListener('change', function(){

    if(this.checked){
        body.classList.remove('light-mode');
        body.classList.add('dark-mode');
        localStorage.setItem('theme','dark-mode');
    }else{
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        localStorage.setItem('theme','light-mode');
    }

});