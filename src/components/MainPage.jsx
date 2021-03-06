import React from "react";
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import DialogContentText from "@material-ui/core/DialogContentText";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from "@material-ui/core/IconButton";
import Typography from '@material-ui/core/Typography';
import Snackbar from "@material-ui/core/Snackbar";
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Slide from "@material-ui/core/Slide";
import Grid from '@material-ui/core/Grid';

import Skeleton from '@material-ui/lab/Skeleton';

import { SET_THEME_MODE, SET_SNACKBAR_MODE } from "../actions/types";

import { setUserState, setCurrLang, setTheme, setSnackbar } from '../actions/Actions';
import { useStyles, colors } from '../styles/Styles.js';
import { fetchUpdateUserDataAction, resetUpdateUserDataErrorAction, resetUpdateUserDataAction } from '../Config';
import { getUserData, getUserDataPending } from '../reducers/userDataReducer';
import { getUpdateUserData, getUpdateUserDataError } from '../reducers/updateUserDataReducer.js';
import { CheckTimeOut, getToken, removeToken } from '../utils/CheckLoginTimeOut.js';

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
    const { lang, themeMode, history, setCurrLangAction, setTheme, setSnackbar,
        userData, userDataPending,
        updateUserData, updateUserDataError, fetchUpdateUserData, resetUpdateUserDataError, resetUpdateUserData } = props;
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [prevLanguage, setPrevLanguage] = React.useState(undefined);
    const [openLangSnakbar, setOpenLangSnakbar] = React.useState(false);
    const [langSnakbarMessage, setLangSnakbarMessage] = React.useState('');
    const [transition, setTransition] = React.useState(undefined);
    const [openDialog, setOpenDialog] = React.useState(false);

    const closeDialogAction = () => {
        setOpenDialog(false);
    };

    const openDialogAction = () => {
        setOpenDialog(true);
    };

    const switchMode = () => {
        setTheme({
            type: SET_THEME_MODE,
            palette: {
                type: themeMode.palette.type === "light" ? "dark" : "light",
                primary: { main: themeMode.palette.type === "light" ? colors.dark.primary : colors.light.primary },
                secondary: { main: themeMode.palette.type === "light" ? colors.dark.secondary : colors.light.secondary }
            }
        });
    };

    const onAstronautClick = () => {
        CheckTimeOut() ? history.push("/aeronauts") : history.push("/signin");
    };

    const onMapClick = () => {
        CheckTimeOut() ? history.push("/dreammap") : history.push("/signin");
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
        fetchUpdateUserData(userData.id, { language: newLang }, getToken());
    };

    const logOut = () => {
        removeToken();
        history.push("/signin");
    };

    if (Object.keys(updateUserData).length > 0 && updateUserData.result === 'success') {
        setSnackbar({
            type: SET_SNACKBAR_MODE,
            snackbar: {
                open: true,
                variant: 'success',
                message: lang.currLang.texts.success
            }
        });
        if (openLangSnakbar) setOpenLangSnakbar(false);
        resetUpdateUserData();
    }

    if (updateUserDataError) {
        setSnackbar({
            type: SET_SNACKBAR_MODE,
            snackbar: {
                open: true,
                variant: 'error',
                message: updateUserDataError
            }
        });
        if (openLangSnakbar) handleCloseLangSnakbar();
        resetUpdateUserDataError();
    }

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Snackbar key={"top, center"}
                open={openLangSnakbar}
                anchorOrigin={{ vertical: "top", horizontal: "center" }}
                TransitionComponent={transition}
            >
                <SnackbarContent aria-describedby="lang-snackbar"
                    message={
                        <Typography id="lang-snackbar"
                            className={`${classes.height12}`}
                            align='center'
                            variant='body2'
                        >
                            {lang.currLang.texts.changleLanguage + langSnakbarMessage + ' ?'}
                        </Typography>
                    }
                    action={[
                        <div key={"lang-snackbar-buttons"}>
                            <IconButton key="save"
                                aria-label="save"
                                color="inherit"
                                onClick={handleSaveLangSnakbar}
                            >
                                <SaveIcon />
                            </IconButton>
                            <IconButton key="close"
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
            <Dialog open={openDialog}
                onClose={closeDialogAction}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {lang.currLang.buttons.signOut}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        {lang.currLang.texts.LogOutQuestion}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary"
                        onClick={closeDialogAction}
                    >
                        {lang.currLang.texts.cancel}
                    </Button>
                    <Button color="primary"
                        onClick={logOut}
                    >
                        {lang.currLang.buttons.signOut}
                    </Button>
                </DialogActions>
            </Dialog>
            <div className={classes.root}>
                <Grid container
                    className={`${classes.height12}`}
                    direction="column"
                    justify="center"
                    alignItems="stretch"
                >
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height4}`}>
                        <Grid container
                            className={classes.mainGridContainer}
                            direction="row"
                            justify="space-around"
                            alignItems="stretch"
                        >
                            <Grid item xs={4} >
                                <ButtonBase className={classes.AstronautButton} onClick={onAstronautClick} >
                                    <div className={classes.AstronautDiv}>
                                        <div className={classes.AstronautImg} style={themeMode.palette.type === "light" ? { filter: 'invert(0)', } : { filter: 'invert(1)', }} />
                                    </div>
                                </ButtonBase>
                            </Grid>
                            <Grid item xs={4} >
                                <Grid className={`${classes.height8} ${classes.relativePosition}`}>
                                    <ButtonBase className={classes.image} onClick={switchMode}>
                                        <div className={classes.SkyDiv}>
                                            <div className={classes.SunSrc} style={themeMode.palette.type === "dark" ? { transform: 'translateY(36vw)' } : { transform: 'translateY(0)' }} />
                                            <div className={classes.MoonSrc} style={themeMode.palette.type === "dark" ? { filter: 'invert(1)', transform: 'translateY(0)' } : { filter: 'invert(0)', transform: 'translateY(-36vw)' }} />
                                        </div>
                                    </ButtonBase>
                                </Grid>
                                <Grid className={`${classes.height4} ${classes.relativePosition} ${classes.horizontalCenter} ${classes.inlineBlock}`} >
                                    <img className={`${classes.fullHeight}`} src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
                                    {userDataPending
                                        ? <Skeleton variant="circle" className={`${classes.absolutePosition} ${classes.fullHeight} ${classes.fullWidth} ${classes.absoluteZero}`} />
                                        : <Avatar className={`${classes.absolutePosition} ${classes.fullHeight} ${classes.fullWidth} ${classes.absoluteZero}`} src={userData.avatar_url} />
                                    }

                                </Grid>
                            </Grid>
                            <Grid item xs={4} >
                                <ButtonBase className={classes.MapButton} onClick={onMapClick}>
                                    <div className={classes.MapDiv}>
                                        <div className={classes.MapImg} style={themeMode.palette.type === "light" ? { filter: 'invert(0)', } : { filter: 'invert(1)', }} />
                                    </div>
                                </ButtonBase>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height6}`}>
                        <Grid container
                            className={`${classes.menuButtonContainer} ${classes.height12}`}
                            direction="column"
                            justify="center"
                            alignItems="stretch"
                        >
                            <Grid item className={`${classes.menuDivButton} ${classes.height2}`} align="center">
                                <Button variant="outlined"
                                    color="primary"
                                    className={`${classes.menuButton} ${classes.centerButton}`}
                                    onClick={() => { CheckTimeOut() ? history.push("/dreams") : history.push("/signin") }}
                                >
                                    {lang.currLang.buttons.dreamJoirnal}
                                </Button>
                            </Grid>
                            <Grid item className={`${classes.menuDivButton} ${classes.height2}`} align="center">
                                <Button variant="outlined"
                                    color="primary"
                                    className={`${classes.menuButton} ${classes.centerButton}`}
                                    onClick={() => { CheckTimeOut() ? history.push("/addregulardream") : history.push("/signin") }}
                                >
                                    {lang.currLang.buttons.addDream}
                                </Button>
                            </Grid>
                            <Grid item className={`${classes.menuDivButton} ${classes.height2}`} align="center">
                                <Button variant="outlined"
                                    color="primary"
                                    className={`${classes.menuButton} ${classes.centerButton}`}
                                    onClick={() => { CheckTimeOut() ? history.push("/addcdream") : history.push("/signin") }}
                                >
                                    {lang.currLang.buttons.addCDream}
                                </Button>
                            </Grid>
                            <Grid item className={`${classes.menuDivButton} ${classes.height2}`} align="center">
                                <Button variant="outlined"
                                    color="primary"
                                    className={`${classes.menuButton} ${classes.centerButton}`}
                                    onClick={() => { CheckTimeOut() ? history.push("/technics") : history.push("/signin") }}
                                >
                                    {lang.currLang.buttons.techniques}
                                </Button>
                            </Grid>
                            <Grid item className={`${classes.menuDivButton} ${classes.height2}`} align="center">
                                <Button variant="outlined"
                                    color="primary"
                                    className={`${classes.menuButton} ${classes.centerButton}`}
                                >
                                    {lang.currLang.buttons.adventures}
                                </Button>
                            </Grid>
                            <Grid item className={`${classes.menuDivButton} ${classes.height2}`} align="center">
                                <Button variant="outlined"
                                    color="primary"
                                    className={`${classes.menuButton} ${classes.centerButton}`}
                                    onClick={openDialogAction}
                                >
                                    {lang.currLang.buttons.signOut}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height1}`} />
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height1}`}>
                        <Grid container
                            className={`${classes.menuButtonContainer}`}
                            direction="row"
                            justify="center"
                            alignItems="center"
                            spacing={1}
                        >
                            <Grid item>
                                <Button onClick={() => { changeLanguage('Ru') }} size="small" >
                                    RU
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button onClick={() => { changeLanguage('En') }} size="small" >
                                    EN
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </MuiThemeProvider >
    );
};

MainPage.propTypes = {
    setCurrLangAction: PropTypes.func.isRequired,
    setTheme: PropTypes.func.isRequired,
    setSnackbar: PropTypes.func.isRequired,
    setUserState: PropTypes.func.isRequired,
    lang: PropTypes.object.isRequired,
    themeMode: PropTypes.object.isRequired,
}

const mapStateToProps = store => {
    return {
        lang: store.lang,
        themeMode: store.themeMode,
        userDataPending: getUserDataPending(store),
        userData: getUserData(store),
        updateUserData: getUpdateUserData(store),
        updateUserDataError: getUpdateUserDataError(store)
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setCurrLangAction: currLangState => dispatch(setCurrLang(currLangState)),
    setTheme: palette => dispatch(setTheme(palette)),
    setSnackbar: snackbar => dispatch(setSnackbar(snackbar)),
    setUserState: state => dispatch(setUserState(state)),
    fetchUpdateUserData: fetchUpdateUserDataAction,
    resetUpdateUserDataError: resetUpdateUserDataErrorAction,
    resetUpdateUserData: resetUpdateUserDataAction
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MainPage);