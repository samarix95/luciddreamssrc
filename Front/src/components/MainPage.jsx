import React, { useState, useEffect, useContext } from "react";

import Sign from './Sign';

import ButtonBase from '@material-ui/core/ButtonBase';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import _ from 'lodash';

import { connect } from 'react-redux';
import { setCloud, setStar, setCurrLang, setThemeMode, setLogin } from '../actions/Actions';

import UserProvider from '../contexts/UserProvider';

import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import MapImg from '../img/map.png';
import SunImg from '../img/sun.png';
import MoonImg from '../img/moon.png';
import AstronautImg from '../img/astronaut.png';

import RuDict from '../dictionary/ru';
import EnDict from '../dictionary/en';
import { data } from "../data/index";

const useStyles = makeStyles(theme => ({
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
    aboutGridItem: {
        width: '100%',
    },
    aboutPaper: {

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

const params = {
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

function randomBetween(a, b) {
    return (a + (Math.random() * (b - a)));
}

const mapStateToProps = store => {
    return {
        store,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrLangAction: currLangState => dispatch(setCurrLang(currLangState)),
        setCloudsAction: cloudState => dispatch(setCloud(cloudState)),
        setStarsAction: starState => dispatch(setStar(starState)),
        setThemeModeAction: paletteState => dispatch(setThemeMode(paletteState)),
        setLoginAction: loginState => dispatch(setLogin(loginState)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage);

function MainPage(props) {
    const classes = useStyles();
    const userData = useContext(UserProvider.context);
    const loginType = !_.isEmpty(userData) ? _.find(data, d => d.name === userData.provider) : {};
    //console.log(typeof(loginType));
    //setLoginAction
    //console.log(userData);

    const {
        lang,
        //user,
        login,
        clouds,
        stars,
        themeMode, } = props.store;

    const muiTheme = createMuiTheme(themeMode);

    const {
        setCurrLangAction,
        setCloudsAction,
        setStarsAction,
        setThemeModeAction,
        setLoginAction, } = props;

    const [page, setPage] = useState({
        mainPage: true,
        aboutPage: false,
    });

    const switchMode = () => {
        let newPaletteType = themeMode.palette.type === "light" ? "dark" : "light";
        let primaryColor = themeMode.palette.type === "light" ? "#f9a825" : "#3f51b5";
        let secondaryColor = themeMode.palette.type === "light" ? "#f50057" : "#f50057";
        setThemeModeAction({
            type: newPaletteType,
            primary: { main: primaryColor },
            secondary: { main: secondaryColor },
        });
    }
    const onAstronautClick = () => {
        alert('Тут должны перейти на страницу космонафта');
    };
    const onMapClick = () => {
        alert('Тут должны перейти на страницу карты');
    };
    const changeLanguage = (language) => {
        if (language === 'Ru') {
            setCurrLangAction(RuDict);
        }
        else {
            setCurrLangAction(EnDict);
        }
    }
    const onMenuClick = (action) => {
        let newPages = page;
        switch (action) {
            case 'openAboutPage':
                newPages = { ...newPages, aboutPage: true };
                newPages = { ...newPages, mainPage: false };
                setPage(newPages);
                break;
            case 'closeAboutPage':
                newPages = { ...newPages, aboutPage: false };
                newPages = { ...newPages, mainPage: true };
                setPage(newPages);
                break;
            default:
                break;
        }
    }
    useEffect(() => {
        for (let i = 0; i < params.amountStars; i++) {
            let size = Math.round(Math.random() * 10) === 0 ? params.size.giant : randomBetween(params.size.min, params.size.max);
            setStarsAction(
                <div className={classes.AppStar}
                    key={i}
                    style={{
                        left: randomBetween(0, 100) + "%",
                        top: randomBetween(0, 100) + "%",
                        width: size + "px",
                        height: size + "px",
                        boxShadow: "0 0 " + size + "px " + size / 2 + "px #043668",
                        animationDuration: randomBetween(params.duration.min, params.duration.max) + "s",
                    }}
                />
            );
        }
        for (let i = 0; i < params.amountClouds; i++) {
            let left = Math.round(Math.random() * 50 + 90);
            let top = Math.round(Math.random() * 100 / 100 * 90);
            let scale = Math.random() * 1.5 - 0.5;
            let opacity = Math.random() * 90 / 100;
            let speed = Math.random() * 30 + 15;
            setCloudsAction(
                <div className={classes.AppCloud}
                    key={i}
                    style={{
                        left: left + '%',
                        top: top + '%',
                        width: '400px',
                        height: '100px',
                        transform: 'scale(' + scale + ')',
                        opacity: opacity,
                        animationDuration: speed + 's',
                    }} />
            );
        }

        if (new Date().getHours() > 15) {
            setThemeModeAction({
                type: "dark",
                primary: { main: "#f9a825" },
                secondary: { main: "#f50057" },
            });
        }
        else {
            setThemeModeAction({
                type: "light",
                primary: { main: "#3f51b5" },
                secondary: { main: "#f50057" },
            });
        }
    }, [classes, setCloudsAction, setStarsAction, setThemeModeAction]);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <div className={classes.AppDivDark}>
                <div className={classes.AppDivLight} style={themeMode.palette.type === "light" ? { opacity: 1, } : { opacity: 0, }} />
                {themeMode.palette.type === "light" ?
                    <div className={classes.AppCloudsDiv} style={themeMode.palette.type === "light" ? { opacity: 1, } : { opacity: 0, }} >
                        {clouds.clouds}
                    </div>
                    :
                    <div className={classes.AppStarsDiv} style={themeMode.palette.type === "light" ? { opacity: 0, } : { opacity: 1, }} >
                        {stars.stars}
                    </div>
                }
            </div>

            <div className={classes.root}>

                <div className={classes.mainPage} style={page.mainPage === true ? { transform: 'translateY(0%)' } : { transform: 'translateY(-100%)' }} >

                    <Grid className={classes.mainGridContainer}
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch" >

                        <Grid item xs={4} className={classes.mainGridHeadItem} >
                            <Grid container className={classes.mainGridContainer}
                                direction="row"
                                justify="space-around"
                                alignItems="stretch" >
                                {login.isLogin &&
                                    <Grid item xs={4} >
                                        <ButtonBase className={classes.AstronautButton}
                                            type='button'
                                            focusRipple
                                            onClick={onAstronautClick}>
                                            <div className={classes.AstronautDiv}>
                                                <div className={classes.AstronautImg} style={themeMode.palette.type === "light" ? { filter: 'invert(0)', } : { filter: 'invert(1)', }} />
                                            </div>
                                        </ButtonBase>
                                    </Grid>
                                }
                                <Grid item xs={4} >
                                    <ButtonBase className={classes.image}
                                        type='button'
                                        focusRipple
                                        onClick={switchMode}>
                                        <div className={classes.SkyDiv}>
                                            <div className={classes.SunSrc} style={themeMode.palette.type === "dark" ? { transform: 'translateY(36vw)' } : { transform: 'translateY(0)' }} />
                                            <div className={classes.MoonSrc} style={themeMode.palette.type === "dark" ? { transform: 'translateY(0)' } : { transform: 'translateY(-36vw)' }} />
                                        </div>
                                    </ButtonBase>
                                </Grid>
                                {login.isLogin &&
                                    <Grid item xs={4} >
                                        <ButtonBase className={classes.MapButton}
                                            type='button'
                                            focusRipple
                                            onClick={onMapClick}>
                                            <div className={classes.MapDiv}>
                                                <div className={classes.MapImg} style={themeMode.palette.type === "light" ? { filter: 'invert(0)', } : { filter: 'invert(1)', }} />
                                            </div>
                                        </ButtonBase>
                                    </Grid>
                                }
                            </Grid>
                        </Grid>

                        <Grid item xs={7} className={classes.mainGridBodyItem} >

                            <Grid className={classes.mainGridContainer}
                                container
                                direction="column"
                                justify="center"
                                alignItems="stretch" >

                                <Grid className={classes.menuButtonContainer}
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="stretch" >


                                    {!login.isLogin && <Sign classes={classes} onMenuClick={onMenuClick} />}

                                    {login.isLogin &&
                                        <Grid item xs={12} className={classes.menuButtonContainerItem} >

                                            <Grid item xs={2} className={classes.menuDivButton} align="center">
                                                <Button variant="contained" color="primary" className={classes.menuButton}>
                                                    {lang.currLang.buttons.dreamJoirnal}
                                                </Button>
                                            </Grid>

                                            <Grid item xs={2} className={classes.menuDivButton} align="center">
                                                <Button variant="contained" color="primary" className={classes.menuButton}>
                                                    {lang.currLang.buttons.addDream}
                                                </Button>
                                            </Grid>

                                            <Grid item xs={2} className={classes.menuDivButton} align="center">
                                                <Button variant="contained" color="primary" className={classes.menuButton}>
                                                    {lang.currLang.buttons.addCDream}
                                                </Button>
                                            </Grid>

                                            <Grid item xs={2} className={classes.menuDivButton} align="center">
                                                <Button variant="contained" color="primary" className={classes.menuButton}>
                                                    {lang.currLang.buttons.techniques}
                                                </Button>
                                            </Grid>

                                            <Grid item xs={2} className={classes.menuDivButton} align="center">
                                                <Button variant="contained" color="primary" className={classes.menuButton}>
                                                    {lang.currLang.buttons.adventures}
                                                </Button>
                                            </Grid>

                                            <Grid item xs={2} className={classes.menuDivButton} align="center">
                                                <Button variant="contained"
                                                    color="primary"
                                                    className={classes.menuButton}
                                                    onClick={() => (onMenuClick('openAboutPage'))} >
                                                    {lang.currLang.buttons.about}
                                                </Button>
                                            </Grid>

                                        </Grid>
                                    }

                                </Grid>

                            </Grid>

                        </Grid>

                        <Grid item xs={1} className={classes.mainGridFooterItem} >

                            <Grid className={classes.menuButtonContainerFooterLanguageButtons}
                                container
                                direction="row"
                                justify="center"
                                alignItems="center" >

                                <Grid item>
                                    <Button onClick={() => { changeLanguage('Ru') }}>
                                        RU
                                        </Button>
                                </Grid>

                                <Grid item>
                                    <Button onClick={() => { changeLanguage('En') }}>
                                        EN
                                        </Button>
                                </Grid>

                            </Grid>

                        </Grid>

                    </Grid>

                </div>

                <div className={classes.aboutPage} style={page.aboutPage === true ? { transform: 'translateY(-100%)' } : { transform: 'translateY(0%)' }} >

                    <Grid className={classes.aboutGridContainer}
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                        spacing={5} >

                        <Grid item
                            className={classes.aboutGridItem}
                            align='center'>

                            <Paper className={classes.aboutPaper}>
                                <Typography>
                                    {lang.currLang.texts.about}
                                </Typography>
                            </Paper>

                        </Grid>

                        <Grid item
                            className={classes.aboutGridItem}
                            align='center'>

                            <Button variant="contained"
                                color="primary"
                                className={classes.menuButton}
                                onClick={() => (onMenuClick('closeAboutPage'))} >
                                {lang.currLang.buttons.close}
                            </Button>

                        </Grid>

                    </Grid>

                </div>

            </div>
        </MuiThemeProvider>
    );
};