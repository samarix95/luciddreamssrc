import React, { useEffect } from "react";
import { connect } from 'react-redux';
import clsx from 'clsx';

import SnackbarContent from "@material-ui/core/SnackbarContent";
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from "@material-ui/core/IconButton";
import Typography from '@material-ui/core/Typography';
import Snackbar from "@material-ui/core/Snackbar";
import Button from '@material-ui/core/Button';
import Slide from "@material-ui/core/Slide";
import Grid from '@material-ui/core/Grid';

import { setCloud, setStar, setCurrLang, setThemeMode } from '../actions/Actions';
import { useStyles, params, randomBetween, variantIcon } from '../styles/Styles';
import { instance } from './Config';
import { CheckTimeOut } from '../utils/CheckLoginTimeOut';

import { MuiThemeProvider, createMuiTheme, makeStyles } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import { amber, green } from '@material-ui/core/colors';

import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";

import RuDict from '../dictionary/ru';
import EnDict from '../dictionary/en';

function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}

const useStyles1 = makeStyles(theme => ({
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}));

function SnackbarContentWrapper(props) {
    const classes = useStyles1();
    const { className, message, onClose, variant } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby="message-snackbar"
            message={
                <span id="message-snackbar" className={classes.message}>
                    <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    <Typography className={classes.mainGridContainer}
                        align='center'
                        variant='body2'>
                        {message}
                    </Typography>
                </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
        />
    );
}

function MainPage(props) {
    const classes = useStyles();
    const { lang, clouds, stars, themeMode, auth } = props.store;
    const muiTheme = createMuiTheme(themeMode);
    const { setCurrLangAction, setCloudsAction, setStarsAction, setThemeModeAction } = props;
    const [prevLanguage, setPrevLanguage] = React.useState(undefined);
    const [openLangSnakbar, setOpenLangSnakbar] = React.useState(false);
    const [openMessageSnackbar, setOpenMessageSnackbar] = React.useState(false);
    const [langSnakbarMessage, setLangSnakbarMessage] = React.useState('');
    const [transition, setTransition] = React.useState(undefined);
    const [infoSnackbar, setInfoSnackbar] = React.useState({
        variant: '',
        message: '',
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
        if (language !== lang.currLang.current) {
            if (language === 'Ru') {
                setPrevLanguage(lang.currLang.current);
                setCurrLangAction(RuDict);
                setLangSnakbarMessage(language);
                setTransition(() => TransitionDown);
                setOpenLangSnakbar(true);
            }
            if (lang.currLang.current !== 'En') {
                setPrevLanguage(lang.currLang.current);
                setCurrLangAction(EnDict);
                setLangSnakbarMessage(language);
                setTransition(() => TransitionDown);
                setOpenLangSnakbar(true);
            }
        }
    }

    const handleCloseLangSnakbar = () => {
        switch (prevLanguage) {
            case 'En':
                setCurrLangAction(EnDict);
                break;
            case 'Ru':
                setCurrLangAction(RuDict);
                break;
            default:
                setCurrLangAction(EnDict);
                break;
        }
        setOpenLangSnakbar(false);
    };

    const handleSaveLangSnakbar = () => {
        let newLang;
        switch (lang.currLang.current) {
            case 'En':
                newLang = 0;
                break;
            case 'Ru':
                newLang = 1;
                break;
            default:
                newLang = 0;
                break;
        }
        let userid = props.store.auth.user.id;
        let usernickname = props.store.auth.user.nickname;
        let newUserData = {
            language: newLang,
            id: userid,
            nickname: usernickname,
        };

        //Проверка на таймаут
        let check = CheckTimeOut();

        if (check) {
            instance
                .post('/actions/users/updateuserdata', newUserData)
                .then(res => {
                    let newInfoSnackbar = infoSnackbar;
                    newInfoSnackbar = { ...newInfoSnackbar, variant: "success" };
                    newInfoSnackbar = { ...newInfoSnackbar, message: lang.currLang.texts.success };
                    setInfoSnackbar(newInfoSnackbar);
                    setOpenMessageSnackbar(true);
                    setOpenLangSnakbar(false);
                })
                .catch(err => {
                    handleCloseLangSnakbar();
                });

        }
        else {
            let newInfoSnackbar = infoSnackbar;
            newInfoSnackbar = { ...newInfoSnackbar, variant: "error" };
            newInfoSnackbar = { ...newInfoSnackbar, message: lang.currLang.errors.NotLogin };
            setInfoSnackbar(newInfoSnackbar);
            setOpenMessageSnackbar(true);
            handleCloseLangSnakbar();
        }
    };

    const handleCloseMessageSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenMessageSnackbar(false);
    };

    useEffect(() => {
        for (let i = 0; i < params.amountStars; i++) {
            let size = Math.round(Math.random() * 10) === 0 ? params.size.giant : randomBetween(params.size.min, params.size.max);
            setStarsAction(
                <div className={classes.AppStar}
                    key={i + 'star'}
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
                    key={i + 'cloud'}
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

        auth.user.language === 0 ? setCurrLangAction(EnDict) : setCurrLangAction(RuDict);

        if (auth.user.times_mode === 0) {
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

    }, [classes, setCloudsAction, setStarsAction, setThemeModeAction, setCurrLangAction, auth.user.language, auth.user.times_mode]);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />

            <Snackbar
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                key={"top, center"}
                open={openLangSnakbar}
                TransitionComponent={transition}
            >
                <SnackbarContent
                    aria-describedby="lang-snackbar"
                    message={
                        <Typography className={classes.mainGridContainer}
                            align='center'
                            id="lang-snackbar"
                            variant='body2'>
                            {lang.currLang.texts.changleLanguage + langSnakbarMessage + ' ?'}
                        </Typography>
                    }
                    action={[
                        <div key={"lang-snackbar-buttons"}>
                            <IconButton
                                key="save"
                                aria-label="save"
                                color="inherit"
                                onClick={handleSaveLangSnakbar}
                            >
                                <SaveIcon />
                            </IconButton>
                            <IconButton
                                key="close"
                                aria-label="close"
                                color="inherit"
                                onClick={handleCloseLangSnakbar}
                            >
                                <CloseIcon />
                            </IconButton>
                        </div>
                    ]}
                />
            </Snackbar>

            <div className={classes.AppDivDark}>
                <div className={classes.AppDivLight} style={themeMode.palette.type === "light" ? { opacity: 1, } : { opacity: 0, }} />
                {themeMode.palette.type === "light"
                    ?
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

                <div className={classes.mainPage}>

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
                            </Grid>
                        </Grid>

                        <Grid item xs={1} className={classes.mainGridHeadItem} >
                            <Grid className={classes.mainGridContainer}
                                container
                                direction="column"
                                justify="center"
                                alignItems="stretch" >
                                <Grid item xs={12} className={classes.menuButtonContainerItem} >
                                    <Typography className={classes.mainGridContainer}
                                        align='center'
                                        variant='h6'>
                                        {lang.currLang.texts.hello + props.store.auth.user.nickname}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>

                        <Grid item xs={6} className={classes.mainGridBodyItem} >

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

                                    </Grid>

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

            </div>

            <Snackbar
                open={openMessageSnackbar}
                onClose={handleCloseMessageSnackbar}
                autoHideDuration={3000}>
                <SnackbarContentWrapper
                    className={classes.margin}
                    onClose={handleCloseMessageSnackbar}
                    variant={infoSnackbar.variant}
                    message={infoSnackbar.message}
                />
            </Snackbar>

        </MuiThemeProvider>
    );
};

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
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage);