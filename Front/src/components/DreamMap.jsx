import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { TransformWrapper, TransformComponent } from '../../node_modules/react-zoom-pan-pinch/dist/index.js';

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

const cellWidth = (window.innerWidth - 32) / 20;

function DreamMap(props) {
    const { lang, themeMode, history, user_id } = props;
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [locations, setLocations] = React.useState({});
    const [dreamMap, setDreamMap] = React.useState(null);
    const [posts, setPosts] = React.useState(null);

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
                    <Grid item className={`${classes.hiddenOverflow} ${classes.height11}`}>
                        <div style={{ padding: 16 }}>
                            <TransformWrapper
                                defaultScale={1}
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
            </div >
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