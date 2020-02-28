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

import { GET_ERRORS, SET_CURRENT_USER, SET_SNACKBAR_MODE } from "../actions/types";
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
        password: '',
    });
    const [registData, setRegistData] = React.useState({
        email: '',
        nickname: '',
        password: '',
        password2: '',
    });
    const [regFieldErrors, setRegFieldErrors] = React.useState({
        emailErr: false,
        emailErrText: '',
        nicknameErr: false,
        nicknameErrText: '',
        passwordErr: false,
        passwordErrText: '',
        password2Err: false,
        password2ErrText: '',
    });
    const [isLoading, setIsLoading] = React.useState(false);
    const [showPassword, setShowPassword] = React.useState(false);
    const [openLogin, setOpenLogin] = React.useState(false);
    const [openRegist, setOpenRegist] = React.useState(false);
    const [page, setPage] = React.useState({
        mainPage: true,
        aboutPage: false,
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

    const changeRegistLogin = (e) => {
        let newRegFieldErrors = regFieldErrors;
        newRegFieldErrors = { ...newRegFieldErrors, emailErr: false };
        newRegFieldErrors = { ...newRegFieldErrors, emailErrText: '' };
        setRegFieldErrors(newRegFieldErrors);

        let newRegistData = registData;
        newRegistData = { ...newRegistData, email: e.target.value };
        setRegistData(newRegistData);
    };

    const changeRegistNickname = (e) => {
        let newRegFieldErrors = regFieldErrors;
        newRegFieldErrors = { ...newRegFieldErrors, nicknameErr: false };
        newRegFieldErrors = { ...newRegFieldErrors, nicknameErrText: '' };
        setRegFieldErrors(newRegFieldErrors);

        let newRegistData = registData;
        newRegistData = { ...newRegistData, nickname: e.target.value };
        setRegistData(newRegistData);
    };

    const changeRegistPassword = (e) => {
        let newRegFieldErrors = regFieldErrors;
        newRegFieldErrors = { ...newRegFieldErrors, passwordErr: false };
        newRegFieldErrors = { ...newRegFieldErrors, passwordErrText: '' };
        newRegFieldErrors = { ...newRegFieldErrors, password2Err: false };
        newRegFieldErrors = { ...newRegFieldErrors, password2ErrText: '' };
        setRegFieldErrors(newRegFieldErrors);

        let newRegistData = registData;
        newRegistData = { ...newRegistData, password: e.target.value };
        setRegistData(newRegistData);
    };

    const changeRegistPassword2 = (e) => {
        let newRegFieldErrors = regFieldErrors;
        newRegFieldErrors = { ...newRegFieldErrors, passwordErr: false };
        newRegFieldErrors = { ...newRegFieldErrors, passwordErrText: '' };
        newRegFieldErrors = { ...newRegFieldErrors, password2Err: false };
        newRegFieldErrors = { ...newRegFieldErrors, password2ErrText: '' };
        setRegFieldErrors(newRegFieldErrors);
        let newRegistData = registData;
        newRegistData = { ...newRegistData, password2: e.target.value };
        setRegistData(newRegistData);
    };

    const singIn = () => {
        instance
            .post("/actions/users/login", loginData)
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
                        message: errorMessage,
                    },
                });
                setIsLoading(false);
            });
    };

    const singUp = () => {
        let isErr = false;
        let newRegFieldErrors = regFieldErrors;
        if (registData.email.length === 0) {
            newRegFieldErrors = { ...newRegFieldErrors, emailErr: true };
            newRegFieldErrors = { ...newRegFieldErrors, emailErrText: lang.currLang.errors.emailLenght };
            isErr = true;
        }
        if (registData.nickname.length === 0) {
            newRegFieldErrors = { ...newRegFieldErrors, nicknameErr: true };
            newRegFieldErrors = { ...newRegFieldErrors, nicknameErrText: lang.currLang.errors.nicknameLenght };
            isErr = true;
        }
        if (registData.password.length === 0) {
            newRegFieldErrors = { ...newRegFieldErrors, passwordErr: true };
            newRegFieldErrors = { ...newRegFieldErrors, passwordErrText: lang.currLang.errors.passwordLenght };
            isErr = true;
        }
        if (registData.password2.length === 0) {
            newRegFieldErrors = { ...newRegFieldErrors, password2Err: true };
            newRegFieldErrors = { ...newRegFieldErrors, password2ErrText: lang.currLang.errors.password2Lenght };
            isErr = true;
        }
        if (registData.password !== registData.password2) {
            newRegFieldErrors = { ...newRegFieldErrors, passwordErr: true };
            newRegFieldErrors = { ...newRegFieldErrors, passwordErrText: lang.currLang.errors.passwordsCompare };
            newRegFieldErrors = { ...newRegFieldErrors, password2Err: true };
            newRegFieldErrors = { ...newRegFieldErrors, password2ErrText: lang.currLang.errors.passwordsCompare };
            isErr = true;
        }
        if (isErr) {
            setRegFieldErrors(newRegFieldErrors);
            setIsLoading(false);
        }
        else {
            instance
                .post('/actions/users/register', registData)
                .then(res => {
                    setSnackbar({
                        type: SET_SNACKBAR_MODE,
                        snackbar: {
                            open: true,
                            variant: 'success',
                            message: lang.currLang.texts.sucessRegistration,
                        },
                    });
                    let newRegistData = registData;
                    newRegistData = { ...newRegistData, email: '' };
                    newRegistData = { ...newRegistData, nickname: '' };
                    newRegistData = { ...newRegistData, password: '' };
                    newRegistData = { ...newRegistData, password2: '' };
                    setRegistData(newRegistData);
                    click('closeRegist');
                    click('openLogin');
                    setIsLoading(false);
                })
                .catch(err => {
                    let errorMessage = '';
                    setUserState({
                        type: GET_ERRORS,
                        payload: err.response.data
                    });
                    if (err.response.data.email === 'EmailIsBusy') {
                        errorMessage = lang.currLang.errors.EmailIsBusy;
                    }
                    if (err.response.data.password === 'PasswordLenght5Symbols') {
                        errorMessage = lang.currLang.errors.PasswordLenght5Symbols;
                    }
                    setSnackbar({
                        type: SET_SNACKBAR_MODE,
                        snackbar: {
                            open: true,
                            variant: 'error',
                            message: errorMessage,
                        },
                    });
                    setIsLoading(false);
                });
        }
    };

    const click = (action) => {
        let newPages = page;
        switch (action) {
            case 'openLogin':
                setOpenLogin(true);
                break;
            case 'openRegist':
                setOpenRegist(true);
                break;
            case 'closeLogin':
                setOpenLogin(false);
                setShowPassword(false);
                break;
            case 'closeRegist':
                setOpenRegist(false);
                setShowPassword(false);
                break;
            case 'signIn':
                setIsLoading(true);
                singIn();
                break;
            case 'signUp':
                setIsLoading(true);
                singUp();
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
            <Dialog open={openRegist}
                TransitionComponent={Transition}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <DialogTitle id="alert-dialog-slide-title">
                    {lang.currLang.buttons.signUp}
                </DialogTitle>
                <DialogContent>
                    <Grid className={`${classes.menuDivButton} ${classes.margin}`} align="center">
                        <TextField id="reg-email-field"
                            error={regFieldErrors.emailErr}
                            helperText={regFieldErrors.emailErrText}
                            className={classes.textField}
                            autoComplete="off"
                            type="email"
                            label="Email"
                            onBlur={(e) => { changeRegistLogin(e) }} />
                    </Grid>
                    <Grid className={`${classes.menuDivButton} ${classes.margin}`} align="center">
                        <TextField id="reg-nickname-field"
                            error={regFieldErrors.nicknameErr}
                            helperText={regFieldErrors.nicknameErrText}
                            className={classes.textField}
                            autoComplete="off"
                            type="text"
                            label={lang.currLang.texts.nickname}
                            onBlur={(e) => { changeRegistNickname(e) }} />
                    </Grid>
                    <Grid className={`${classes.menuDivButton} ${classes.margin}`} align="center">
                        <TextField id="reg-password-field"
                            error={regFieldErrors.passwordErr}
                            helperText={regFieldErrors.passwordErrText}
                            autoComplete="off"
                            className={classes.textField}
                            type={showPassword ? 'text' : 'password'}
                            label={lang.currLang.texts.password}
                            onBlur={(e) => { changeRegistPassword(e) }}
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
                    <Grid className={`${classes.menuDivButton} ${classes.margin}`} align="center">
                        <TextField id="reg-password2-field"
                            error={regFieldErrors.password2Err}
                            helperText={regFieldErrors.password2ErrText}
                            autoComplete="off"
                            className={classes.textField}
                            type={showPassword ? 'text' : 'password'}
                            label={lang.currLang.texts.passwordAgain}
                            onBlur={(e) => { changeRegistPassword2(e) }}
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
                {!isLoading
                    ? <DialogActions>
                        <Button onClick={() => { click('closeRegist') }}
                            color="secondary"
                            disabled={isLoading}>
                            {lang.currLang.buttons.cancel}
                        </Button>
                        <Button onClick={() => { click('signUp') }}
                            color="primary"
                            disabled={isLoading}>
                            {lang.currLang.buttons.signUp}
                        </Button>
                    </DialogActions>
                    : <LinearProgress className={`${classes.margin}`} />
                }
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
                                            onClick={() => { click('openRegist') }}>
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
    lang: PropTypes.object.isRequired,
}

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrLang: currLangState => dispatch(setCurrLang(currLangState)),
        setUserState: State => dispatch(setUserState(State)),
        setSnackbar: snackbar => dispatch(setSnackbar(snackbar)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sign);