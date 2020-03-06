import React from 'react';
import { connect } from 'react-redux';
import jwt_decode from "jwt-decode";
import PropTypes from 'prop-types';

import InputAdornment from '@material-ui/core/InputAdornment';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Container from "@material-ui/core/Container";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';

import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';

import { SET_CURRENT_USER, SET_SNACKBAR_MODE } from "../actions/types";
import { setCurrLang, setUserState, setSnackbar } from '../actions/Actions';
import { useStyles } from '../styles/Styles.js';
import setAuthToken from "../utils/setAuthToken";
import { instance } from '../Config';

import RuDict from '../dictionary/ru';
import EnDict from '../dictionary/en';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

function Sign(props) {
    const classes = useStyles();
    const { history, themeMode, lang, setUserState, setSnackbar, setCurrLang } = props;
    const muiTheme = createMuiTheme(themeMode);
    const [loginData, setLoginData] = React.useState({
        email: '',
        password: ''
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [openLogin, setOpenLogin] = React.useState(false);
    const [page, setPage] = React.useState({
        mainPage: true,
        aboutPage: false
    });

    const handleMouseDownPassword = event => {
        event.preventDefault();
    };

    const changeAuthLogin = (e) => {
        let newLoginData = loginData;
        newLoginData = { ...newLoginData, email: e.target.value };
        setLoginData(newLoginData);
    };

    const changeAuthPassword = (e) => {
        let newLoginData = loginData;
        newLoginData = { ...newLoginData, password: e.target.value };
        setLoginData(newLoginData);
    };

    const singIn = () => {
        instance.post("/actions/users/login", loginData)
            .then(res => {
                const { token } = res.data;
                localStorage.setItem("jwtToken", token);
                setAuthToken(token);
                const decoded = jwt_decode(token);
                setUserState({
                    type: SET_CURRENT_USER,
                    payload: decoded
                });
                setIsLoading(false);
                history.push("/luciddreams");
            })
            .catch(err => {
                console.log(err);
                let errorMessage = '';
                if (err.response.data.email === 'UserNotExist') {
                    errorMessage = lang.currLang.errors.UserNotExist;
                }
                if (err.response.data.email === 'EmailIsNotValid') {
                    errorMessage = lang.currLang.errors.EmailIsNotValid;
                }
                if (err.response.data.passwordincorrect === 'IncorrectPassword') {
                    errorMessage = lang.currLang.errors.IncorrectPassword;
                }
                setSnackbar({
                    type: SET_SNACKBAR_MODE,
                    snackbar: {
                        open: true,
                        variant: 'error',
                        message: errorMessage
                    },
                });
                setIsLoading(false);
            });
    };

    const click = (action) => {
        let newPages = page;
        switch (action) {
            case 'openLogin':
                setOpenLogin(true);
                break;
            case 'closeLogin':
                setOpenLogin(false);
                setShowPassword(false);
                break;
            case 'signIn':
                setIsLoading(true);
                singIn();
                break;
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
    };

    const changeLanguage = (language) => {
        language === 'Ru' ? setCurrLang(RuDict) : setCurrLang(EnDict);
    };

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Dialog open={openLogin}
                TransitionComponent={Transition}
                aria-labelledby="alert-dialog-slide-title"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {lang.currLang.buttons.signIn}
                </DialogTitle>
                <DialogContent>
                    <Grid className={`${classes.menuDivButton} ${classes.margin}`} align="center">
                        <TextField
                            className={classes.textField}
                            id="email-field"
                            type="email"
                            label="Email"
                            onBlur={(e) => { changeAuthLogin(e) }} />
                    </Grid>
                    <Grid className={`${classes.menuDivButton} ${classes.margin}`} align="center">
                        <TextField
                            id="password-field"
                            className={classes.textField}
                            type={showPassword ? 'text' : 'password'}
                            label={lang.currLang.texts.password}
                            onBlur={(e) => { changeAuthPassword(e) }}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton
                                            tabIndex="-1"
                                            edge="end"
                                            aria-label="toggle password visibility"
                                            onClick={() => { showPassword ? setShowPassword(false) : setShowPassword(true) }}
                                            onMouseDown={handleMouseDownPassword} >
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }} />
                    </Grid>
                </DialogContent>
                <DialogActions>
                    {!isLoading
                        ? <React.Fragment>
                            <Button onClick={() => { click('closeLogin') }}
                                color="secondary"
                                disabled={isLoading}>
                                {lang.currLang.buttons.cancel}
                            </Button>
                            <Button onClick={() => { click('signIn') }}
                                color="primary"
                                disabled={isLoading}>
                                {lang.currLang.buttons.signIn}
                            </Button>
                        </React.Fragment>
                        : <LinearProgress className={`${classes.margin} ${classes.textField}`} />
                    }
                </DialogActions>
            </Dialog>
            <div className={classes.root}>
                <div className={classes.mainPage} style={page.mainPage === true ? { transform: 'translateY(0%)' } : { transform: 'translateY(-100%)' }}>
                    <Grid container
                        className={`${classes.height12}`}
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <Grid item className={`${classes.mainGridBodyItem} ${classes.height11}`}>
                            <Grid container
                                className={`${classes.height12}`}
                                direction="column"
                                justify="center"
                                alignItems="stretch"
                            >
                                <Grid item className={`${classes.height3}`} />
                                <Grid item className={`${classes.height6} ${classes.mainGridBodyItem}`}>
                                    <Grid item className={`${classes.height2}`} />
                                    <Grid item className={`${classes.menuDivButton} ${classes.height2}`}>
                                        <Button variant="contained" color="primary"
                                            className={`${classes.menuButton} ${classes.centerButton}`}
                                            onClick={() => { click('openLogin') }}>
                                            {lang.currLang.buttons.signIn}
                                        </Button>
                                    </Grid>
                                    <Grid item className={`${classes.menuDivButton} ${classes.height2}`}>
                                        <Button variant="contained" color="primary"
                                            className={`${classes.menuButton} ${classes.centerButton}`}
                                            onClick={() => { history.push('/signup') }}>
                                            {lang.currLang.buttons.signUp}
                                        </Button>
                                    </Grid>
                                    <Grid item className={`${classes.height2}`} />
                                    <Grid item className={`${classes.menuDivButton} ${classes.height2}`}>
                                        <Button variant="contained" color="primary"
                                            className={`${classes.menuButton} ${classes.centerButton}`}
                                            onClick={() => (click('openAboutPage'))} >
                                            {lang.currLang.buttons.about}
                                        </Button>
                                    </Grid>
                                    <Grid item className={`${classes.height2}`} />
                                </Grid>
                                <Grid item className={`${classes.height3}`} />
                            </Grid>
                        </Grid>
                        <Grid item className={`${classes.mainGridBodyItem} ${classes.height1}`}>
                            <Grid container
                                className={`${classes.menuButtonContainer}`}
                                direction="row"
                                justify="center"
                                alignItems="center"
                            >
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
                </div >
                <div className={classes.aboutPage} style={page.aboutPage === true ? { transform: 'translateY(-100%)' } : { transform: 'translateY(0%)' }}>
                    <Grid container
                        className={`${classes.height12}`}
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <Grid item className={`${classes.mainGridBodyItem} ${classes.height11}`} align='center'>
                            <Container className={classes.mainGridDreamsBodyItemContainer}>
                                <Paper className={classes.mainGridDreamsBodyItemContainerPaper}>
                                    <Typography>
                                        {lang.currLang.texts.about}
                                    </Typography>
                                </Paper>
                            </Container>
                        </Grid>
                        <Grid item className={`${classes.mainGridBodyItem} ${classes.height1}`} align='center'>
                            <Button className={classes.menuButton} variant="contained" color="primary" onClick={() => (click('closeAboutPage'))}>
                                {lang.currLang.buttons.Back}
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div>
        </MuiThemeProvider >
    )
}

Sign.propTypes = {
    setCurrLang: PropTypes.func.isRequired,
    setUserState: PropTypes.func.isRequired,
    setSnackbar: PropTypes.func.isRequired,
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired
}

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrLang: currLangState => dispatch(setCurrLang(currLangState)),
        setUserState: State => dispatch(setUserState(State)),
        setSnackbar: snackbar => dispatch(setSnackbar(snackbar))
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sign);