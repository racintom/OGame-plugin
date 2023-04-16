const my_awesome_script = document.createElement('script');
my_awesome_script.setAttribute("src", chrome.runtime.getURL('main.js'));
my_awesome_script.setAttribute('type','module');
document.body.appendChild(my_awesome_script)
document.head.insertAdjacentHTML('beforeend', `<link type="text/css" rel="stylesheet" href="${ chrome.runtime.getURL('ext-stylesheet.css') }">`);
