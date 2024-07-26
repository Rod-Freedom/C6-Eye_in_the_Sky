import Logo from "./logo.js";

const rootEl = document.querySelector(':root');
const logo = document.querySelector('#logo');
const hoursDiv = document.querySelector('#hours-div');
const logoCenterValues = logo.getBoundingClientRect();
const logoCenter = new Logo(logoCenterValues);

const logoHover = (event) => {
    const e = event.target;
    const type = event.type;

    if (type === 'mouseenter') {
        e.classList.add('logo-on');
        e.classList.remove('logo-off');
    }
    if (type === 'mouseleave') {
        e.classList.add('logo-off');
        e.classList.remove('logo-on');
    }
};

const hoursDivHover = (event) => {
    const e = event.target;
    const type = event.type;

    if (type === 'mouseenter') {
        e.classList.add('overflow-x-auto');
        e.classList.remove('overflow-x-hidden');
        e.style.paddingBottom = '0';
    }
    if (type === 'mouseleave') {
        e.style.paddingBottom = '2px';
        e.classList.add('overflow-x-hidden');
        e.classList.remove('overflow-x-auto');
    }
};

const eyeWatcher = (event) => {
    const mouseAdjX = event.clientX - logoCenter.x;
    const mouseAdjY = event.clientY - logoCenter.y;
    const eyeHypot = 2.5;

    if ((mouseAdjX ** 2) > (eyeHypot ** 2) || (mouseAdjY ** 2) > (eyeHypot ** 2)) {
        const mouseHypot = ((mouseAdjX ** 2) + (mouseAdjY ** 2)) ** 0.5
        const eyeX = (mouseAdjX / mouseHypot) * 2.5;
        const eyeY = (mouseAdjY / mouseHypot) * 2.5;
    
        rootEl.style.setProperty('--logo-x-offset', `${eyeX}px`);
        rootEl.style.setProperty('--logo-y-offset', `${eyeY}px`);    
    } else {
        rootEl.style.setProperty('--logo-x-offset', `${mouseAdjX}px`);
        rootEl.style.setProperty('--logo-y-offset', `${mouseAdjY}px`);
    }
};



const startStyles = () => {
    logo.addEventListener('mouseenter', logoHover);
    logo.addEventListener('mouseleave', logoHover);
    hoursDiv.addEventListener('mouseenter', hoursDivHover);
    hoursDiv.addEventListener('mouseleave', hoursDivHover);

    document.addEventListener('mousemove', eyeWatcher)
};

window.onload = startStyles();