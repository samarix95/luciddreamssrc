import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import InputBase from '@material-ui/core/InputBase';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { useStyles } from '../styles/Styles.js';
import { fetchUserDataAction, fetchUserPostsAction, fetchConnectPostsAction, fetchAvatarsAction, fetchUpdateUserDataAction } from '../Config';
import { getAvatarsError, getAvatars, getAvatarsPending } from '../reducers/avatarsReducer.js';
import { getUserDataError, getUserData, getUserDataPending } from '../reducers/userDataReducer.js';
import { getUserPostsError, getUserPosts, getUserPostsPending } from '../reducers/userPostsReducer.js';
import { getConnectPostsError, getConnectPosts, getConnectPostsPending } from '../reducers/connectPostsReducer.js';
import { getToken } from '../utils/CheckLoginTimeOut';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

let isUserPostsLoaded = true;

const countInitialState = {
    regular: 0,
    cdream: 0,
    is_public: 0,
};

function Profile(props) {
    const { lang, themeMode, history, user_id,
        avatars, avatarsPending, avatarsError, fetchAvatars,
        userData, userDataError, userDataPending, fetchUserData,
        userPosts, userPostsError, userPostsPending, fetchUserPosts,
        connectPosts, connectPostsError, connectPostsPending, fetchConnectPosts,
        fetchUpdateUserData } = props;
    if (userDataError) {
        console.log("Profile");
        console.log(userDataError);
        alert("Error");
    }
    if (userPostsError) {
        console.log("Profile");
        console.log(userPostsError);
        alert("Error");
    }
    if (connectPostsError) {
        console.log("Profile");
        console.log(connectPostsError);
        alert("Error");
    }
    if (avatarsError) {
        console.log("Profile");
        console.log(avatarsError);
        alert("Error");
    }

    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [profileid, setProfileId] = React.useState();
    const [openAva, setOpenAva] = React.useState(false);
    const descriptionElementRef = React.useRef(null);
    const [viewMode, setViewMode] = React.useState(false);
    const [postsCount, setPostsCount] = React.useState(countInitialState);
    const [isEditAbout, setIsEditAbout] = React.useState(false);
    const [aboutText, setAboutText] = React.useState(userData.about);
    const [changedAvatar, setChangedAvatar] = React.useState(userData.avatar_id);

    if (!userPostsPending && userPostsError == null && !isUserPostsLoaded && !viewMode) {
        isUserPostsLoaded = true;
        let newPostsCount = postsCount;
        newPostsCount = { ...newPostsCount, regular: Object.keys(userPosts.filter(item => item.post_type === 0 ? item : false)).length };
        newPostsCount = { ...newPostsCount, cdream: Object.keys(userPosts.filter(item => item.post_type === 1 ? item : false)).length };
        newPostsCount = { ...newPostsCount, is_public: Object.keys(userPosts.filter(item => item.is_public === 1 ? item : false)).length };
        setPostsCount(newPostsCount);
    }

    if (!connectPostsPending && connectPostsError == null && !isUserPostsLoaded && viewMode) {
        isUserPostsLoaded = true;
        let newPostsCount = postsCount;
        newPostsCount = { ...newPostsCount, is_public: Object.keys(connectPosts.filter(item => item.is_public === 1 ? item : false)).length };
        setPostsCount(newPostsCount);
    }

    const handleSetAvatarId = (id) => {
        setChangedAvatar(id);
    };

    const setEditAbout = () => {
        setIsEditAbout(true);
    };

    const saveAbout = () => {
        if (userData.about !== aboutText)
            fetchUpdateUserData(profileid, { about: aboutText }, getToken());
        setIsEditAbout(false);
    };

    const handleSetAboutText = (e) => {
        setAboutText(e.target.value);
    };

    const handleClickOpenAva = () => {
        setOpenAva(true);
    };

    const handleCloseAva = () => {
        setChangedAvatar(userData.avatar_id);
        setOpenAva(false);
    };

    const handleSaveAva = () => {
        if (changedAvatar !== userData.avatar_id)
            fetchUpdateUserData(profileid, { avatar_id: changedAvatar }, getToken());
        setOpenAva(false);
    };

    const openUserDreamJournal = () => {
        history.push({
            pathname: "/dreams",
            defaultData: {
                mode: "fromFriend",
                friend_id: profileid,
                prevUrl: "/profile",
            }
        });
    };

    const openUserDreamMap = () => {
        history.push({
            pathname: "/dreammap",
            defaultData: {
                mode: "fromFriend",
                nickName: userData.nickname,
                friend_id: profileid,
                prevUrl: "/profile",
            }
        });
    };

    const loadProfileData = React.useCallback((profileid) => {
        isUserPostsLoaded = false;
        setPostsCount({ ...countInitialState });
        const token = getToken();
        fetchUserData(profileid, token);
        user_id === profileid ? fetchUserPosts(profileid, token) : fetchConnectPosts(profileid, token);
    }, [profileid]);

    React.useEffect(() => {
        if (typeof (props.location.defaultData) !== 'undefined') {
            loadProfileData(props.location.defaultData.friend_id);
            setProfileId(props.location.defaultData.friend_id);
            setViewMode(true);
        }
        else {
            loadProfileData(user_id);
            setProfileId(user_id);
        }

        if (openAva) {
            fetchAvatars();
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, [openAva]);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Dialog open={openAva}
                scroll={'paper'}
                fullWidth={true}
                maxWidth={'md'}
                aria-labelledby="avatar-dialog-title"
                aria-describedby="avatar-dialog-description"
            >
                <DialogTitle id="avatar-dialog-title">
                    {lang.currLang.texts.Avatar}
                </DialogTitle>
                <DialogContent dividers={true}>
                    <Grid container className={`${classes.height12} ${classes.minHeight100px}`} id="avatar-dialog-description" spacing={2}>
                        {!avatarsPending
                            ? avatars.map((item, key) => (
                                <Grid item xs={4} sm={3} key={key}>
                                    <div className={`${classes.relativePosition} ${classes.fullWidth} ${classes.equalHeight}`}>
                                        <ButtonBase onClick={() => handleSetAvatarId(item.id)}
                                            className={`${classes.absolutePosition} ${classes.fullWidth} ${classes.fullHeight} ${classes.topLeft} ${classes.borderRadius50}`}>
                                            <Avatar src={item.url} className={`${classes.absolutePosition} ${classes.fullWidth} ${classes.fullHeight}`} />
                                        </ButtonBase>
                                        {changedAvatar === item.id
                                            ? <CheckCircleIcon className={`${classes.absolutePosition} ${classes.topRight}`} />
                                            : <React.Fragment />
                                        }
                                    </div>
                                </Grid>
                            ))
                            : <div className={`${classes.formControl} ${classes.centerTextAlign}`}>
                                <div className={`${classes.inlineBlock} ${classes.relativePosition}`}>
                                    <CircularProgress />
                                </div>
                                <Typography className={`${classes.relativePosition}`} component="div">
                                    {lang.currLang.texts.Loading}
                                </Typography>
                            </div>
                        }
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAva} color="secondary">
                        {lang.currLang.buttons.cancel}
                    </Button>
                    <Button onClick={handleSaveAva} color="primary">
                        {lang.currLang.buttons.Save}
                    </Button>
                </DialogActions>
            </Dialog>
            <div className={classes.root}>
                <Grid className={`${classes.height12}`}
                    container
                    direction="column"
                    justify="center"
                    alignItems="stretch"
                >
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height11}`} >
                        <Grid className={`${classes.height5} ${classes.relativePosition}`} container >
                            <Grid item xs={12} sm={6} className={`${classes.relativePosition}`} >
                                <IconButton disabled={viewMode ? true : false} className={`${classes.formControl}`} onClick={handleClickOpenAva} >
                                    <Avatar src={userData.avatar_url} className={`${classes.mediumAvatar}`} />
                                </IconButton>
                            </Grid>
                            <Grid item xs={12} sm={6} className={`${classes.relativePosition}`} >
                                <div className={`${classes.formControl}`} >
                                    {!userDataPending
                                        ? <React.Fragment>
                                            <Typography variant="h5" align="center" color="textPrimary">
                                                {userData.nickname}
                                            </Typography>
                                            <Typography variant="body2" align="center" color="textPrimary">
                                                {userData.roles === 0
                                                    ? lang.currLang.texts.Admin
                                                    : userData.roles === 1
                                                        ? lang.currLang.texts.Moderator
                                                        : lang.currLang.texts.User
                                                }
                                            </Typography>
                                        </React.Fragment>
                                        : <div className={`${classes.formControl} ${classes.centerTextAlign}`}>
                                            <div className={`${classes.inlineBlock} ${classes.relativePosition}`}>
                                                <CircularProgress />
                                            </div>
                                            <Typography className={`${classes.relativePosition}`} component="div">
                                                {lang.currLang.texts.Loading}
                                            </Typography>
                                        </div>
                                    }
                                </div>
                            </Grid>
                        </Grid>
                        <Grid className={`${classes.height3} ${classes.relativePosition}`}
                            container
                            direction="row"
                            justify="center"
                            alignItems="stretch"
                        >
                            <Grid item xs={7} >
                                <Grid className={`${classes.height3}`}>
                                    <Typography align="center">
                                        {lang.currLang.texts.InfoDreams}:
                                    </Typography>
                                </Grid>
                                <Grid className={`${classes.height9}`}
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="stretch"
                                >
                                    <Grid className={`${classes.height4}`}
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="stretch"
                                    >
                                        <Grid item xs={6} >
                                            <Typography>
                                                {lang.currLang.texts.Public}:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={1} />
                                        <Grid item xs={2} >
                                            <Typography align="center">
                                                {postsCount.is_public}
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    {!viewMode
                                        ? <React.Fragment>
                                            <Grid className={`${classes.height4}`}
                                                container
                                                direction="row"
                                                justify="center"
                                                alignItems="stretch"
                                            >
                                                <Grid item xs={6} >
                                                    <Typography>
                                                        {lang.currLang.texts.Regular}:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={1} />
                                                <Grid item xs={2} >
                                                    <Typography align="center">
                                                        {postsCount.regular}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                            <Grid className={`${classes.height4}`}
                                                container
                                                direction="row"
                                                justify="center"
                                                alignItems="stretch"
                                            >
                                                <Grid item xs={6}>
                                                    <Typography>
                                                        {lang.currLang.texts.Cdream}:
                                                    </Typography>
                                                </Grid>
                                                <Grid item xs={1} />
                                                <Grid item xs={2} >
                                                    <Typography align="center">
                                                        {postsCount.cdream}
                                                    </Typography>
                                                </Grid>
                                            </Grid>
                                        </React.Fragment>
                                        : <React.Fragment />
                                    }
                                </Grid>
                            </Grid>
                            <Grid item xs={5} className={`${classes.relativePosition}`}>
                                <Grid className={`${classes.height12}`}
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="stretch"
                                >
                                    {!viewMode
                                        ? <React.Fragment />
                                        : <React.Fragment>
                                            <Grid className={`${classes.height6}`} >
                                                <div className={`${classes.relativePosition} ${classes.fullHeight}`}>
                                                    <Button className={`${classes.formControl} ${classes.width10}`}
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={openUserDreamJournal}
                                                    >
                                                        {lang.currLang.buttons.dreamJoirnal}
                                                    </Button>
                                                </div>
                                            </Grid>
                                            <Grid className={`${classes.height6}`} >
                                                <div className={`${classes.relativePosition} ${classes.fullHeight}`}>
                                                    <Button className={`${classes.formControl} ${classes.width10}`}
                                                        variant="contained"
                                                        color="primary"
                                                        onClick={openUserDreamMap}
                                                    >
                                                        {lang.currLang.texts.DreamsMap}
                                                    </Button>
                                                </div>
                                            </Grid>
                                        </React.Fragment>
                                    }
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid className={`${classes.height2} ${classes.relativePosition}`} >
                            <Paper className={`${classes.mainGridDreamsContainer} ${classes.mainGridDreamsBodyItemContainerPaper}`}>
                                {!userDataPending
                                    ? !isEditAbout
                                        ? <React.Fragment>
                                            <div className={`${classes.absolutePosition} ${classes.hiddenOverflowX} ${classes.fullWidth} ${classes.fullHeight} ${classes.topLeft}`}>
                                                <Typography className={`${classes.absolutePosition} ${classes.centerText}`} component="div">
                                                    {userData.about}
                                                </Typography>
                                            </div>
                                            {!viewMode
                                                ? <IconButton size="small" className={`${classes.topLeftCorner}`} onClick={setEditAbout}>
                                                    <Avatar>
                                                        <EditIcon />
                                                    </Avatar>
                                                </IconButton>
                                                : <React.Fragment />
                                            }
                                        </React.Fragment>
                                        : <React.Fragment>
                                            <div className={`${classes.absolutePosition} ${classes.hiddenOverflowX} ${classes.fullWidth} ${classes.fullHeight} ${classes.topLeft}`}>
                                                <InputBase className={`${classes.absolutePosition} ${classes.centerText}`}
                                                    value={aboutText}
                                                    onChange={handleSetAboutText}
                                                    multiline
                                                />
                                            </div>
                                            {!viewMode
                                                ? <IconButton size="small" className={`${classes.topLeftCorner}`} onClick={saveAbout}>
                                                    <Avatar>
                                                        <SaveIcon />
                                                    </Avatar>
                                                </IconButton>
                                                : <React.Fragment />
                                            }
                                        </React.Fragment>
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
                        <Grid className={`${classes.height2} ${classes.relativePosition}`} />
                        {/* <Grid container className={`${classes.height1} ${classes.relativePosition}`} >
                            <Paper className={`${classes.mainGridDreamsContainer} ${classes.mainGridDreamsBodyItemContainerPaper}`} >
                                <div className={classes.avatarRoot} >
                                </div>
                                <IconButton size="small" className={`${classes.topLeftCorner}`}>
                                    <EditIcon />
                                </IconButton>
                            </Paper>
                        </Grid> */}
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
                                    onClick={() => { history.push("/aeronauts") }}
                                >
                                    {lang.currLang.buttons.Back}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </MuiThemeProvider>
    )
}

Profile.propTypes = {
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    user_id: PropTypes.number.isRequired,
    userDataError: PropTypes.object.isRequired,
    userData: PropTypes.object.isRequired,
    userDataPending: PropTypes.object.isRequired,
    avatarsError: PropTypes.object.isRequired,
    avatars: PropTypes.object.isRequired,
    avatarsPending: PropTypes.object.isRequired,
    userPostsError: PropTypes.object.isRequired,
    userPosts: PropTypes.object.isRequired,
    userPostsPending: PropTypes.object.isRequired,
    connectPostsError: PropTypes.object.isRequired,
    connectPosts: PropTypes.object.isRequired,
    connectPostsPending: PropTypes.object.isRequired,
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        user_id: store.auth.user.id,
        avatarsError: getAvatarsError(store),
        avatars: getAvatars(store),
        avatarsPending: getAvatarsPending(store),
        userDataError: getUserDataError(store),
        userData: getUserData(store),
        userDataPending: getUserDataPending(store),
        userPostsError: getUserPostsError(store),
        userPosts: getUserPosts(store),
        userPostsPending: getUserPostsPending(store),
        connectPostsError: getConnectPostsError(store),
        connectPosts: getConnectPosts(store),
        connectPostsPending: getConnectPostsPending(store),
    }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchAvatars: fetchAvatarsAction,
    fetchUserData: fetchUserDataAction,
    fetchUserPosts: fetchUserPostsAction,
    fetchConnectPosts: fetchConnectPostsAction,
    fetchUpdateUserData: fetchUpdateUserDataAction,
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);