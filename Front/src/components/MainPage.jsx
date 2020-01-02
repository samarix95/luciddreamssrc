import React from "react";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import SnackbarContent from "@material-ui/core/SnackbarContent";
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from "@material-ui/core/IconButton";
import Typography from '@material-ui/core/Typography';
import Snackbar from "@material-ui/core/Snackbar";
import Button from '@material-ui/core/Button';
import Slide from "@material-ui/core/Slide";
import Grid from '@material-ui/core/Grid';

import { SET_THEME_MODE, SET_SNACKBAR_MODE } from "../actions/types";

import { setCurrLang, setTheme, setSnackbar } from '../actions/Actions';
import { useStyles } from '../styles/Styles';
import { instance } from './Config';
import { CheckTimeOut } from '../utils/CheckLoginTimeOut';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';

import CloseIcon from "@material-ui/icons/Close";
import SaveIcon from "@material-ui/icons/Save";

import RuDict from '../dictionary/ru';
import EnDict from '../dictionary/en';

function TransitionDown(props) {
    return <Slide {...props} direction="down" />;
}

function MainPage(props) {
    const classes = useStyles();
    const { lang, themeMode, auth, history, setCurrLangAction, setTheme, setSnackbar } = props;
    const muiTheme = createMuiTheme(themeMode);
    const [prevLanguage, setPrevLanguage] = React.useState(undefined);
    const [openLangSnakbar, setOpenLangSnakbar] = React.useState(false);
    const [langSnakbarMessage, setLangSnakbarMessage] = React.useState('');
    const [transition, setTransition] = React.useState(undefined);

    const switchMode = () => {
        let newPaletteType = themeMode.palette.type === "light" ? "dark" : "light";
        let primaryColor = themeMode.palette.type === "light" ? "#f9a825" : "#3f51b5";
        let secondaryColor = themeMode.palette.type === "light" ? "#f50057" : "#f50057";
        setTheme({
            type: SET_THEME_MODE,
            palette: {
                type: newPaletteType,
                primary: { main: primaryColor },
                secondary: { main: secondaryColor },
            }
        });
    };

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
    };

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
        let userid = auth.user.id;
        let usernickname = auth.user.nickname;
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
                    setSnackbar({
                        type: SET_SNACKBAR_MODE,
                        snackbar: {
                            open: true,
                            variant: 'success',
                            message: lang.currLang.texts.success,
                        },
                    });
                    setOpenLangSnakbar(false);
                })
                .catch(err => {
                    handleCloseLangSnakbar();
                });

        }
        else {
            setSnackbar({
                type: SET_SNACKBAR_MODE,
                snackbar: {
                    open: true,
                    variant: 'error',
                    message: lang.currLang.errors.NotLogin,
                },
            });
            handleCloseLangSnakbar();
        }
    };

    React.useEffect(() => {
        let id = {
            id: auth.user.id,
        };
        instance
            .post('/actions/users/getuserdata', id)
            .then(res => {
                res.data.language === 0 ? setCurrLangAction(EnDict) : setCurrLangAction(RuDict);
            })
            .catch(err => {
                auth.user.language === 0 ? setCurrLangAction(EnDict) : setCurrLangAction(RuDict);
            });
        // if (auth.user.times_mode === 0) {
        //     setTheme({
        //         type: SET_THEME_MODE,
        //         palette: {
        //             type: "dark",
        //             primary: { main: "#f9a825" },
        //             secondary: { main: "#f50057" },
        //         }
        //     });
        // }
        // else {
        //     setTheme({
        //         type: SET_THEME_MODE,
        //         palette: {
        //             type: "light",
        //             primary: { main: "#3f51b5" },
        //             secondary: { main: "#f50057" },
        //         }
        //     });
        // }
    }, [classes, setTheme, setCurrLangAction, auth.user.language, auth.user.times_mode, auth.user.id]);

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

            <div className={classes.root}>
                <div className={classes.mainPage}>
                    <Grid className={classes.mainGridContainer}
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <Grid item xs={4} className={classes.mainGridHeadItem} >
                            <Grid container className={classes.mainGridContainer}
                                direction="row"
                                justify="space-around"
                                alignItems="stretch"
                            >
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
                                        {lang.currLang.texts.hello + auth.user.nickname}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item xs={6} className={classes.mainGridBodyItem} >
                            <Grid className={classes.mainGridContainer}
                                container
                                direction="column"
                                justify="center"
                                alignItems="stretch"
                            >
                                <Grid className={classes.menuButtonContainer}
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="stretch"
                                >
                                    <Grid item xs={12} className={classes.menuButtonContainerItem} >
                                        <Grid item xs={2} className={classes.menuDivButton} align="center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.menuButton}
                                                onClick={() => {
                                                    let check = CheckTimeOut();
                                                    if (check) history.push("/dreams");
                                                    else history.push("/");
                                                }}
                                            >
                                                {lang.currLang.buttons.dreamJoirnal}
                                            </Button>
                                        </Grid>
                                        <Grid item xs={2} className={classes.menuDivButton} align="center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.menuButton}
                                                onClick={() => {
                                                    let check = CheckTimeOut();
                                                    if (check) history.push("/addregulardream");
                                                    else history.push("/");
                                                }}
                                            >
                                                {lang.currLang.buttons.addDream}
                                            </Button>
                                        </Grid>
                                        <Grid item xs={2} className={classes.menuDivButton} align="center">
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                className={classes.menuButton}
                                                onClick={() => {
                                                    let check = CheckTimeOut();
                                                    if (check) history.push("/addcdream");
                                                    else history.push("/");
                                                }}
                                            >
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
        </MuiThemeProvider>
    );
};

MainPage.propTypes = {
    setCurrLangAction: PropTypes.func.isRequired,
    setTheme: PropTypes.func.isRequired,
    setSnackbar: PropTypes.func.isRequired,
    lang: PropTypes.object.isRequired,
    themeMode: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = store => {
    return {
        lang: store.lang,
        themeMode: store.themeMode,
        auth: store.auth,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrLangAction: currLangState => dispatch(setCurrLang(currLangState)),
        setTheme: palette => dispatch(setTheme(palette)),
        setSnackbar: snackbar => dispatch(setSnackbar(snackbar)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage);