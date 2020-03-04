import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Badge from '@material-ui/core/Badge';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { useStyles } from '../styles/Styles.js';

import { fetchUserDataAction, fetchRandomUsersAction } from '../Config';
import { getUserDataError, getUserData, getUserDataPending } from '../reducers/userDataReducer.js';
import { getRandomUsersError, getRandomUsers, getRandomUsersPending } from '../reducers/randomUsersReducer.js';
import { CheckTimeOut, getToken } from '../utils/CheckLoginTimeOut';

import UserConnections from './dialogs/UserConnections.jsx';

const percentAspect = ((11 / 12) * (4 / 12) * (5 / 12));
const bubbleSize = percentAspect * 100;

function Aeronauts(props) {
    const { lang, themeMode, history, user_id, userData, userDataError, userDataPending, fetchUserData, randomUsersError, randomUsers, randomUsersPending, fetchRandomUsers } = props;
    if (userDataError) {
        console.log("Aeronauts");
        console.log(userDataError);
        alert("Error");
    }
    if (randomUsersError) {
        console.log("Aeronauts");
        console.log(randomUsersError);
        alert("Error");
    }
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [openConnect, setOpenConnect] = React.useState(false);

    const openProfile = (id) => {
        history.push({
            pathname: "/profile",
            defaultData: {
                friend_id: id,
                prevUrl: "/aeronauts",
            }
        })
    };

    const openUserConnections = () => {
        setOpenConnect(true);
    };

    const closeUserConnections = () => {
        setOpenConnect(false);
    };

    const openUserProfile = () => {
        CheckTimeOut() ? history.push("/profile") : history.push("/");
    };

    React.useEffect(() => {
        const token = getToken();
        fetchUserData(user_id, token);
        fetchRandomUsers(user_id, 2, token);
    }, []);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            {openConnect
                ? <UserConnections
                    open={openConnect}
                    user_id={user_id}
                    closeAction={closeUserConnections}
                    history={history}
                />
                : <React.Fragment />
            }
            <div className={classes.root}>
                <Grid className={`${classes.height12}`}
                    container
                    direction="column"
                    justify="center"
                    alignItems="stretch"
                >
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height11}`} >
                        <Grid className={`${classes.height3} ${classes.relativePosition}`} container >
                            <Grid item xs={4} className={`${classes.height12} ${classes.relativePosition} ${classes.padding10}`} >
                                <div className={`${classes.relativePosition} ${classes.fullWidth} ${classes.equalHeight} ${classes.centerButton}`}>
                                    <ButtonBase onClick={openUserProfile}
                                        className={`${classes.absolutePosition} ${classes.fullWidth} ${classes.fullHeight} ${classes.topLeft} ${classes.borderRadius50}`}>
                                        <Avatar className={`${classes.absolutePosition} ${classes.fullWidth} ${classes.fullHeight}`} />
                                    </ButtonBase>
                                </div>
                            </Grid>
                            <Grid item xs={8} className={`${classes.height12} ${classes.relativePosition}`} >
                                <Paper className={`${classes.centerButton} ${classes.width10}`} >
                                    {!userDataPending
                                        ? <Typography variant="h6" align="center">
                                            {userData.nickname}
                                        </Typography>
                                        : <div className={`${classes.formControl} ${classes.centerTextAlign}`}>
                                            <div className={`${classes.inlineBlock} ${classes.relativePosition}`}>
                                                <CircularProgress />
                                            </div>
                                            <Typography className={`${classes.relativePosition}`} component="div">
                                                {lang.currLang.texts.Loading}
                                            </Typography>
                                        </div>
                                    }

                                </Paper>
                            </Grid>
                        </Grid>
                        <Grid className={`${classes.height5} ${classes.relativePosition}`} >
                            <Button className={`${classes.formControl} ${classes.width6}`}
                                variant="contained"
                                color="primary"
                                onClick={openUserConnections}
                            >
                                {lang.currLang.buttons.Connections}
                            </Button>
                        </Grid>
                        <Grid className={`${classes.height4} ${classes.relativePosition}`} >
                            {!randomUsersPending
                                ? <div className={`${classes.height12} ${classes.relativePosition}`}
                                    style={{
                                        overflowY: "visible",
                                    }}
                                >
                                    <div className={`${classes.height12} ${classes.relativePosition}`}
                                        style={{
                                            overflowX: "scroll",
                                        }}
                                    >
                                        <div className={`${classes.height12} ${classes.relativePosition}`}
                                            style={
                                                window.innerHeight / 100 * ((randomUsers.length + 1) / 2) * percentAspect * 110 < window.innerWidth
                                                    ? {
                                                        left: "50%",
                                                        transform: "translate(-50%)",
                                                        width: ((randomUsers.length + 1) / 2) * percentAspect * 110 + "vh",
                                                    }
                                                    : {
                                                        width: ((randomUsers.length + 1) / 2) * percentAspect * 110 + "vh",
                                                    }
                                            }
                                        >
                                            {randomUsers.map((item, key) => (
                                                <ButtonBase key={key}
                                                    onClick={() => openProfile(item.id)}
                                                    style={
                                                        ((key + 1) & 1)
                                                            ? {
                                                                position: "absolute",
                                                                top: "50%",
                                                                left: key * percentAspect * 55 + "vh",
                                                                height: bubbleSize + "vh",
                                                                width: bubbleSize + "vh",
                                                                borderRadius: "50%",
                                                            }
                                                            : {
                                                                position: "absolute",
                                                                top: "8.4%",
                                                                left: key * percentAspect * 55 + "vh",
                                                                height: bubbleSize + "vh",
                                                                width: bubbleSize + "vh",
                                                                borderRadius: "50%",
                                                            }
                                                    }
                                                >
                                                    <Badge className={`${classes.absolutePosition} ${classes.fullWidth} ${classes.fullHeight}`}
                                                        overlap="circle"
                                                        anchorOrigin={{
                                                            vertical: 'top',
                                                            horizontal: 'right',
                                                        }}
                                                        badgeContent={
                                                            item.count !== "0"
                                                                ? <Avatar >
                                                                    {"+" + item.count}
                                                                </Avatar>
                                                                : <React.Fragment />
                                                        }
                                                    >
                                                        <Avatar className={`${classes.absolutePosition} ${classes.fullWidth} ${classes.fullHeight}`} src="https://api.adorable.io/avatars/227/333.png" />
                                                    </Badge>
                                                </ButtonBase>
                                            ))
                                            }
                                        </div>
                                    </div>
                                </div>
                                : <React.Fragment />
                            }
                        </Grid>
                    </Grid>
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height1}`}>
                        <Grid container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                        >
                            <Grid item>
                                <Button className={classes.actionButton}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { history.push("/luciddreams") }}
                                >
                                    {lang.currLang.buttons.Back}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </MuiThemeProvider >
    )
}

Aeronauts.propTypes = {
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    user_id: PropTypes.number.isRequired,
    userDataError: PropTypes.object.isRequired,
    userData: PropTypes.object.isRequired,
    userDataPending: PropTypes.object.isRequired,
    randomUsersError: PropTypes.object.isRequired,
    randomUsers: PropTypes.object.isRequired,
    randomUsersPending: PropTypes.object.isRequired,
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        user_id: store.auth.user.id,
        userDataError: getUserDataError(store),
        userData: getUserData(store),
        userDataPending: getUserDataPending(store),
        randomUsersError: getRandomUsersError(store),
        randomUsers: getRandomUsers(store),
        randomUsersPending: getRandomUsersPending(store),
    }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchUserData: fetchUserDataAction,
    fetchRandomUsers: fetchRandomUsersAction,
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Aeronauts);