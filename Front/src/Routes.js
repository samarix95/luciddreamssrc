import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Route, Switch } from "react-router-dom";

import { SET_SNACKBAR_MODE } from "./actions/types.js";
import { setSnackbar } from './actions/Actions.js';

import SnackbarContent from '@material-ui/core/SnackbarContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';

import AddTechnics from './components/AddTechnics.jsx';
//const AddTechnics = React.lazy(() => import('./components/AddTechnics.jsx'));
//import Technics from './components/Technics.jsx';
const Technics = React.lazy(() => import('./components/Technics.jsx'));
//import AddLocation from './components/AddLocation.jsx';
const AddLocation = React.lazy(() => import('./components/AddLocation.jsx'));
//import AddCDream from './components/AddCDream.jsx';
const AddCDream = React.lazy(() => import('./components/AddCDream.jsx'));
//import AddDream from './components/AddDream.jsx';
const AddDream = React.lazy(() => import('./components/AddDream.jsx'));
//import ViewDreams from './components/ViewDreams.jsx';
const ViewDreams = React.lazy(() => import('./components/ViewDreams.jsx'));
//import DreamMap from './components/DreamMap.jsx';
const DreamMap = React.lazy(() => import('./components/DreamMap.jsx'));
//import MainPage from './components/MainPage.jsx';
const MainPage = React.lazy(() => import('./components/MainPage.jsx'));
//import Sign from './components/Sign.js';
const Sign = React.lazy(() => import('./components/Sign.js'));

import CloseIcon from '@material-ui/icons/Close';

import PrivateRoute from "./components/PrivateRoute.js";

import { snackStyles, useStyles, variantIcon } from './styles/Styles.js';

function MySnackbarContentWrapper(props) {
    const snackClasses = snackStyles();
    const { className, message, onClose, variant } = props;
    const Icon = variantIcon[variant];
    return (
        <SnackbarContent
            className={clsx(snackClasses[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={snackClasses.message}>
                    <Icon className={clsx(snackClasses.icon, snackClasses.iconVariant)} />
                    <Typography align='center' variant='body2'>
                        {message}
                    </Typography>
                </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon className={snackClasses.icon} />
                </IconButton>
            ]}
        />
    );
}

function Routes(props) {
    const classes = useStyles();
    const { open, variant, message } = props;
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
        <React.Suspense fallback={
            <p>Loading...</p>
        }>
            <Snackbar open={openSnackbar}
                onClose={handleCloseSnackbar}
                autoHideDuration={3000}
            >
                <MySnackbarContentWrapper
                    className={classes.margin}
                    onClose={handleCloseSnackbar}
                    variant={openSnackbarVariant}
                    message={snackbarMessage}
                />
            </Snackbar>
            <Route exact path="/" component={Sign} />
            <Switch>
                <PrivateRoute path="/luciddreams" component={MainPage} />
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
    open: PropTypes.bool.isRequired,
    variant: PropTypes.string.isRequired,
    message: PropTypes.string.isRequired,
    setSnackbar: PropTypes.func.isRequired,
}

const mapStateToProps = store => {
    return {
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