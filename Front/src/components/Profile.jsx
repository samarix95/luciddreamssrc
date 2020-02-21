import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import ButtonBase from '@material-ui/core/ButtonBase';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { useStyles } from '../styles/Styles.js';
import { instance } from './Config';

import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import EditIcon from '@material-ui/icons/Edit';
import SaveIcon from '@material-ui/icons/Save';

const avatars = [
    {
        id: 1,
        url: 'https://api.adorable.io/avatars/227/1.png',
    },
    {
        id: 2,
        url: 'https://api.adorable.io/avatars/227/2.png',
    },
    {
        id: 3,
        url: 'https://api.adorable.io/avatars/227/3.png',
    },
    {
        id: 4,
        url: 'https://api.adorable.io/avatars/227/4.png',
    },
    {
        id: 5,
        url: 'https://api.adorable.io/avatars/227/5.png',
    },
    {
        id: 6,
        url: 'https://api.adorable.io/avatars/227/6.png',
    },
    {
        id: 7,
        url: 'https://api.adorable.io/avatars/227/7.png',
    },
    {
        id: 8,
        url: 'https://api.adorable.io/avatars/227/8.png',
    },
    {
        id: 9,
        url: 'https://api.adorable.io/avatars/227/9.png',
    },
    {
        id: 10,
        url: 'https://api.adorable.io/avatars/227/10.png',
    },
    {
        id: 11,
        url: 'https://api.adorable.io/avatars/227/11.png',
    },
    {
        id: 12,
        url: 'https://api.adorable.io/avatars/227/12.png',
    },
    {
        id: 13,
        url: 'https://api.adorable.io/avatars/227/13.png',
    },
    {
        id: 14,
        url: 'https://api.adorable.io/avatars/227/14.png',
    },
    {
        id: 15,
        url: 'https://api.adorable.io/avatars/227/15.png',
    },
    {
        id: 16,
        url: 'https://api.adorable.io/avatars/227/16.png',
    },
];

function Profile(props) {
    const { lang, themeMode, history, user_id, user_nickname, user_role } = props;
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [openAva, setOpenAva] = React.useState(false);
    const descriptionElementRef = React.useRef(null);
    const [editMode, setEditMode] = React.useState(false);
    const [viewMode, setViewMode] = React.useState(false);
    const [userData, setUserData] = React.useState({
        about: null,
        fb: null,
        ig: null,
    });
    const [isAboutLoad, setisAboutLoad] = React.useState(true);
    const [isEditAbout, setIsEditAbout] = React.useState(false);
    const [aboutText, setAboutText] = React.useState("");
    const [changedAvatar, setChangedAvatar] = React.useState(null);

    const handleEditModeOn = () => {
        setEditMode(true);
    };

    const handleEditModeOff = () => {
        setEditMode(false);
    };

    const handleSetAvatarId = (id) => {
        setChangedAvatar(id);
    };

    const setEditAbout = () => {
        setIsEditAbout(true);
    };

    const saveAbout = () => {
        if (userData.about !== aboutText) {
            setisAboutLoad(true);
            const data = {
                id: user_id,
                nickname: user_nickname,
                about: aboutText,
            };

            instance
                .post('/actions/users/updateuserdata', data)
                .then(res => {
                    let newUserData = userData;
                    newUserData = { ...newUserData, about: aboutText };
                    setUserData(newUserData);
                    setisAboutLoad(false);
                })
                .catch(err => {
                    alert("Cant update profile");
                    setisAboutLoad(false);
                });
        }
        setIsEditAbout(false);
    };

    const handleSetAboutText = (e) => {
        setAboutText(e.target.value);
    };

    const handleClickOpenAva = () => {
        setOpenAva(true);
    };

    const handleCloseAva = () => {
        setOpenAva(false);
    };

    React.useEffect(() => {
        if (typeof (props.location.defaultData) !== 'undefined') {
            setViewMode(true);
        }
        instance
            .post('/actions/users/getuserdata', { id: user_id, })
            .then(res => {
                let newUserData = userData;

                if (res.data.result.about) {
                    newUserData = { ...newUserData, about: res.data.result.about };
                    setAboutText(res.data.result.about);
                }
                else {
                    newUserData = { ...newUserData, about: "" };
                    setAboutText("");
                }

                newUserData = { ...newUserData, fb: res.data.result.fb };
                newUserData = { ...newUserData, ig: res.data.result.ig };
                setUserData(newUserData);
                setisAboutLoad(false);
            });
        if (openAva) {
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
                    <Grid className={`${classes.height12}`}
                        id="avatar-dialog-description"
                        container
                        spacing={2}
                    >
                        {avatars.map((item, key) => (
                            <Grid item xs={4} sm={3} key={key}>
                                <div style={{
                                    position: "relative",
                                    width: "100%",
                                    height: 0,
                                    paddingBottom: "100%",
                                }}>
                                    <ButtonBase onClick={() => handleSetAvatarId(item.id)}
                                        style={{
                                            position: "absolute",
                                            top: 0,
                                            left: 0,
                                            width: "100%",
                                            height: "100%",
                                            borderRadius: "50%",
                                        }}
                                    >
                                        <Avatar src={item.url}
                                            style={{
                                                position: "absolute",
                                                width: "100%",
                                                height: "100%",
                                            }}
                                        />
                                    </ButtonBase>
                                    {changedAvatar === item.id
                                        ? <CheckCircleIcon style={{
                                            position: "absolute",
                                            top: 0,
                                            right: 0,
                                        }} />
                                        : <React.Fragment />
                                    }

                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseAva} color="secondary">
                        {lang.currLang.buttons.cancel}
                    </Button>
                    <Button onClick={handleEditModeOn} color="primary">
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
                        <Grid container className={`${classes.height5} ${classes.relativePosition}`} >
                            <Grid item xs={12} sm={6} className={`${classes.height6} ${classes.relativePosition}`} >
                                <IconButton disabled={editMode ? false : true} className={`${classes.formControl}`} onClick={handleClickOpenAva} >
                                    <Avatar src="/images/example.jpg"
                                        style={{
                                            width: "120px",
                                            height: "120px",
                                        }}
                                    />
                                </IconButton>
                            </Grid>
                            <Grid item xs={12} sm={6} className={`${classes.height6} ${classes.relativePosition}`} >
                                <div className={`${classes.formControl}`} >
                                    <Typography variant="h5" align="center" color="textPrimary">
                                        {user_nickname}
                                    </Typography>
                                    <Typography variant="body2" align="center" color="textPrimary">
                                        {user_role}
                                    </Typography>
                                    <Typography variant="body2" align="center" color="textPrimary">
                                        SUMMARY DAYS
                                    </Typography>
                                </div>
                            </Grid>
                        </Grid>
                        <Grid className={`${classes.height3} ${classes.relativePosition}`}
                            container
                            direction="row"
                            justify="center"
                            alignItems="stretch"
                        >
                            <Grid item xs={6} >
                                <Grid className={`${classes.height12}`}
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="stretch"
                                >
                                    <Grid className={`${classes.height3}`}
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="stretch"
                                    >
                                        <Grid item xs={6}>
                                            <Typography>
                                                Regular:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography>
                                                0
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid className={`${classes.height3}`}
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="stretch"
                                    >
                                        <Grid item xs={6}>
                                            <Typography>
                                                C-dreams:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography>
                                                0
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid className={`${classes.height3}`}
                                        container
                                        direction="row"
                                        justify="center"
                                        alignItems="stretch"
                                    >
                                        <Grid item xs={6}>
                                            <Typography>
                                                Total:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={3}>
                                            <Typography>
                                                0
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            <Grid item xs={3} className={`${classes.relativePosition}`}>
                                <div className={`${classes.formControl}`} >
                                    <Button //className={classes.actionButton}
                                        variant="contained"
                                        color="secondary"
                                    //onClick={() => { history.push("/luciddreams") }}
                                    >
                                        РљРЅРѕРїРєР°
                                    </Button>
                                </div>
                            </Grid>

                        </Grid>
                        <Grid container className={`${classes.height2} ${classes.relativePosition}`} >
                            <Paper className={`${classes.mainGridDreamsContainer} ${classes.mainGridDreamsBodyItemContainerPaper}`}>
                                {!isAboutLoad
                                    ? !isEditAbout
                                        ? <React.Fragment>
                                            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflowX: "hidden" }}>
                                                <Typography component="div" style={{ position: "absolute", top: 0, left: "50%", width: "90%", transform: "translate(-50%)", marginTop: 10, marginBottom: 10 }}>
                                                    {userData.about}
                                                </Typography>
                                            </div>
                                            {!viewMode
                                                ? editMode
                                                    ? <IconButton size="small" className={`${classes.topLeftCorner}`} onClick={setEditAbout}>
                                                        <EditIcon />
                                                    </IconButton>
                                                    : <React.Fragment />
                                                : <React.Fragment />
                                            }
                                        </React.Fragment>
                                        : <React.Fragment>
                                            <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", overflowX: "hidden" }}>
                                                <TextField style={{ position: "absolute", top: 0, left: "50%", width: "90%", transform: "translate(-50%)", marginTop: 10, marginBottom: 10 }}
                                                    value={aboutText}
                                                    onChange={handleSetAboutText}
                                                    multiline
                                                />
                                            </div>
                                            {!viewMode
                                                ? editMode
                                                    ? <IconButton size="small" className={`${classes.topLeftCorner}`} onClick={saveAbout}>
                                                        <SaveIcon />
                                                    </IconButton>
                                                    : <React.Fragment />
                                                : <React.Fragment />
                                            }
                                        </React.Fragment>
                                    : <div className={`${classes.formControl} ${classes.centerTextAlign}`} >
                                        <div className={`${classes.inlineBlock} ${classes.relativePosition}`} >
                                            <CircularProgress />
                                        </div>
                                        <Typography className={`${classes.relativePosition}`} component="div" >
                                            {lang.currLang.texts.Loading}
                                        </Typography>
                                    </div>
                                }
                            </Paper>
                        </Grid>
                        <Grid container className={`${classes.height1} ${classes.relativePosition}`} ></Grid>
                        <Grid container className={`${classes.height1} ${classes.relativePosition}`} >
                            <Paper className={`${classes.mainGridDreamsContainer} ${classes.mainGridDreamsBodyItemContainerPaper}`}>
                                <div className={classes.avatarRoot}>
                                    {/* {tags.map((tag, key) =>
                                        tag[0]
                                            ? <Avatar className={classes.smallAvatar}
                                                src={tag[3]}
                                                style={palette.type === 'dark'
                                                    ? {
                                                        filter: 'invert(1)',
                                                    }
                                                    : {}}
                                            />
                                            : ''
                                    )} */}
                                </div>
                                <IconButton size="small" className={`${classes.topLeftCorner}`}>
                                    <EditIcon />
                                </IconButton>
                            </Paper>
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
                                    {lang.currLang.buttons.close}
                                </Button>
                            </Grid>
                            {!viewMode
                                ? <Grid item>
                                    {!editMode
                                        ? <Button className={classes.actionButton}
                                            onClick={handleEditModeOn}
                                            variant="contained"
                                            color="secondary"
                                        >
                                            {lang.currLang.buttons.Edit}
                                        </Button>
                                        : <Button className={classes.actionButton}
                                            onClick={handleEditModeOff}
                                            variant="contained"
                                            color="secondary"
                                        >
                                            {lang.currLang.buttons.Save}
                                        </Button>
                                    }
                                </Grid>
                                : <React.Fragment />
                            }
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
    user_nickname: PropTypes.number.isRequired,
    user_role: PropTypes.number.isRequired,
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        user_id: store.auth.user.id,
        user_nickname: store.auth.user.nickname,
        user_role: store.auth.user.roles,
    }
};

const mapDispatchToProps = dispatch => {
    return {
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Profile);