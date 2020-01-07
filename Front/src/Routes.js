import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import { Route, Switch } from "react-router-dom";

import { SET_SNACKBAR_MODE } from "./actions/types";
import { setSnackbar } from './actions/Actions';

import PrivateRoute from "./components/PrivateRoute";

import AddDream from './components/AddDream';
import AddCDream from './components/AddCDream';
import ViewDreams from './components/ViewDreams';
import MainPage from "./components/MainPage";
import Sign from './components/Sign';
import Technics from './components/Technics';

import { useStyles, variantIcon } from './styles/Styles';

import SnackbarContent from '@material-ui/core/SnackbarContent';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Snackbar from '@material-ui/core/Snackbar';
import { makeStyles } from '@material-ui/core/styles';
import { amber, green } from '@material-ui/core/colors';
import CloseIcon from '@material-ui/icons/Close';

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
    const { className, message, onClose, variant } = props;
    const Icon = variantIcon[variant];
    return (
        <SnackbarContent
            className={clsx(classes[variant], className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    <Typography className={classes.mainGridContainer}
                        align='center'
                        variant='body2'>
                        {message}
                    </Typography>
                </span>
            }
            action={[
                <IconButton key="close"
                    aria-label="close"
                    color="inherit"
                    onClick={onClose}
                >
                    <CloseIcon className={classes.icon} />
                </IconButton>,
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
        <div>
            <Snackbar
                open={openSnackbar}
                onClose={handleCloseSnackbar}
                autoHideDuration={3000}>
                <MySnackbarContentWrapper
                    className={classes.margin}
                    onClose={handleCloseSnackbar}
                    variant={openSnackbarVariant}
                    message={snackbarMessage}
                />
            </Snackbar>
            <Route exact path="/" component={Sign} />
            <Switch>
                <PrivateRoute exact path="/luciddreams" component={MainPage} />
                <PrivateRoute exact path="/dreams" component={ViewDreams} />
                <PrivateRoute exact path="/addregulardream" component={AddDream} />
                <PrivateRoute exact path="/addcdream" component={AddCDream} />
                <PrivateRoute exact path="/technics" component={Technics} />
            </Switch>
        </div>
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