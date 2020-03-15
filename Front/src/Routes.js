import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Route, Switch } from "react-router-dom";

import { SET_SNACKBAR_MODE } from "./actions/types.js";
import { setSnackbar } from './actions/Actions.js';

import CircularProgress from '@material-ui/core/CircularProgress';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import Grow from '@material-ui/core/Grow';

import AddTechnics from './components/AddTechnics.jsx';

const TechnicsPromise = import("./components/Technics.jsx");
const Technics = React.lazy(() => TechnicsPromise);

const addLocationPromise = import("./components/Location/AddLocation.jsx");
const AddLocation = React.lazy(() => addLocationPromise);

const addCDreamPromise = import("./components/AddCDream.jsx");
const AddCDream = React.lazy(() => addCDreamPromise);

const addDreamPromise = import("./components/AddDream.jsx");
const AddDream = React.lazy(() => addDreamPromise);

const viewDreamsPromise = import("./components/ViewDreams.jsx");
const ViewDreams = React.lazy(() => viewDreamsPromise);

const dreamMapPromise = import("./components/DreamMap.jsx");
const DreamMap = React.lazy(() => dreamMapPromise);

const profilePromise = import("./components/Profile.jsx");
const Profile = React.lazy(() => profilePromise);

const aeronautsPromise = import("./components/Aeronauts.jsx");
const Aeronauts = React.lazy(() => aeronautsPromise);

const mainPagePromise = import("./components/MainPage.jsx");
const MainPage = React.lazy(() => mainPagePromise);

const signInPromise = import("./components/Sign/SignIn.jsx");
const SignIn = React.lazy(() => signInPromise);

const signUpPromise = import("./components/Sign/SignUp.jsx");
const SignUp = React.lazy(() => signUpPromise);

import CloseIcon from '@material-ui/icons/Close';

import PrivateRoute from "./components/PrivateRoute.js";

import { snackStyles, useStyles, variantIcon } from './styles/Styles.js';

function MySnackbarContentWrapper(props) {
    const snackClasses = snackStyles();
    const { className, message, onClose, variant } = props;
    const Icon = variantIcon[variant];
    return (
        <SnackbarContent className={clsx(snackClasses[variant], className)}
            aria-describedby="client-snackbar-alert"
            message={
                <div id="client-snackbar-alert" className={snackClasses.message} >
                    <Icon className={`${clsx(snackClasses.icon, snackClasses.iconVariant)} ${snackClasses.margin}`} />
                    <Typography align="center" variant='body'>
                        {message}
                    </Typography>
                </div>
            }
            action={[
                <IconButton color="inherit" onClick={onClose} >
                    <CloseIcon className={snackClasses.icon} />
                </IconButton>
            ]}
        />
    );
}

function Routes(props) {
    const classes = useStyles();
    const { lang, open, variant, message } = props;
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [openSnackbarVariant, setOpenSnackbarVariant] = React.useState('');
    const [snackbarMessage, setSnackbarMessage] = React.useState('');

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
        props.setSnackbar({
            type: SET_SNACKBAR_MODE,
            snackbar: {
                open: false,
                variant: openSnackbarVariant,
                message: snackbarMessage,
            },
        });
    };

    React.useEffect(() => {
        setOpenSnackbarVariant(variant);
        setSnackbarMessage(message);
        setOpenSnackbar(open);
    }, [open, variant, message]);

    return (
        <React.Suspense
            fallback={
                <div className={`${classes.formControl} ${classes.centerTextAlign}`} >
                    <div className={`${classes.inlineBlock} ${classes.relativePosition}`} >
                        <CircularProgress />
                    </div>
                    <Typography className={`${classes.relativePosition}`} component="div" >
                        {lang.currLang.texts.Loading}
                    </Typography>
                </div>
            }
        >
            <Snackbar open={openSnackbar}
                onClose={handleCloseSnackbar}
                autoHideDuration={3000}
                TransitionComponent={Grow}
            >
                <MySnackbarContentWrapper className={classes.margin}
                    onClose={handleCloseSnackbar}
                    variant={openSnackbarVariant}
                    message={snackbarMessage}
                />
            </Snackbar>

            <Route path="/signin" component={SignIn} />
            <Route path="/signup" component={SignUp} />
            <Switch>
                <PrivateRoute exact path="/" component={AddLocation} />
                <PrivateRoute path="/profile" component={Profile} />
                <PrivateRoute path="/aeronauts" component={Aeronauts} />
                <PrivateRoute path="/dreammap" component={DreamMap} />
                <PrivateRoute path="/dreams" component={ViewDreams} />
                <PrivateRoute path="/addregulardream" component={AddDream} />
                <PrivateRoute path="/addcdream" component={AddCDream} />
                <PrivateRoute path="/addlocation" component={AddLocation} />
                <PrivateRoute path="/technics" component={Technics} />
                <PrivateRoute path="/addtechnics" component={AddTechnics} />
            </Switch>
        </React.Suspense>
    );
}

Routes.propTypes = {
    lang: PropTypes.object.isRequired,
    open: PropTypes.bool.isRequired,
    variant: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    setSnackbar: PropTypes.func.isRequired,
}

const mapStateToProps = store => {
    return {
        lang: store.lang,
        open: store.snackbar.snackbar.open,
        variant: store.snackbar.snackbar.variant,
        message: store.snackbar.snackbar.message,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSnackbar: snackbar => dispatch(setSnackbar(snackbar)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Routes);