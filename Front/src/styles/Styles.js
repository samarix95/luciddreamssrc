
import { makeStyles } from '@material-ui/core/styles';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';

import MapImg from '../img/map.png';
import SunImg from '../img/sun.png';
import MoonImg from '../img/moon.png';
import AstronautImg from '../img/astronaut.png';

export const params = {
    amountStars: 50,
    amountClouds: 10,
    size: {
        min: 1,
        max: 5,
        giant: 9
    },
    duration: {
        min: 5,
        max: 25,
    }
}

export const variantIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

export function randomBetween(a, b) {
    return (a + (Math.random() * (b - a)));
}

export const useStyles = makeStyles(theme => ({
    textField: {
        width: '100%',
    },
    margin: {
        margin: theme.spacing(1),
    },
    root: {
        flexGrow: 1,
        position: 'fixed',
        width: '100%',
        height: '100%',
    },
    mainPage: {
        top: 0,
        left: 0,
        position: ' absolute',
        transition: 'all 0.3s linear',
        width: '100%',
        height: '100%',
    },
    aboutPage: {
        position: ' absolute',
        transition: 'all 0.3s linear',
        top: '100%',
        width: '100%',
        height: '100%',
    },
    AppDivDark: {
        position: 'fixed',
        background: 'radial-gradient(ellipse at center, rgba(8, 25, 42, 1) 20%, rgba(1, 4, 6, 1) 100%)',
        opacity: 1,
        margin: 0,
        width: '100%',
        height: '100%',
        zIndex: -3,
    },
    AppDivLight: {
        position: 'absolute',
        background: 'radial-gradient(ellipse at center, rgba(207, 225, 237, 1) 20%, rgba(127, 170, 202, 1) 100%)',
        transition: 'opacity 0.5s linear',
        margin: 0,
        opacity: 0,
        width: '100%',
        height: '100%',
        zIndex: -3,
    },
    AppStarsDiv: {
        transition: 'opacity 0.5s linear',
        opacity: 0,
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: -2,
    },
    AppCloudsDiv: {
        transition: 'opacity 0.5s linear',
        opacity: 0,
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: -2,
    },
    AppStar: {
        borderRadius: '100%',
        position: 'absolute',
        background: 'radial-gradient(ellipse at center, rgba(177, 198, 219, 1) 2%, rgba(5, 63, 118, 1) 100%)',
        filter: 'blur(1px)',
        animation: '$shine infinite alternate',
        zIndex: -1,
    },
    AppCloud: {
        position: 'absolute',
        backgroundRepeat: 'no-repeat',
        backgroundImage: 'url(https://www.turbotobias.dk/wp-content/uploads/2019/03/White-cloud-type3.svg)',
        animation: '$moveclouds infinite linear',
        zIndex: -1,
    },
    image: {
        position: 'relative',
        left: '50%',
        top: '25%',
        transform: 'translate(-50%, -25%)',
        width: '35vw !important', // Overrides inline-style
        height: '35vw',
        borderRadius: '50%',
    },
    SkyDiv: {
        position: 'absolute',
        borderRadius: '50%',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    MoonSrc: {
        backgroundSize: 'cover',
        background: 'url(' + MoonImg + ')',
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transition: 'all 0.3s linear',
    },
    SunSrc: {
        backgroundSize: 'cover',
        background: 'url(' + SunImg + ')',
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transition: 'all 0.3s linear',
    },
    AstronautButton: {
        position: 'relative',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '25vw !important', // Overrides inline-style
        height: '25vw',
        borderRadius: '50%',
    },
    AstronautDiv: {
        position: 'absolute',
        borderRadius: '50%',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        animation: '$swinging 30s infinite linear',
    },
    AstronautImg: {
        backgroundSize: 'cover',
        background: 'url(' + AstronautImg + ')',
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transition: 'filter 0.5s linear',
    },
    MapButton: {
        position: 'relative',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: '25vw !important', // Overrides inline-style
        height: '25vw',
        borderRadius: '10%',
    },
    MapDiv: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        animation: '$swinging 30s infinite linear',
    },
    MapImg: {
        backgroundSize: 'cover',
        background: 'url(' + MapImg + ')',
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transition: 'filter 0.5s linear',
    },
    mainGridContainer: {
        height: '100%',
    },
    mainGridHeadItem: {
        maxWidth: '100% !Important',
    },
    mainGridBodyItem: {
        maxWidth: '100% !Important',
    },
    menuButtonContainerItem: {
        maxWidth: '100% !Important',
    },
    menuButtonContainer: {
        height: '100% !Important',
    },
    menuButtonGrid: {
    },
    menuDivButton: {
        maxWidth: '100% !Important',
        padding: '10px',
    },
    menuButton: {
        minWidth: '55vw',
        maxWidth: '55vw',
    },
    actionButton: {
        minWidth: '40vw',
        maxWidth: '40vw',
    },
    mainGridFooterItem: {
        maxWidth: '100% !Important',
    },
    menuButtonContainerFooterLanguageButtons: {
    },
    aboutGridContainer: {
        width: '100%',
        height: '100%',
        margin: 0,
    },
    fullMinWidth: {
        minWidth: '100% !Important',
        position: 'relative'
    },
    inputDiv: {
        minWidth: '85% !Important',
        maxWidth: '85% !Important',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 1,
    },
    inputScrollableDiv: {
        minWidth: '85% !Important',
        maxWidth: '85% !Important',
        height: '100%',
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        opacity: 1,
        //overflowY: 'auto',
    },
    chips: {
        display: "flex",
        flexWrap: "wrap"
    },
    chip: {
        margin: 1
    },
    aboutGridItem: {
        width: '100%',
    },
    mainPaperGridBodyItem: {
        maxWidth: '100% !Important',
    },
    paper: {
        height: '90%',
        margin: theme.spacing(3, 2),
        opacity: 0.9,
    },
    minMargin: {
        margin: theme.spacing(0.5),
    },
    VKLoginDiv: {
        position: 'absolute',
        width: '15vw',
        height: '15vw',
    },
    VKLoginButton: {
        background: 'url(https://dressirovka70.ru/wp-content/uploads/2019/10/1200px-VK.com-logo.svg1_-1024x1024.png)',
        boxShadow: '0px 3px 1px -2px rgba(0,0,0,0.2), 0px 2px 2px 0px rgba(0,0,0,0.14), 0px 1px 5px 0px rgba(0,0,0,0.12)',
        backgroundSize: 'cover',
        borderRadius: '25%',
        width: '100%',
        height: '100%',
    },
    "@keyframes shine": {
        "0%": {
            transform: 'scale(1)',
            opacity: '1',
        },
        "20%": {
            transform: 'scale(.9)',
            opacity: '.8',
        },
        "40%": {
            transform: 'scale(1)',
            opacity: '.9',
        },
        "60%": {
            transform: 'scale(.2)',
            opacity: '.1',
        },
        "80%": {
            transform: 'scale(.5)',
            opacity: '.5',
        },
        "100%": {
            transform: 'scale(.9)',
            opacity: '.9',
        },
    },
    "@keyframes moveclouds": {
        '100%': {
            left: '-100%',
        },
    },
    "@keyframes swinging": {
        '0%': {
            transform: 'rotate(0)',
        },
        '10%': {
            transform: 'rotate(12deg)',
        },
        '20%': {
            transform: 'rotate(-10deg)',
        },
        '30%': {
            transform: 'rotate(9deg)',
        },
        '40%': {
            transform: 'rotate(-8deg)',
        },
        '50%': {
            transform: 'rotate(7deg)',
        },
        '60%': {
            transform: 'rotate(-6deg)',
        },
        '70%': {
            transform: 'rotate(5deg)',
        },
        '80%': {
            transform: 'rotate(-4deg)',
        },
        '90%': {
            transform: 'rotate(3deg)',
        },
        '100%': {
            transform: 'rotate(0)',
        },
    }
}));