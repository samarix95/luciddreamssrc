import React from 'react';
import { connect } from 'react-redux';
import jwt_decode from "jwt-decode";
import PropTypes from 'prop-types';

import { GET_ERRORS, SET_CURRENT_USER, SET_SNACKBAR_MODE } from "../actions/types";
import { setCurrLang, setUserState, setSnackbar } from '../actions/Actions';
import { useStyles } from '../styles/Styles';
import setAuthToken from "../utils/setAuthToken";
import { instance } from './Config';

import RuDict from '../dictionary/ru';
import EnDict from '../dictionary/en';

import InputAdornment from '@material-ui/core/InputAdornment';
import LinearProgress from '@material-ui/core/LinearProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';

import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';

import { mdiVk } from '@mdi/js';
import Icon from '@mdi/react';

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
                //console.log(err);
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
                    //TODO нормальный popup
                    alert(lang.currLang.texts.sucessRegistration);
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
            case 'useVk':
                // window.VK.Auth.login(checkLoginState, 4194304);
                // let loadItems = async () => {
                //     const response = await fetch('http://10.203.117.137:3001/auth/vk', {
                //         method: 'GET',
                //         credentials: 'include',
                //     });
                //     const body = await response.json();

                //     console.log(response);
                // }
                break;
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
        if (language === 'Ru') {
            setCurrLang(RuDict);
        }
        else {
            setCurrLang(EnDict);
        }
    }

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />

            <div className={classes.root} id='rootDiv'>

                <div className={classes.mainPage}
                    style={
                        page.mainPage === true
                            ? { transform: 'translateY(0%)' }
                            : { transform: 'translateY(-100%)' }
                    } >
                    <Grid className={classes.mainGridContainer}
                        container
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <Grid item xs={11} className={classes.mainGridBodyItem} >
                            <Grid className={classes.menuButtonContainer}
                                container
                                direction="column"
                                justify="center"
                                alignItems="stretch" >
                                <Grid item xs={3} />
                                <Grid item xs={6} className={classes.menuButtonContainerItem}>
                                    <Dialog
                                        open={openLogin}
                                        TransitionComponent={Transition}
                                        keepMounted
                                        aria-labelledby="alert-dialog-slide-title"
                                        aria-describedby="alert-dialog-slide-description"
                                    >
                                        <DialogTitle id="alert-dialog-slide-title">
                                            {lang.currLang.buttons.signIn}
                                        </DialogTitle>
                                        <DialogContent>
                                            <Grid item xs={12} className={classes.menuButtonContainerItem}>
                                                <Grid item xs={2} className={classes.menuDivButton} align="center">
                                                    <TextField
                                                        className={classes.textField}
                                                        id="email-field"
                                                        type="email"
                                                        label="Email"
                                                        onBlur={(e) => { changeAuthLogin(e) }} />
                                                </Grid>
                                                <Grid item xs={2} className={classes.menuDivButton} align="center">
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
                                                <Grid item xs={2} className={classes.menuDivButton}
                                                    align="center"
                                                >
                                                    <Typography>
                                                        {lang.currLang.texts.or}
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={2} className={classes.menuDivButton}
                                                    align="center"
                                                >
                                                    <IconButton className={classes.button}
                                                        onClick={() => { click('useVk') }}
                                                        disabled={isLoading}>
                                                        <Icon path={mdiVk} size={2} color={themeMode.palette.type === 'light' ? 'rgba(0, 0, 0, 0.54)' : 'rgba(255, 255, 255, 1)'} />
                                                    </IconButton>
                                                </Grid>
                                            </Grid>
                                            {isLoading
                                                ? <LinearProgress /> :
                                                ''}
                                        </DialogContent>
                                        {!isLoading
                                            ?
                                            <DialogActions>
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
                                            </DialogActions>
                                            : ''}
                                    </Dialog>
                                    <Dialog
                                        open={openRegist}
                                        TransitionComponent={Transition}
                                        keepMounted
                                        aria-labelledby="alert-dialog-slide-title"
                                        aria-describedby="alert-dialog-slide-description"
                                    >
                                        <DialogTitle id="alert-dialog-slide-title">
                                            {lang.currLang.buttons.signUp}
                                        </DialogTitle>
                                        <DialogContent>
                                            <Grid item xs={12} className={classes.menuButtonContainerItem}>
                                                <Grid item xs={2} className={classes.menuDivButton} align="center">
                                                    <TextField
                                                        error={regFieldErrors.emailErr}
                                                        helperText={regFieldErrors.emailErrText}
                                                        className={classes.textField}
                                                        id="reg-email-field"
                                                        type="email"
                                                        label="Email"
                                                        onBlur={(e) => { changeRegistLogin(e) }} />
                                                </Grid>
                                                <Grid item xs={2} className={classes.menuDivButton} align="center">
                                                    <TextField
                                                        error={regFieldErrors.nicknameErr}
                                                        helperText={regFieldErrors.nicknameErrText}
                                                        className={classes.textField}
                                                        id="reg-nickname-field"
                                                        type="text"
                                                        label={lang.currLang.texts.nickname}
                                                        onBlur={(e) => { changeRegistNickname(e) }} />
                                                </Grid>
                                                <Grid item xs={2} className={classes.menuDivButton} align="center">
                                                    <TextField
                                                        error={regFieldErrors.passwordErr}
                                                        helperText={regFieldErrors.passwordErrText}
                                                        id="reg-password-field"
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
                                                <Grid item xs={2} className={classes.menuDivButton} align="center">
                                                    <TextField
                                                        error={regFieldErrors.password2Err}
                                                        helperText={regFieldErrors.password2ErrText}
                                                        id="reg-password2-field"
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
                                            </Grid>
                                            {isLoading
                                                ? <LinearProgress />
                                                : ''}

                                        </DialogContent>
                                        {!isLoading
                                            ?
                                            <DialogActions>
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
                                            : ''}
                                    </Dialog>
                                    <Grid item xs={2} className={classes.menuDivButton} align="center">
                                        <Button variant="contained" color="primary" className={classes.menuButton} onClick={() => { click('openLogin') }}>
                                            {lang.currLang.buttons.signIn}
                                        </Button>
                                    </Grid>
                                    <Grid item xs={2} className={classes.menuDivButton} align="center">
                                        <Button variant="contained" color="primary" className={classes.menuButton} onClick={() => { click('openRegist') }}>
                                            {lang.currLang.buttons.signUp}
                                        </Button>
                                    </Grid>
                                    <Grid item xs={2} className={classes.menuDivButton} align="center" />
                                    <Grid item xs={2} className={classes.menuDivButton} align="center">
                                        <Button variant="contained"
                                            color="primary"
                                            className={classes.menuButton}
                                            onClick={() => (click('openAboutPage'))} >
                                            {lang.currLang.buttons.about}
                                        </Button>
                                    </Grid>
                                </Grid>
                                <Grid item xs={3} />
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
                </div >

                <div className={classes.aboutPage}
                    style={page.aboutPage === true
                        ? { transform: 'translateY(-100%)' }
                        : { transform: 'translateY(0%)' }
                    }
                >
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
                                onClick={() => (click('closeAboutPage'))} >
                                {lang.currLang.buttons.close}
                            </Button>
                        </Grid>
                    </Grid>
                </div>
            </div >
        </MuiThemeProvider>
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