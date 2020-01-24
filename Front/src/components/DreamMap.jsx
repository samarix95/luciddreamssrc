import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ReactPinchZoomPan from '../../node_modules/react-pinch-zoom-pan/lib/ReactPinchZoomPan.js';

import CssBaseline from '@material-ui/core/CssBaseline';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';

import ZoomOutMapIcon from '@material-ui/icons/ZoomOutMap';
import ZoomOutIcon from '@material-ui/icons/ZoomOut';
import ZoomInIcon from '@material-ui/icons/ZoomIn';

import { instance } from './Config.js';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MapCell from './muiltiple/MapCell.jsx';
import { useStyles } from '../styles/Styles.js';

const ratio = ((window.innerHeight * 0.01 * (100 / 12 * 9 - 0.1)) / (window.innerWidth)) * 100;
const cellWidth = Math.round(window.innerWidth / 20 * 1.5 * 0.6);

function DreamMap(props) {
    const { lang, themeMode, history, user_id } = props;
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [locations, setLocations] = React.useState({});
    const [dreamMap, setDreamMap] = React.useState(null);
    const [posts, setPosts] = React.useState(null);
    const [initialScale, setScale] = React.useState(1);

    const sizeUp = () => {
        if (initialScale + 0.25 < 2.5) {
            setScale(initialScale + 0.25);
        }
    };

    const sizeDown = () => {
        if (initialScale - 0.25 > 0.5) {
            setScale(initialScale - 0.25);
        }
    };

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
                        locations={locations}
                        //loadMap={loadMap}
                        history={history}
                        user_id={user_id}
                        posts={posts}
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

    const loadMap = React.useCallback(() => {
        instance.get("/gettags")
            .then(res => {
                const nothink = [{
                    id: null,
                }];
                setLocations(nothink.concat(res.data));
            })
            .catch(err => {
                console.log(err)
            });
        instance.post("/actions/users/getusermap", { user_id: user_id })
            .then(res => {
                setDreamMap(JSON.parse(res.data.result));
            })
            .catch(err => {
                console.log(err);
            });
    }, [user_id]);

    const getPosts = React.useCallback(() => {
        instance.post("/actions/users/getuserposts", { id: user_id })
            .then(res => {
                setPosts(res.data);
            })
            .catch(err => {
            });
    }, [user_id]);

    React.useEffect(() => {
        loadMap();
        getPosts();
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
                    <Grid item className={`${classes.hiddenOverflow} ${classes.height9}`}>
                        <ReactPinchZoomPan initialScale={initialScale} maxScale={2.5} render={obj => {
                            return (
                                <div
                                    style={{
                                        paddingTop: ratio.toFixed(2) + '%',
                                        overflow: 'hidden',
                                        height: '100%',
                                        width: '100%',
                                        position: 'relative'
                                    }}
                                >
                                    <div
                                        style={{
                                            position: 'absolute',
                                            top: '50%',
                                            left: '50%',
                                            transform: 'translate(-50%, -50%)',
                                        }}
                                    >
                                        <table
                                            style={{
                                                // transform: 'rotateX(60deg) rotateY(0deg) rotateZ(-45deg)',
                                                // transformStyle: 'preserve-3d',
                                                width: '100%',
                                                height: 'auto',
                                                transform: `scale(${obj.scale}) translateY(${obj.y}px) translateX(${obj.x}px)`,
                                                transition: 'transform .1s',
                                                position: 'relative',
                                                margin: 'auto',
                                                borderCollapse: 'collapse',
                                            }}
                                        >
                                            <tbody>
                                                {dreamMap !== null
                                                    ? createTable()
                                                    : <tr>
                                                        <td />
                                                    </tr>
                                                }
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            )
                        }} />
                    </Grid>
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height2}`}>
                        <Grid container
                            className={classes.mainGridContainer}
                            direction="row"
                            justify="space-evenly"
                            alignItems="center" >
                            <Grid item xs={2} align="center" />
                            <Grid item xs={2} align="center">
                                <Fab size="small" onClick={sizeDown}>
                                    <ZoomOutIcon />
                                </Fab>
                            </Grid>
                            <Grid item xs={4} align="center" >
                                <Fab size="small" onClick={() => setScale(1)} >
                                    <ZoomOutMapIcon />
                                </Fab>
                            </Grid>
                            <Grid item xs={2} align="center">
                                <Fab size="small" onClick={sizeUp} >
                                    <ZoomInIcon />
                                </Fab>
                            </Grid>
                            <Grid item xs={2} align="center" />
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
                            <Grid item>
                                <Button className={classes.actionButton}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { history.push("/addlocation") }}
                                >
                                    {lang.currLang.buttons.add}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </MuiThemeProvider >
    )
}

DreamMap.propTypes = {
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    user_id: PropTypes.number.isRequired,
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        user_id: store.auth.user.id,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DreamMap);