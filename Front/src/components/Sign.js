import React from 'react';
import { connect } from 'react-redux';
import jwt_decode from "jwt-decode";
import PropTypes from 'prop-types';
import axios from "axios";
import clsx from 'clsx';

import { setCurrLang, setUserState, setCloud, setStar, setThemeMode } from '../actions/Actions';
import { useStyles, params, randomBetween, variantIcon } from '../styles/Styles';
import setAuthToken from "../utils/setAuthToken";
import { GET_ERRORS, SET_CURRENT_USER } from "../actions/types";

import RuDict from '../dictionary/ru';
import EnDict from '../dictionary/en';

import SnackbarContent from '@material-ui/core/SnackbarContent';
import InputAdornment from '@material-ui/core/InputAdornment';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Snackbar from '@material-ui/core/Snackbar';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';

import VisibilityOff from '@material-ui/icons/VisibilityOff';
import Visibility from '@material-ui/icons/Visibility';
import CloseIcon from '@material-ui/icons/Close';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';

import { mdiVk } from '@mdi/js';
import Icon from '@mdi/react';

import { amber, green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});



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

function MySnackbarContentWrapper(props) {
    const classes = useStyles1();
    const { className, message, onClose, variant, ...other } = props;
    const Icon = variantIcon[variant];

    return (
        <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    {message}
                </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
            {...other}
        />
    );
}

function Sign(props) {
    const classes = useStyles();
    const { setCloud, setStar, setThemeMode, history } = props;
    const { themeMode, lang, clouds, stars } = props.store;
    const muiTheme = createMuiTheme(themeMode);

    const [openSnackbar, setOpenSnackbar] = React.useState(false);

    const [snackbarMessage, setSnackbarMessage] = React.useState('');

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
    }

    const changeAuthPassword = (e) => {
        let newLoginData = loginData;
        newLoginData = { ...newLoginData, password: e.target.value };
        setLoginData(newLoginData);
    }

    const changeRegistLogin = (e) => {
        let newRegFieldErrors = regFieldErrors;
        newRegFieldErrors = { ...newRegFieldErrors, emailErr: false };
        newRegFieldErrors = { ...newRegFieldErrors, emailErrText: '' };
        setRegFieldErrors(newRegFieldErrors);

        let newRegistData = registData;
        newRegistData = { ...newRegistData, email: e.target.value };
        setRegistData(newRegistData);
    }

    const changeRegistNickname = (e) => {
        let newRegFieldErrors = regFieldErrors;
        newRegFieldErrors = { ...newRegFieldErrors, nicknameErr: false };
        newRegFieldErrors = { ...newRegFieldErrors, nicknameErrText: '' };
        setRegFieldErrors(newRegFieldErrors);

        let newRegistData = registData;
        newRegistData = { ...newRegistData, nickname: e.target.value };
        setRegistData(newRegistData);
    }

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
    }

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
    }

    const singIn = () => {
        axios
            .post("http://localhost:3001/actions/users/login", loginData)
            .then(res => {
                const { token } = res.data;
                localStorage.setItem("jwtToken", token);
                setAuthToken(token);
                const decoded = jwt_decode(token);
                props.setUserState({
                    type: SET_CURRENT_USER,
                    payload: decoded
                });
                setIsLoading(false);
                history.push("/luciddreams");
            })
            .catch(err => {
                props.setUserState({
                    type: GET_ERRORS,
                    payload: err.response.data
                });

                if (err.response.data.email === 'UserNotExist') {
                    setSnackbarMessage(lang.currLang.errors.UserNotExist);
                }
                if (err.response.data.email === 'EmailIsNotValid') {
                    setSnackbarMessage(lang.currLang.errors.EmailIsNotValid);
                }
                if (err.response.data.passwordincorrect === 'IncorrectPassword') {
                    setSnackbarMessage(lang.currLang.errors.IncorrectPassword);
                }

                setOpenSnackbar(true);
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
            axios
                .post('http://localhost:3001/actions/users/register', registData)
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
                    props.setUserState({
                        type: GET_ERRORS,
                        payload: err.response.data
                    });

                    if (err.response.data.email === 'EmailIsBusy') {
                        setSnackbarMessage(lang.currLang.errors.EmailIsBusy);
                    }
                    if (err.response.data.password === 'PasswordLenght5Symbols') {
                        setSnackbarMessage(lang.currLang.errors.PasswordLenght5Symbols);
                    }

                    setOpenSnackbar(true);
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

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    const changeLanguage = (language) => {
        if (language === 'Ru') {
            props.setCurrLang(RuDict);
        }
        else {
            props.setCurrLang(EnDict);
        }
    }

    React.useEffect(() => {
        for (let i = 0; i < params.amountStars; i++) {
            let size = Math.round(Math.random() * 10) === 0 ? params.size.giant : randomBetween(params.size.min, params.size.max);
            setStar(
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
            setCloud(
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
            setThemeMode({
                type: "dark",
                primary: { main: "#f9a825" },
                secondary: { main: "#f50057" },
                error: { main: "#cc0000" },
            });
        }
        else {
            setThemeMode({
                type: "light",
                primary: { main: "#3f51b5" },
                secondary: { main: "#f50057" },
                error: { main: "#cc0000" },
            });
        }
    }, [classes, setCloud, setStar, setThemeMode]);

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

                                <Grid item xs={12} className={classes.menuButtonContainerItem}>
                                    <Dialog
                                        open={openLogin}
                                        TransitionComponent={Transition}
                                        keepMounted
                                        aria-labelledby="alert-dialog-slide-title"
                                        aria-describedby="alert-dialog-slide-description" >
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
                                                        onChange={(e) => { changeAuthLogin(e) }} />
                                                </Grid>

                                                <Grid item xs={2} className={classes.menuDivButton} align="center">
                                                    <TextField
                                                        id="password-field"
                                                        className={classes.textField}
                                                        type={showPassword ? 'text' : 'password'}
                                                        label={lang.currLang.texts.password}
                                                        onChange={(e) => { changeAuthPassword(e) }}
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
                                                    <Typography>
                                                        {lang.currLang.texts.or}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={2} className={classes.menuDivButton} align="center">
                                                    <IconButton className={classes.button}
                                                        onClick={() => { click('useVk') }}
                                                        disabled={isLoading}>
                                                        <Icon path={mdiVk} size={2} color={themeMode.palette.type === 'light' ? 'rgba(0, 0, 0, 0.54)' : 'rgba(255, 255, 255, 1)'} />
                                                    </IconButton>
                                                </Grid>

                                            </Grid>
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => { click('closeLogin') }}
                                                color="primary"
                                                disabled={isLoading}>
                                                {lang.currLang.buttons.cancel}
                                            </Button>
                                            <Button onClick={() => { click('signIn') }}
                                                color="primary"
                                                disabled={isLoading}>
                                                {lang.currLang.buttons.signIn}
                                            </Button>
                                        </DialogActions>
                                    </Dialog>

                                    <Dialog
                                        open={openRegist}
                                        TransitionComponent={Transition}
                                        keepMounted
                                        aria-labelledby="alert-dialog-slide-title"
                                        aria-describedby="alert-dialog-slide-description" >
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
                                                        onChange={(e) => { changeRegistLogin(e) }} />
                                                </Grid>

                                                <Grid item xs={2} className={classes.menuDivButton} align="center">
                                                    <TextField
                                                        error={regFieldErrors.nicknameErr}
                                                        helperText={regFieldErrors.nicknameErrText}
                                                        className={classes.textField}
                                                        id="reg-nickname-field"
                                                        type="text"
                                                        label={lang.currLang.texts.nickname}
                                                        onChange={(e) => { changeRegistNickname(e) }} />
                                                </Grid>

                                                <Grid item xs={2} className={classes.menuDivButton} align="center">
                                                    <TextField
                                                        error={regFieldErrors.passwordErr}
                                                        helperText={regFieldErrors.passwordErrText}
                                                        id="reg-password-field"
                                                        className={classes.textField}
                                                        type={showPassword ? 'text' : 'password'}
                                                        label={lang.currLang.texts.password}
                                                        onChange={(e) => { changeRegistPassword(e) }}
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
                                                        onChange={(e) => { changeRegistPassword2(e) }}
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
                                        </DialogContent>
                                        <DialogActions>
                                            <Button onClick={() => { click('closeRegist') }}
                                                color="primary"
                                                disabled={isLoading}>
                                                {lang.currLang.buttons.cancel}
                                            </Button>
                                            <Button onClick={() => { click('signUp') }}
                                                color="primary"
                                                disabled={isLoading}>
                                                {lang.currLang.buttons.signUp}
                                            </Button>
                                        </DialogActions>
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

                                    <Grid item xs={2} className={classes.menuDivButton} align="center"></Grid>

                                    <Grid item xs={2} className={classes.menuDivButton} align="center">
                                        <Button variant="contained"
                                            color="primary"
                                            className={classes.menuButton}
                                            onClick={() => (click('openAboutPage'))} >
                                            {lang.currLang.buttons.about}
                                        </Button>
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
                </div >

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
                                onClick={() => (click('closeAboutPage'))} >
                                {lang.currLang.buttons.close}
                            </Button>

                        </Grid>

                    </Grid>
                </div>
            </div >

            <Snackbar
                open={openSnackbar}
                onClose={handleCloseSnackbar}
                autoHideDuration={3000}>
                <MySnackbarContentWrapper
                    className={classes.margin}
                    onClose={handleCloseSnackbar}
                    variant='error'
                    message={snackbarMessage}
                />
            </Snackbar>

        </MuiThemeProvider>
    )
}

const mapStateToProps = store => {
    return {
        store,
        lang: store.lang,
        auth: store.auth,
        errors: store.errors,
        clouds: store.clouds,
        stars: store.stars,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setCurrLang: currLangState => dispatch(setCurrLang(currLangState)),
        setUserState: State => dispatch(setUserState(State)),
        setCloud: cloudState => dispatch(setCloud(cloudState)),
        setStar: starState => dispatch(setStar(starState)),
        setThemeMode: paletteState => dispatch(setThemeMode(paletteState)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sign)

Sign.propTypes = {
    setCurrLang: PropTypes.func.isRequired,
    setUserState: PropTypes.func.isRequired,
    setCloud: PropTypes.func.isRequired,
    setThemeMode: PropTypes.func.isRequired,
    lang: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    errors: PropTypes.object.isRequired,
    clouds: PropTypes.object.isRequired,
    stars: PropTypes.object.isRequired,
}

MySnackbarContentWrapper.propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
    onClose: PropTypes.func,
    variant: PropTypes.oneOf(['error', 'info', 'success', 'warning']).isRequired,
};