import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import LinearProgress from '@material-ui/core/LinearProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';

import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import CssBaseline from '@material-ui/core/CssBaseline';

import { SET_SNACKBAR_MODE } from "../../actions/types.js";
import { setCurrLang, setSnackbar } from "../../actions/Actions.js";
import { useStyles } from '../../styles/Styles.js';
import { fetchUserDataAction, fetchLoginUserAction, resetLoginUserErrorAction } from "../../Config.js";
import { getLoginUser, getLoginUserPending, getLoginUserError } from '../../reducers/loginUserReducer.js';
import { getToken, setToken } from '../../utils/CheckLoginTimeOut.js';

import RuDict from "../../dictionary/ru.js";
import EnDict from "../../dictionary/en.js";

function SignIn(props) {
    const classes = useStyles();
    const { history, themeMode, lang, setSnackbar, setCurrLang, fetchUserData,
        fetchLoginUser, resetLoginUserError, loginUser, loginUserPending, loginUserError } = props;
    const muiTheme = createMuiTheme(themeMode);
    const [userLogin, setUserLogin] = React.useState("");
    const [userPass, setUserPass] = React.useState("");
    const [isLoading, setIsLoading] = React.useState(false);
    const [openLogin, setOpenLogin] = React.useState(false);

    if (loginUserError) {
        if (loginUserError.email) {
            setSnackbar({
                type: SET_SNACKBAR_MODE,
                snackbar: {
                    open: true,
                    variant: 'error',
                    message: lang.currLang.errors[loginUserError.email]
                }
            });
        }
        else if (loginUserError.password) {
            setSnackbar({
                type: SET_SNACKBAR_MODE,
                snackbar: {
                    open: true,
                    variant: 'error',
                    message: lang.currLang.errors[loginUserError.password]
                }
            });
        }
        else {
            setSnackbar({
                type: SET_SNACKBAR_MODE,
                snackbar: {
                    open: true,
                    variant: 'error',
                    message: lang.currLang.errors[loginUserError]
                }
            });
        }
        resetLoginUserError();
        if (isLoading) setIsLoading(false);
    }

    if (Object.keys(loginUser).length > 0 && !loginUserPending) {
        const id = setToken(loginUser.token);
        fetchUserData(id, getToken());
        history.push("/");
    }

    const changeAuthLogin = (e) => {
        setUserLogin(e.target.value);
    };

    const changeAuthPassword = (e) => {
        setUserPass(e.target.value);
    };

    const handleOpenLogin = () => {
        setOpenLogin(true);
    };

    const handleCloseLogin = () => {
        setOpenLogin(false);
    };

    const handleOpenAboutPage = () => {
        alert("Open about page");
    };

    const changeLanguage = (language) => {
        language === 'Ru' ? setCurrLang(RuDict) : setCurrLang(EnDict);
    };

    const singIn = () => {
        setIsLoading(true);
        fetchLoginUser({ email: userLogin, password: userPass });
    };

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Dialog open={openLogin} onClose={handleCloseLogin} >
                <DialogTitle >
                    {lang.currLang.buttons.signIn}
                </DialogTitle>
                <DialogContent dividers={true} >
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height12}`} >
                        <div className={`${classes.height1} ${classes.width12} ${classes.SearchPaper} ${classes.relativePosition} ${classes.horizontalCenter}`} >
                            <AlternateEmailIcon className={`${classes.margin}`} />
                            <TextField className={`${classes.height12}`}
                                placeholder="Email"
                                type={"email"}
                                onChange={changeAuthLogin}
                            />
                        </div>
                        <div className={`${classes.height1} ${classes.width12} ${classes.SearchPaper} ${classes.relativePosition} ${classes.horizontalCenter}`} />
                        <div className={`${classes.height1} ${classes.width12} ${classes.SearchPaper} ${classes.relativePosition} ${classes.horizontalCenter}`} >
                            <VpnKeyIcon className={`${classes.margin}`} />
                            <TextField className={`${classes.height12}`}
                                placeholder={lang.currLang.texts.password}
                                type={'password'}
                                onChange={changeAuthPassword}
                            />
                        </div>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    {!isLoading
                        ? <React.Fragment>
                            <Button onClick={handleCloseLogin}
                                color="secondary"
                                disabled={isLoading}>
                                {lang.currLang.buttons.close}
                            </Button>
                            <Button onClick={singIn}
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
                                    <Button className={`${classes.menuButton} ${classes.centerButton}`}
                                        variant="contained"
                                        color="primary"
                                        onClick={handleOpenLogin}
                                    >
                                        {lang.currLang.buttons.signIn}
                                    </Button>
                                </Grid>
                                <Grid item className={`${classes.menuDivButton} ${classes.height2}`}>
                                    <Button className={`${classes.menuButton} ${classes.centerButton}`}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { history.push('/signup') }}
                                    >
                                        {lang.currLang.buttons.signUp}
                                    </Button>
                                </Grid>
                                <Grid item className={`${classes.height2}`} />
                                <Grid item className={`${classes.menuDivButton} ${classes.height2}`}>
                                    <Button className={`${classes.menuButton} ${classes.centerButton}`}
                                        variant="contained"
                                        color="primary"
                                        onClick={handleOpenAboutPage}
                                    >
                                        {lang.currLang.buttons.about}
                                    </Button>
                                </Grid>
                                <Grid item className={`${classes.height2}`} />
                            </Grid>
                            <Grid item className={`${classes.height3}`} />
                        </Grid>
                    </Grid>
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height1}`}>
                        <Grid className={`${classes.menuButtonContainer}`}
                            container
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
        </MuiThemeProvider >
    )
}

SignIn.propTypes = {
    setCurrLang: PropTypes.func.isRequired,
    setSnackbar: PropTypes.func.isRequired,
    themeMode: PropTypes.object.isRequired,
    fetchLoginUser: PropTypes.func.isRequired,
    resetLoginUserError: PropTypes.func.isRequired,
    loginUser: PropTypes.object.isRequired,
    loginUserPending: PropTypes.object.isRequired,
    loginUserError: PropTypes.object.isRequired,
}

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        loginUser: getLoginUser(store),
        loginUserPending: getLoginUserPending(store),
        loginUserError: getLoginUserError(store),
    }
}

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setCurrLang: currLangState => dispatch(setCurrLang(currLangState)),
    setSnackbar: snackbar => dispatch(setSnackbar(snackbar)),
    fetchLoginUser: fetchLoginUserAction,
    resetLoginUserError: resetLoginUserErrorAction,
    fetchUserData: fetchUserDataAction
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignIn);