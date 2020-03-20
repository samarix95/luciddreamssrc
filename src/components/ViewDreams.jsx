import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import DialogContentText from "@material-ui/core/DialogContentText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from '@material-ui/core/Typography';
import RadioGroup from "@material-ui/core/RadioGroup";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import Avatar from "@material-ui/core/Avatar";
import Select from "@material-ui/core/Select";
import Button from '@material-ui/core/Button';
import Radio from "@material-ui/core/Radio";
import Input from "@material-ui/core/Input";
import Grid from '@material-ui/core/Grid';
import Chip from "@material-ui/core/Chip";

import Skeleton from '@material-ui/lab/Skeleton';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import DreamCard from './muiltiple/DreamCard.jsx';
import { useStyles } from '../styles/Styles.js';
import { instance, fetchTagsAction, fetchUserPostsAction, fetchConnectPostsAction } from '../Config';
import { getTagsError, getTags, getTagsPending } from '../reducers/tagsReducer.js';
import { getUserPostsError, getUserPosts, getUserPostsPending } from '../reducers/userPostsReducer.js';
import { getConnectPostsError, getConnectPosts, getConnectPostsPending } from '../reducers/connectPostsReducer.js';
import { getToken } from '../utils/CheckLoginTimeOut';

let isDreamsLoading = true;

