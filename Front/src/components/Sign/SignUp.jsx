import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import jwt_decode from "jwt-decode";

import MobileStepper from "@material-ui/core/MobileStepper";
import CssBaseline from '@material-ui/core/CssBaseline';
import Button from "@material-ui/core/Button";

import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import DoneIcon from '@material-ui/icons/Done';

import { SET_SNACKBAR_MODE, SET_CURRENT_USER } from "../../actions/types.js";
import { setSnackbar, setUserState } from "../../actions/Actions.js";
import setAuthToken from "../../utils/setAuthToken.js";
import { maxSignUpSteps, fetchCreateUserAction, resetCreateUserErrorAction, fetchUpdateUserDataAction, resetUpdateUserDataErrorAction } from '../../Config.js';
import { getCreateUser, getCreateUserPending, getCreateUserError } from '../../reducers/createUserReducer.js';
import { getUpdateUserData, getUpdateUserDataError } from '../../reducers/updateUserDataReducer.js';
import { getToken } from '../../utils/CheckLoginTimeOut.js';

import step1 from "./SignUpStep1.jsx";
import step2 from "./SignUpStep2.jsx";
import step3 from "./SignUpStep3.jsx";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { useStyles } from '../../styles/Styles.js';

function SignUp(props) {
    const { lang, themeMode, history, setSnackbar, setUserState,
        createdUser, createUserError, fetchCreateUser, resetCreateUserError,
        updateUserData, updateUserDataError, fetchUpdateUserData, resetUpdateUserDataError } = props;
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [stepDisabled, setStepDisabled] = React.useState(false);
    const [activeStep, setActiveStep] = React.useState(0);
    const [userLogin, setUserLogin] = React.useState("");
    const [userPass, setUserPass] = React.useState("");
    const [userPassRepeat, setUserPassRepeat] = React.useState("");
    const [userNickName, setUserNickName] = React.useState("");
    const [userAvatar, setUserAvatar] = React.useState(1);

    if (createUserError) {
        if (createUserError.email) {
            setSnackbar({
                type: SET_SNACKBAR_MODE,
                snackbar: {
                    open: true,
                    variant: 'error',
                    message: createUserError.email
                },
            });
        }
        else if (createUserError.password) {
            setSnackbar({
                type: SET_SNACKBAR_MODE,
                snackbar: {
                    open: true,
                    variant: 'error',
                    message: createUserError.password
                },
            });
        }
        else {
            setSnackbar({
                type: SET_SNACKBAR_MODE,
                snackbar: {
                    open: true,
                    variant: 'error',
                    message: createUserError
                },
            });
        }
        resetCreateUserError();
        if (stepDisabled) {
            setStepDisabled(false);
        }
    }

    if (updateUserDataError) {
        setSnackbar({
            type: SET_SNACKBAR_MODE,
            snackbar: {
                open: true,
                variant: 'error',
                message: updateUserDataError
            },
        });
        resetUpdateUserDataError();
        if (stepDisabled) {
            setStepDisabled(false);
        }
    }

    if (Object.keys(createdUser).length > 0 && activeStep === createdUser.next_signup_step - 1) {
        if (stepDisabled) {
            setStepDisabled(false);
        }
        setActiveStep(createdUser.next_signup_step);
        if (localStorage.getItem("jwtToken") === null) {
            localStorage.setItem("jwtToken", createdUser.token);
            setAuthToken(createdUser.token);
            const decoded = jwt_decode(createdUser.token);
            setUserState({
                type: SET_CURRENT_USER,
                payload: decoded
            });
        }
    }

    if (Object.keys(updateUserData).length > 0 && activeStep === updateUserData.next_signup_step - 1) {
        if (stepDisabled) {
            setStepDisabled(false);
        }
        setActiveStep(updateUserData.next_signup_step);
    }
    if (Object.keys(updateUserData).length > 0 && activeStep === maxSignUpSteps) {
        setSnackbar({
            type: SET_SNACKBAR_MODE,
            snackbar: {
                open: true,
                variant: 'success',
                message: lang.currLang.texts.sucessRegistration
            }
        });
        history.push("/luciddreams");
    }

    const steps = [
        React.createElement(step1, { setUserLogin, setUserPass, setUserPassRepeat }, null),
        React.createElement(step2, { setUserNickName }, null),
        React.createElement(step3, { setUserAvatar }, null)
    ];

    const handleNext = () => {
        switch (activeStep) {
            case 0:
                if (userLogin.length === 0) {
                    setSnackbar({
                        type: SET_SNACKBAR_MODE,
                        snackbar: {
                            open: true,
                            variant: 'error',
                            message: lang.currLang.errors.emailLenght
                        },
                    });
                    break;
                }
                if (userPassRepeat !== userPass) {
                    setSnackbar({
                        type: SET_SNACKBAR_MODE,
                        snackbar: {
                            open: true,
                            variant: 'error',
                            message: lang.currLang.errors.passwordsCompare
                        },
                    });
                    break;
                }
                if (userPass.length === 0 || userPassRepeat.length === 0) {
                    setSnackbar({
                        type: SET_SNACKBAR_MODE,
                        snackbar: {
                            open: true,
                            variant: 'error',
                            message: lang.currLang.errors.passwordLenght
                        },
                    });
                    break;
                }
                else {
                    setStepDisabled(true);
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
                    fetchCreateUser({ email: userLogin, password: userPass, password2: userPassRepeat, language: newLang, curr_signup_step: 0 });
                    break;
                }
            case 1:
                if (userNickName.length === 0) {
                    setSnackbar({
                        type: SET_SNACKBAR_MODE,
                        snackbar: {
                            open: true,
                            variant: 'error',
                            message: lang.currLang.errors.nicknameLenght
                        },
                    });
                    break;
                }
                else {
                    setStepDisabled(true);
                    fetchUpdateUserData(createdUser.newId, { nickname: userNickName, curr_signup_step: activeStep }, getToken());
                    break;
                }
        }
    };

    const handleFinish = () => {
        setStepDisabled(true);
        fetchUpdateUserData(createdUser.newId, { avatar_id: userAvatar, curr_signup_step: activeStep }, getToken());
    };

    React.useEffect(() => {
        if (typeof (props.location.defaultData) !== 'undefined') {
            setActiveStep(props.location.defaultData.signup_step);
            createdUser.newId = props.location.defaultData.id;
        }
    }, []);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <div className={classes.root}>
                <MobileStepper
                    position="bottom"
                    variant="dots"
                    steps={maxSignUpSteps}
                    activeStep={activeStep}
                    nextButton={
                        <Button className={`${classes.minWidth100px}`} size="small" onClick={activeStep === steps.length - 1 ? handleFinish : handleNext} disabled={stepDisabled} >
                            {stepDisabled
                                ? <React.Fragment>
                                    {activeStep === steps.length - 1 ? <DoneIcon /> : <KeyboardArrowRight />}
                                </React.Fragment>
                                : <React.Fragment>
                                    {activeStep === steps.length - 1 ? lang.currLang.buttons.Finish : lang.currLang.buttons.Next}
                                    {activeStep === steps.length - 1 ? <DoneIcon /> : <KeyboardArrowRight />}
                                </React.Fragment>
                            }
                        </Button>
                    }
                    backButton={
                        <Button className={`${classes.minWidth100px}`} size="small" disabled={true} />
                    }
                />
                {steps[activeStep]}
            </div>
        </MuiThemeProvider>
    )
}

SignUp.propTypes = {
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    setSnackbar: PropTypes.func.isRequired,
    setUserState: PropTypes.func.isRequired
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        createdUser: getCreateUser(store),
        createUserPending: getCreateUserPending(store),
        createUserError: getCreateUserError(store),
        updateUserData: getUpdateUserData(store),
        updateUserDataError: getUpdateUserDataError(store)
    }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setSnackbar: snackbar => dispatch(setSnackbar(snackbar)),
    setUserState: State => dispatch(setUserState(State)),
    fetchCreateUser: fetchCreateUserAction,
    resetCreateUserError: resetCreateUserErrorAction,
    fetchUpdateUserData: fetchUpdateUserDataAction,
    resetUpdateUserDataError: resetUpdateUserDataErrorAction
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUp);
