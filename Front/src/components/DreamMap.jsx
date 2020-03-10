import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import { TransformWrapper, TransformComponent } from '../../node_modules/react-zoom-pan-pinch/dist/index.js';

import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';

import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';

import { fetchTagsAction, fetchUserPostsAction, fetchUserMapAction } from '../Config.js';
import { getTagsError, getTags, getTagsPending } from '../reducers/tagsReducer.js';
import { getUserPostsError, getUserPosts, getUserPostsPending } from '../reducers/userPostsReducer.js';
import { getUserMapError, getUserMap, getUserMapPending } from '../reducers/userMapReducer.js';
import { getToken } from '../utils/CheckLoginTimeOut';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MapCell from './muiltiple/MapCell.jsx';
import { useStyles } from '../styles/Styles.js';

const cellWidth = (window.innerWidth - 32) / 20;
let isPostsLoading = true;
let isMapLoaded = true;

function DreamMap(props) {
    const { lang, themeMode, history, user_id, tags, tagsError, tagsPending, fetchTags, userPosts, userPostsError, userPostsPending, fetchUserPosts, userMap, userMapError, userMapPending, fetchUserMap } = props;
    if (tagsError) {
        console.log("DreamMap");
        console.log(tagsError);
        alert("Error");
    }
    if (userPostsError) {
        console.log("DreamMap");
        console.log(userPostsError);
        alert("Error");
    }
    if (userMapError) {
        console.log("DreamMap");
        console.log(userMapError);
        alert("Error");
    }

    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [dreamMap, setDreamMap] = React.useState(null);
    const [posts, setPosts] = React.useState(null);
    const [isViewMode, setIsViewMode] = React.useState(false);

    if (!userPostsPending && userPostsError == null && !isPostsLoading && !isViewMode) {
        isPostsLoading = true;
        setPosts(userPosts);
    }
    if (!userMapPending && userMapError == null && !isMapLoaded) {
        isMapLoaded = true;
        setDreamMap(JSON.parse(userMap));
    }

    const createTable = () => {
        let table = [];
        let i = 0;
        let j = 0;

        Object.keys(dreamMap).forEach(row => {
            let rows = [];
            Object.keys(dreamMap[row]).forEach(col => {
                rows.push(
                    <MapCell key={'cell' + i + j}
                        i={i}
                        j={j}
                        cellWidth={cellWidth}
                        dreamMap={dreamMap}
                        id={dreamMap[row][col].id}
                        locations={tags}
                        history={history}
                        user_id={user_id}
                        posts={posts}
                        viewMode={isViewMode}
                    />
                );
                i++;
            })
            table.push(
                <tr key={'row' + j} >
                    {rows}
                </tr>
            );
            j++;
            i = 0;
        });

        return table;
    };

    const loadMap = React.useCallback((user_id) => {
        isMapLoaded = false;
        fetchTags();
        fetchUserMap(user_id, getToken());
    }, [user_id]);

    const getPosts = React.useCallback(() => {
        isPostsLoading = false;
        fetchUserPosts(user_id, getToken());
    }, [user_id]);

    React.useEffect(() => {
        if (typeof (props.location.defaultData) !== 'undefined') {
            if (props.location.defaultData.mode === "fromFriend") {
                setIsViewMode(true);
                loadMap(props.location.defaultData.friend_id);
            }
        }
        else {
            loadMap(user_id);
            getPosts();
        }
    }, [loadMap, getPosts]);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <div className={classes.root}>
                <Grid container
                    className={`${classes.height12}`}
                    direction="column"
                    justify="center"
                    alignItems="stretch"
                >
                    <Grid item className={`${classes.hiddenOverflow} ${classes.height2} ${classes.relativePosition}`} align="center">
                        <Typography variant='h6' component='div' className={`${classes.centerButton}`}>
                            {lang.currLang.texts.DreamsMap} {typeof (props.location.defaultData) !== "undefined" ? " " + props.location.defaultData.nickName : ""}
                        </Typography>
                    </Grid>
                    <Grid item className={`${classes.hiddenOverflow} ${classes.height9}`}>
                        <div style={{ padding: 16 }} className={`${classes.formControl} ${classes.fullMinWidthAbs}`}>
                            {userMapPending
                                ? <div className={`${classes.formControl} ${classes.centerTextAlign}`} >
                                    <div className={`${classes.inlineBlock} ${classes.relativePosition}`} >
                                        <CircularProgress />
                                    </div>
                                    <Typography className={`${classes.relativePosition}`} component="div" >
                                        {lang.currLang.texts.Loading}
                                    </Typography>
                                </div>
                                : <TransformWrapper
                                    defaultScale={1.5}
                                    options={{
                                        minScale: 0.5,
                                        maxScale: 2.5,
                                    }}
                                    zoomIn={{
                                        step: 10,
                                    }}
                                    zoomOut={{
                                        step: 10,
                                    }}
                                    doubleClick={{
                                        disabled: true,
                                    }}
                                >
                                    {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
                                        <React.Fragment>
                                            <TransformComponent>
                                                <table style={{ borderCollapse: 'collapse' }} >
                                                    <tbody>
                                                        {dreamMap !== null
                                                            ? createTable()
                                                            : <tr>
                                                                <td />
                                                            </tr>
                                                        }
                                                    </tbody>
                                                </table>
                                            </TransformComponent>
                                            <Grid container
                                                className={"tools"}
                                                direction="row"
                                                justify="space-evenly"
                                                alignItems="center"
                                                style={{ marginTop: 16 }}
                                            >
                                                <Grid item xs={2} align="center" />
                                                <Grid item xs={2} align="center">
                                                    <Fab size="small" onClick={zoomOut}>
                                                        <ZoomOutIcon />
                                                    </Fab>
                                                </Grid>
                                                <Grid item xs={4} align="center" >
                                                    <Fab size="small" onClick={resetTransform} >
                                                        <ZoomOutMapIcon />
                                                    </Fab>
                                                </Grid>
                                                <Grid item xs={2} align="center">
                                                    <Fab size="small" onClick={zoomIn} >
                                                        <ZoomInIcon />
                                                    </Fab>
                                                </Grid>
                                                <Grid item xs={2} align="center" />
                                            </Grid>
                                        </React.Fragment>
                                    )}
                                </TransformWrapper>
                            }
                        </div>
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
                                    onClick={() => {
                                        typeof (props.location.defaultData) !== 'undefined'
                                            ? props.location.defaultData.mode === "fromFriend"
                                                ? history.push({
                                                    pathname: props.location.defaultData.prevUrl,
                                                    defaultData: {
                                                        friend_id: props.location.defaultData.friend_id,
                                                        prevUrl: "/dreammap",
                                                    }
                                                })
                                                : history.push(props.location.defaultData.prevUrl)
                                            : history.push("/")
                                    }}
                                >
                                    {lang.currLang.buttons.Back}
                                </Button>
                            </Grid>
                            {isViewMode
                                ? <React.Fragment />
                                : <Grid item>
                                    <Button className={classes.actionButton}
                                        variant="contained"
                                        color="primary"
                                        onClick={() => { history.push("/addlocation") }}
                                    >
                                        {lang.currLang.buttons.add}
                                    </Button>
                                </Grid>
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </div >
        </MuiThemeProvider >
    )
}

DreamMap.propTypes = {
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    user_id: PropTypes.number.isRequired,
    tagsError: PropTypes.object.isRequired,
    tags: PropTypes.object.isRequired,
    tagsPending: PropTypes.object.isRequired,
    userPostsError: PropTypes.object.isRequired,
    userPosts: PropTypes.object.isRequired,
    userPostsPending: PropTypes.object.isRequired,
    userMapError: PropTypes.object.isRequired,
    userMap: PropTypes.object.isRequired,
    userMapPending: PropTypes.object.isRequired,
};

const mapStateToProps = store => {
    const nothink = [{
        id: null,
    }];
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        user_id: store.auth.user.id,
        tagsError: getTagsError(store),
        tags: nothink.concat(getTags(store)),
        tagsPending: getTagsPending(store),
        userPostsError: getUserPostsError(store),
        userPosts: getUserPosts(store),
        userPostsPending: getUserPostsPending(store),
        userMapError: getUserMapError(store),
        userMap: getUserMap(store),
        userMapPending: getUserMapPending(store),
    }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchTags: fetchTagsAction,
    fetchUserPosts: fetchUserPostsAction,
    fetchUserMap: fetchUserMapAction,
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DreamMap);