function ViewDreams(props) {
    const { lang, themeMode, history, auth,
        tags, tagsError, tagsPending, fetchTags,
        userPosts, userPostsError, userPostsPending, fetchUserPosts,
        connectPosts, connectPostsError, connectPostsPending, fetchConnectPosts } = props;
        
    if (tagsError) {
        console.log("ViewDreams");
        console.log(tagsError);
        alert("Error");
    }
    if (userPostsError) {
        console.log("ViewDreams");
        console.log(userPostsError);
        alert("Error");
    }
    if (connectPostsError) {
        console.log("ViewDreams");
        console.log(connectPostsError);
        alert("Error");
    }

    const muiTheme = createMuiTheme(themeMode);
    const classes = useStyles();
    const [viewMode, setViewMode] = React.useState(false);
    const [dreams, setDreams] = React.useState([]);
    const [openDialog, setOpenDialog] = React.useState(false);
    const [openConfirm, setOpenConfirm] = React.useState(false);
    const [locationChecked, setLocationChecked] = React.useState(false);
    const [selectedLocations, setSelectedLocations] = React.useState(null);
    const [postType, setPostType] = React.useState(2);
    const [filterData, setFilterData] = React.useState({
        location: null,
        type: 2
    });
    const [confirmData, setConfirmData] = React.useState({
        id: null,
        header: "",
        body: "",
        commit: "",
        action: "",
        isPublic: null
    });

    if (!userPostsPending && userPostsError == null && !isDreamsLoading && !viewMode) {
        isDreamsLoading = true;
        setDreams(userPosts);
    }
    if (!connectPostsPending && connectPostsError == null && !isDreamsLoading && viewMode) {
        isDreamsLoading = true;
        setDreams(connectPosts);
    }

    const openFilter = () => {
        setOpenDialog(true);
    };

    const closeFilter = () => {
        setOpenDialog(false);
    };

    const resetFilter = () => {
        setLocationChecked(false);
        setSelectedLocations(null);
        setPostType(2);
        let newFilterData = filterData;
        newFilterData = { ...newFilterData, location: null };
        newFilterData = { ...newFilterData, type: 2 };
        setFilterData(newFilterData);
        closeFilter();
    };

    const applyFilter = () => {
        let newFilterData = filterData;

        if (locationChecked) newFilterData = { ...newFilterData, location: selectedLocations };
        else newFilterData = { ...newFilterData, location: null };

        newFilterData = { ...newFilterData, type: postType };
        setFilterData(newFilterData);
        closeFilter();
    };

    const handleLocationChecked = (event) => {
        setLocationChecked(event.target.checked);
    };

    const handleChangeLocations = (event) => {
        setSelectedLocations(event.target.value);
    };

    const handleChangepostType = (event) => {
        setPostType(parseInt(event.target.value));
    };

    const loadPosts = React.useCallback((user_id = auth.user.id) => {
        isDreamsLoading = false;
        fetchTags();
        const token = getToken();
        if (user_id === auth.user.id) {
            setViewMode(false);
            fetchUserPosts(user_id, token)
        }
        else {
            setViewMode(true);
            fetchConnectPosts(user_id, token);
        }
    }, [auth.user.id]);
    
    React.useEffect(() => {
        if (typeof (props.location.defaultData) !== 'undefined') {
            if (props.location.defaultData.mode === "fromMap") {
                let newFilterData = filterData;
                newFilterData = { ...newFilterData, location: props.location.defaultData.location.name_eng };
                setFilterData(newFilterData);
                setLocationChecked(true);
                lang.currLang.current === "Ru" ? setSelectedLocations(props.location.defaultData.location.name_rus) : setSelectedLocations(props.location.defaultData.location.name_eng);
                loadPosts();
            }
            if (props.location.defaultData.mode === "fromFriend") {
                loadPosts(props.location.defaultData.friend_id);
            }
        }
        else {
            loadPosts();
        }
    }, [loadPosts]);

    const closeAlert = () => {
        setOpenConfirm(false);
    };

    const confirmAction = (action) => {
        switch (action) {
            case 'deleteOk':
                instance.post('/actions/users/deletepost', { post_id: confirmData.id })
                    .then(res => {
                        setSnackbar({
                            type: SET_SNACKBAR_MODE,
                            snackbar: {
                                open: true,
                                variant: 'success',
                                message: lang.currLang.texts.success
                            }
                        });
                        setOpenConfirm(false);
                        loadPosts();
                    })
                    .catch(err => {
                        setSnackbar({
                            type: SET_SNACKBAR_MODE,
                            snackbar: {
                                open: true,
                                variant: 'error',
                                message: lang.currLang.texts.CantDeletePost
                            }
                        });
                        setOpenConfirm(false);
                    });
                break;
            case 'publicOk':
                //TODO Починить
                console.log('hello')
                setOpenConfirm(false);
                console.log(confirmData.isPublic)
                const newPublic = confirmData.isPublic ? 0 : 1;
                instance.post('/actions/users/updatepost', { post_id: confirmData.id, newPublic: newPublic })
                    .then(res => {
                        //setPublicChecked(false);
                        setSnackbar({
                            type: SET_SNACKBAR_MODE,
                            snackbar: {
                                open: true,
                                variant: 'success',
                                message: lang.currLang.texts.success
                            }
                        });
                        loadPosts();
                        console.log('hello1')
                    })
                    .catch(err => {
                        //setPublicChecked(true);
                        console.log('hello2')
                    });
                break;
        }
    };

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Dialog open={openDialog}
                onClose={closeFilter}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {lang.currLang.buttons.Filter}
                </DialogTitle>
                <DialogContent>
                    <Grid container
                        className={`${classes.height12}`}
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <Grid item className={`${classes.mainGridBodyItem} ${classes.height6} ${classes.margin}`}>
                            <Grid container
                                direction="row"
                                justify="center"
                                alignItems="stretch"
                            >
                                <Grid item xs={3} className={`${classes.relativePosition}`}>
                                    <Checkbox className={classes.centerButton}
                                        color="primary"
                                        checked={locationChecked}
                                        onChange={handleLocationChecked}
                                        inputProps={{ 'aria-Location': 'primary checkbox' }}
                                    />
                                </Grid>
                                <Grid item xs={9}>
                                    <FormControl className={`${classes.fullWidth}`} disabled={!locationChecked}>
                                        <InputLabel id="location-chip-label">
                                            {lang.currLang.texts.tags}
                                        </InputLabel>
                                        <Select
                                            labelId="location-chip-label"
                                            id="location-chip"
                                            value={selectedLocations}
                                            onChange={handleChangeLocations}
                                            input={
                                                <Input id="select-location-chip" />
                                            }
                                            renderValue={selected =>
                                                <div className={classes.chips}>
                                                    <Chip size="small"
                                                        avatar={
                                                            tags.length
                                                                ? <Avatar src={tags.find(tags => tags.name_rus === selectedLocations || tags.name_eng === selectedLocations).img_url} />
                                                                : null
                                                        }
                                                        key={selectedLocations}
                                                        label={selectedLocations}
                                                        className={classes.chip}
                                                    />
                                                </div>
                                            }
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 48 * 5 + 8,
                                                        width: 250
                                                    }
                                                }
                                            }}
                                        >
                                            {Object
                                                .keys(tags)
                                                .map(item =>
                                                    <MenuItem key={tags[item].id + ' chip'}
                                                        value={lang.currLang.current === "Ru" ? tags[item].name_rus : tags[item].name_eng}
                                                    >
                                                        {lang.currLang.current === "Ru" ? tags[item].name_rus : tags[item].name_eng}
                                                    </MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item className={`${classes.mainGridBodyItem} ${classes.height6} ${classes.margin}`}>
                            <RadioGroup className={`${classes.height12} ${classes.margin}`}
                                aria-label="post-type"
                                value={postType}
                                onChange={handleChangepostType}
                            >
                                <FormControlLabel
                                    value={0}
                                    control={<Radio color="primary" />}
                                    label={lang.currLang.texts.Dream}
                                />
                                <FormControlLabel
                                    value={1}
                                    control={<Radio color="primary" />}
                                    label={lang.currLang.texts.Cdream}
                                />
                                <FormControlLabel
                                    value={2}
                                    control={<Radio color="primary" />}
                                    label={lang.currLang.texts.All}
                                />
                            </RadioGroup>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={closeFilter} >
                        {lang.currLang.texts.cancel}
                    </Button>
                    <Button color="primary" onClick={resetFilter} >
                        {lang.currLang.buttons.Reset}
                    </Button>
                    <Button color="primary" autoFocus onClick={applyFilter} >
                        {lang.currLang.buttons.Apply}
                    </Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openConfirm}
                onClose={closeAlert}
                aria-labelledby="confirm-dialog-title"
                aria-describedby="confirm-dialog-description"
            >
                <DialogTitle id="confirm-dialog-title" >
                    {confirmData.header}
                </DialogTitle>
                <DialogContent >
                    <DialogContentText id="confirm-dialog-description" >
                        {confirmData.body}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button color="primary" onClick={closeAlert} >
                        {lang.currLang.buttons.cancel}
                    </Button>
                    <Button color="primary" onClick={() => confirmAction(confirmData.action)} >
                        {confirmData.commit}
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
                    <Grid item className={`${classes.height11} ${classes.width12} ${classes.autoOverflowX} ${classes.relativePosition}`} >
                        {viewMode && !connectPostsPending || !viewMode && !userPostsPending
                            ? dreams.length !== 0
                                ? <Grid className={`${classes.absolutePosition} ${classes.width12}`}
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="stretch"
                                >
                                    {tags.length !== 0
                                        ? dreams.filter(item => filterData.location ? item.tags.includes(item.tags.find(tag => tag[0] === tags.find(tags => tags.name_eng === filterData.location || tags.name_rus === filterData.location).id.toString())) : item)
                                            .filter(item => filterData.type === 2 ? item : item.post_type === filterData.type)
                                            .map((item, key) => (
                                                <DreamCard
                                                    mode={
                                                        typeof props.location.defaultData === 'undefined'
                                                            ? null
                                                            : props.location.defaultData.mode
                                                    }
                                                    friend_id={
                                                        typeof props.location.defaultData === 'undefined'
                                                            ? null
                                                            : props.location.defaultData.friend_id
                                                    }
                                                    item={item}
                                                    key={key}
                                                    history={history}
                                                    loadPosts={loadPosts}
                                                    setOpenConfirm={setOpenConfirm}
                                                    setConfirmData={setConfirmData}
                                                />
                                            ))
                                        : ''
                                    }
                                </Grid>
                                : <div>
                                    <div className={classes.divDreamsNotFound} />
                                    <div className={`${classes.divDreamsNotFound} ${classes.divDreamsNotFoundImg}`} />
                                    <div className={classes.divDreamsNotFound}>
                                        <Typography>
                                            {lang.currLang.texts.NoDreams}
                                        </Typography>
                                    </div>
                                </div>
                            : <React.Fragment>
                                <Skeleton variant="rect" className={`${classes.relativePosition} ${classes.width12} ${classes.height3}`}>
                                    <div className={`${classes.relativePosition} ${classes.height1}`} />
                                    <Skeleton variant="text" className={`${classes.relativePosition} ${classes.width10}`} />
                                    <div className={`${classes.relativePosition} ${classes.height4}`} />
                                    <Skeleton variant="text" className={`${classes.relativePosition} ${classes.width11} ${classes.horizontalCenter}`} />
                                    <div className={`${classes.relativePosition} ${classes.height1}`} />
                                    <Skeleton variant="text" className={`${classes.relativePosition} ${classes.width11} ${classes.horizontalCenter}`} />
                                </Skeleton>
                                <div className={`${classes.relativePosition} ${classes.width12} ${classes.height1}`} />
                                <Skeleton variant="rect" className={`${classes.relativePosition} ${classes.width12} ${classes.height3}`}>
                                    <div className={`${classes.relativePosition} ${classes.height1}`} />
                                    <Skeleton variant="text" className={`${classes.relativePosition} ${classes.width10}`} />
                                    <div className={`${classes.relativePosition} ${classes.height4}`} />
                                    <Skeleton variant="text" className={`${classes.relativePosition} ${classes.width11} ${classes.horizontalCenter}`} />
                                    <div className={`${classes.relativePosition} ${classes.height1}`} />
                                    <Skeleton variant="text" className={`${classes.relativePosition} ${classes.width11} ${classes.horizontalCenter}`} />
                                </Skeleton>
                                <div className={`${classes.relativePosition} ${classes.width12} ${classes.height1}`} />
                                <Skeleton variant="rect" className={`${classes.relativePosition} ${classes.width12} ${classes.height3}`}>
                                    <div className={`${classes.relativePosition} ${classes.height1}`} />
                                    <Skeleton variant="text" className={`${classes.relativePosition} ${classes.width10}`} />
                                    <div className={`${classes.relativePosition} ${classes.height4}`} />
                                    <Skeleton variant="text" className={`${classes.relativePosition} ${classes.width11} ${classes.horizontalCenter}`} />
                                    <div className={`${classes.relativePosition} ${classes.height1}`} />
                                    <Skeleton variant="text" className={`${classes.relativePosition} ${classes.width11} ${classes.horizontalCenter}`} />
                                </Skeleton>
                                <div className={`${classes.relativePosition} ${classes.width12} ${classes.height1}`} />
                            </React.Fragment>
                        }
                    </Grid>
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height1}`}>
                        <Grid className={`${classes.relativePosition} ${classes.verticalCenter}`}
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                        >
                            <Grid item>
                                <Button className={classes.actionButton}
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                        typeof (props.location.defaultData) !== 'undefined'
                                            ? props.location.defaultData.mode === "fromFriend"
                                                ? history.push({
                                                    pathname: props.location.defaultData.prevUrl,
                                                    defaultData: {
                                                        friend_id: props.location.defaultData.friend_id,
                                                    }
                                                })
                                                : history.push(props.location.defaultData.prevUrl)
                                            : history.push("/")
                                    }}
                                >
                                    {lang.currLang.buttons.close}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button className={classes.actionButton}
                                    variant="outlined"
                                    color="primary"
                                    onClick={openFilter}
                                >
                                    {lang.currLang.buttons.Filter}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </MuiThemeProvider >
    )
}

ViewDreams.propTypes = {
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    tagsError: PropTypes.object.isRequired,
    tags: PropTypes.object.isRequired,
    tagsPending: PropTypes.object.isRequired,
    userPostsError: PropTypes.object.isRequired,
    userPosts: PropTypes.object.isRequired,
    userPostsPending: PropTypes.object.isRequired,
    connectPostsError: PropTypes.object.isRequired,
    connectPosts: PropTypes.object.isRequired,
    connectPostsPending: PropTypes.object.isRequired
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        auth: store.auth,
        tagsError: getTagsError(store),
        tags: getTags(store),
        tagsPending: getTagsPending(store),
        userPostsError: getUserPostsError(store),
        userPosts: getUserPosts(store),
        userPostsPending: getUserPostsPending(store),
        connectPostsError: getConnectPostsError(store),
        connectPosts: getConnectPosts(store),
        connectPostsPending: getConnectPostsPending(store)
    }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchTags: fetchTagsAction,
    fetchUserPosts: fetchUserPostsAction,
    fetchConnectPosts: fetchConnectPostsAction
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewDreams);