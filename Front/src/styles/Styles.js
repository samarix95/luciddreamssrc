import { makeStyles } from '@material-ui/core/styles';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import WarningIcon from '@material-ui/icons/Warning';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';

import amber from '@material-ui/core/colors/amber';
import green from '@material-ui/core/colors/green';

import MapImg from '../img/map.svg';
import SunImg from '../img/sun.svg';
import MoonImg from '../img/moon.svg';
import AstronautImg from '../img/aeronaut.svg';

export const colors = {
    dark: {
        primary: "#ffffff",
        secondary: "#f50057",
        error: "#cc0000"
    },
    light: {
        primary: "#000000",
        secondary: "#f50057",
        error: "#cc0000"
    }
};

export const params = {
    amountStars: 25,
    amountClouds: 5,
    size: {
        min: 1,
        max: 5,
        giant: 9
    },
    duration: {
        min: 5,
        max: 25,
    }
};

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
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
    },
    equalHeight: {
        height: 0,
        paddingBottom: "100%",
    },
    SearchPaper: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: "100%",
    },
    centerText: {
        top: 0,
        left: "50%",
        width: "90%",
        transform: "translate(-50%)",
        marginTop: 10,
        marginBottom: 10
    },
    hiddenOverflowX: {
        overflowX: "hidden"
    },
    autoOverflowX: {
        overflowX: "auto"
    },
    scrollOverflowX: {
        overflowX: "scroll"
    },
    centerTextAlign: {
        textAlign: "center",
    },
    inlineBlock: {
        display: "inline-block",
    },
    topLeftCorner: {
        position: "absolute",
        bottom: "100%",
        left: "100%",
        transform: "translate(-50%, 50%)",
    },
    notDisplay: {
        display: "none",
    },
    formControl: {
        position: 'absolute',
        left: '50%',
        top: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'auto',
        height: 'auto',
    },
    SwipeableViews: {
        position: 'relative',
        height: '90%',
        '& .react-swipeable-view-container': {
            height: '100% !Important',
        },
    },
    media: {
        height: 140,
    },
    iconCenter: {
        display: "block",
        margin: "auto"
    },
    dreamCardDiv: {
        position: "relative",
        width: "100%",
        height: "auto",
        marginTop: '15px',
        marginBottom: '15px',
    },
    divDreamsNotFoundImg: {
        background: "url('https://static.thenounproject.com/png/603669-200.png') no-repeat center",
    },
    divDreamsNotFound: {
        position: "relative",
        left: "50%",
        transform: "translateX(-50%)",
        width: 200,
        height: 100,
        textAlign: "center",
    },
    contentPaper: {
        backgroundColor: theme.palette.text.main,
        padding: 10,
    },
    pickerGridContainer: {
        position: "relative",
        width: "85%",
        left: "50%",
        transform: "translateX(-50%)",
        marginBottom: "5px",
    },
    div85width: {
        position: "relative",
        width: "85%",
        top: "65%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    },
    ratingGridContainer: {
        position: "relative",
        width: "100%",
        top: "65%",
        left: "50%",
        transform: "translate(-50%, -50%)",
    },
    pickers: {
        position: "relative",
        width: "90%",
        left: "50%",
        transform: "translateX(-50%)",
    },
    avatarRoot: {
        textAlign: 'center',
        width: '100%',
    },
    verySmallAvatar: {
        margin: theme.spacing(1),
        width: theme.spacing(3),
        height: theme.spacing(3),
        display: 'inline-flex !Important',
    },
    smallAvatar: {
        margin: theme.spacing(0.5),
        width: theme.spacing(5),
        height: theme.spacing(5),
        display: 'inline-flex !Important',
    },
    smallChip: {
        margin: theme.spacing(0.5),
    },
    mainGridDreamsBodyItemContainer: {
        paddingTop: '16px',
        position: 'absolute',
        boxSizing: 'border-box',
        maxHeight: '90%',
        overflow: 'auto',
    },
    mainGridDreamsBodyItemContainerPaper: {
        height: '100%',
        opacity: 0.9,
    },
    hiddenOverflow: {
        overflow: 'hidden'
    },
    visibleOverflowY: {
        overflowY: "visible"
    },
    mainGridDreamsContainer: {
        height: '100%',
        position: 'relative',
        width: '90%',
        left: '50%',
        transform: 'translateX(-50%)',
    },
    card: {
        maxWidth: '100%',
        height: '100%',
    },
    expand: {
        transform: "rotate(0deg)",
        marginLeft: "auto",
        transition: theme.transitions.create("transform", {
            duration: theme.transitions.duration.shortest
        })
    },
    expandOpen: {
        transform: "rotate(180deg)"
    },
    textField: {
        width: '100%',
    },
    margin: {
        margin: theme.spacing(1),
    },
    root: {
        flexGrow: 1,
        position: 'relative',
        width: '100%',
        height: window.innerHeight - 0.1,
        overflow: 'hidden',
    },
    mainPage: {
        top: 0,
        left: 0,
        position: 'absolute',
        transition: 'all 0.3s linear',
        width: '100%',
        height: '100%',
    },
    aboutPage: {
        position: 'absolute',
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
        zIndex: -5,
    },
    AppDivLight: {
        position: 'absolute',
        background: 'radial-gradient(ellipse at center, rgba(207, 225, 237, 1) 20%, rgba(127, 170, 202, 1) 100%)',
        transition: 'opacity 0.5s linear',
        margin: 0,
        opacity: 0,
        width: '100%',
        height: '100%',
        zIndex: -5,
    },
    AppStarsDiv: {
        transition: 'opacity 0.5s linear',
        opacity: 0,
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: -4,
    },
    AppCloudsDiv: {
        transition: 'opacity 0.5s linear',
        opacity: 0,
        position: 'absolute',
        width: '100%',
        height: '100%',
        overflow: 'hidden',
        zIndex: -3,
    },
    AppStar: {
        borderRadius: '100%',
        position: 'absolute',
        background: 'radial-gradient(ellipse at center, rgba(177, 198, 219, 1) 2%, rgba(5, 63, 118, 1) 100%)',
        filter: 'blur(1px)',
        animation: '$shine infinite linear',
        zIndex: -1,
    },
    image: {
        position: 'relative',
        left: '50%',
        top: '25%',
        transform: 'translate(-50%, -25%)',
        width: '35vw !important',
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
        width: '25vw !important',
        height: '25vw',
        borderRadius: '50%',
        transform: "translate(-50%, -50%)",
    },
    AstronautDiv: {
        position: 'absolute',
        borderRadius: '50%',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
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
        width: '25vw !important',
        height: '25vw',
        borderRadius: '10%',
        transform: "translate(-50%, -50%)",
    },
    MapDiv: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        overflow: 'hidden',
    },
    MapImg: {
        backgroundSize: 'contain',
        backgroundPosition: "center",
        background: 'url(' + MapImg + ')',
        backgroundRepeat: 'no-repeat',
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        transition: 'filter 0.5s linear',
    },
    borderRadius50: {
        borderRadius: "50%",
    },
    padding10: {
        padding: "10px",
    },
    mainGridContainer: {
        height: '100% !Important',
        position: 'relative',
    },
    mainGridBodyItem: {
        maxWidth: '100% !Important',
        position: 'relative',
    },
    menuButtonContainer: {
        height: '100% !Important',
        position: 'relative',
    },
    menuDivButton: {
        maxWidth: '100% !Important',
        position: 'relative',
    },
    centerButton: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
    },
    inlineBlock: {
        display: "inline-block"
    },
    horizontalCenter: {
        left: "50%",
        transform: "translate(-50%)"
    },
    verticalCenter: {
        top: "50%",
        transform: "translateY(-50%)"
    },
    relativePosition: {
        position: 'relative',
    },
    absolutePosition: {
        position: 'absolute !Important',
    },
    absoluteZero: {
        top: 0,
        bottom: 0,
        left: 0,
        right: 0
    },
    menuButton: {
        width: "55vw",
        maxWidth: "250px",
        maxHeight: "75%",
    },
    actionButton: {
        width: "40vw",
        maxWidth: "250px",
    },
    poppupButton: {
        minWidth: '90%',
        maxWidth: '90%',
        left: "50%",
        transform: "translateX(-50%)",
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
    fullMinWidthAbs: {
        minWidth: '100% !Important',
        position: 'absolute'
    },
    heightWidth80: {
        width: "80px !Important",
        height: "80px !Important",
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
    },
    noWrap: {
        flexWrap: 'nowrap',
    },
    chip: {
        margin: 1
    },
    fullWidth: {
        width: "100% !Important",
    },
    fullHeight: {
        height: "100% !Important",
    },
    minHeight20px: {
        minHeight: "20px",
    },
    minHeight100px: {
        minHeight: "100px",
    },
    minWidth200px: {
        minWidth: "200px",
    },
    minWidth100px: {
        minWidth: "100px",
    },
    minWidth50px: {
        minWidth: "50px",
    },
    mediumAvatar: {
        width: "120px !Important",
        height: "120px !Important",
    },
    topLeft: {
        top: 0,
        left: 0,
    },
    topRight: {
        top: 0,
        right: 0,
    },
    paper: {
        height: '91%',
        marginTop: theme.spacing(3),
        marginLeft: theme.spacing(2),
        marginRight: theme.spacing(2),
        opacity: 0.9,
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
    "@keyframes comet": {
        "100%": {
            transform: 'rotate(180deg)',
        },
    },
    '@keyframes movebird': {
        '0%': {
            left: '-10%',
            top: (Math.random() * (95 - 85) + 85).toFixed(0) + '%',
        },
        '25%': {
            left: '20%',
            top: (Math.random() * (95 - 85) + 85).toFixed(0) + '%',
        },
        '50%': {
            left: '50%',
            top: (Math.random() * (95 - 85) + 85).toFixed(0) + '%',
        },
        '75%': {
            left: '70%',
            top: (Math.random() * (95 - 85) + 85).toFixed(0) + '%',
        },
        '100%': {
            left: '110%',
            top: (Math.random() * (95 - 85) + 85).toFixed(0) + '%',
        },
    },
    "@keyframes moveclouds": {
        '100%': {
            left: '-50%',
        },
    },
    height12: {
        height: 100 / 12 * 12 + "%",
    },
    height11: {
        height: 100 / 12 * 11 - 0.1 + "%",
    },
    height10: {
        height: 100 / 12 * 10 - 0.1 + "%",
    },
    height9: {
        height: 100 / 12 * 9 - 0.1 + "%",
    },
    height8: {
        height: 100 / 12 * 8 - 0.1 + "%",
    },
    height7: {
        height: 100 / 12 * 7 - 0.1 + "%",
    },
    height6: {
        height: 100 / 12 * 6 - 0.1 + "%",
    },
    height5: {
        height: 100 / 12 * 5 - 0.1 + "% !Important",
    },
    height4: {
        height: 100 / 12 * 4 - 0.1 + "%",
    },
    height3: {
        height: 100 / 12 * 3 - 0.1 + "%",
    },
    height2: {
        height: 100 / 12 * 2 - 0.1 + "%",
    },
    height1: {
        height: 100 / 12 * 1 - 0.1 + "%",
    },
    height0: {
        height: 100 / 12 * 0 + "%",
    },
    width12: {
        width: 100 / 12 * 12 + "%",
    },
    width11: {
        width: 100 / 12 * 11 - 0.1 + "%",
    },
    width10: {
        width: 100 / 12 * 10 - 0.1 + "%",
    },
    width9: {
        width: 100 / 12 * 9 - 0.1 + "%",
    },
    width8: {
        width: 100 / 12 * 8 - 0.1 + "%",
    },
    width7: {
        width: 100 / 12 * 7 - 0.1 + "%",
    },
    width6: {
        width: 100 / 12 * 6 - 0.1 + "%",
    },
    width5: {
        width: 100 / 12 * 5 - 0.1 + "%",
    },
    width4: {
        width: 100 / 12 * 4 - 0.1 + "%",
    },
    width3: {
        width: 100 / 12 * 3 - 0.1 + "%",
    },
    width2: {
        width: 100 / 12 * 2 - 0.1 + "%",
    },
    width1: {
        width: 100 / 12 * 1 - 0.1 + "%",
    },
    width0: {
        width: 100 / 12 * 0 + "%",
    },
}));

export const snackStyles = makeStyles(theme => ({
    success: {
        backgroundColor: green[600] + '!Important',
    },
    error: {
        backgroundColor: theme.palette.error.dark + '!Important',
    },
    warning: {
        backgroundColor: amber[700] + '!Important',
    },
    icon: {
        fontSize: 20 + '!Important',
    },
    iconVariant: {
        opacity: 0.9 + '!Important',
    },
    message: {
        display: 'flex' + ' !Important',
        alignItems: 'center' + ' !Important',
    },
    margin: {
        margin: theme.spacing(1),
    },
}));