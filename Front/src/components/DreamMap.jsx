import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Slider from '@material-ui/core/Slider';
import Grid from '@material-ui/core/Grid';
import Fab from '@material-ui/core/Fab';

import RemoveIcon from '@material-ui/icons/Remove';
import AddIcon from '@material-ui/icons/Add';

import { instance } from './Config';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import MapCell from './muiltiple/MapCell';
import { useStyles } from '../styles/Styles';

function DreamMap(props) {
    const { lang, themeMode, history, user_id } = props;
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [cellSize, setCellSize] = React.useState(50);
    const [locations, setLocations] = React.useState({});
    const [dreamMap, setDreamMap] = React.useState(null);
    const [posts, setPosts] = React.useState(null);

    const changeCellSize = (event, newValue) => {
        setCellSize(newValue);
    };

    const sizeUp = () => {
        const newcellSize = cellSize + 5;
        setCellSize(newcellSize);
    };

    const sizeDown = () => {
        const newcellSize = cellSize - 5;
        setCellSize(newcellSize);
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
                        cellHeight={cellSize * 0.6}
                        cellWidth={cellSize * 0.6}
                        dreamMap={dreamMap}
                        id={dreamMap[row][col].id}
                        locations={locations}
                        loadMap={loadMap}
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
                        <Container
                            style={{
                                paddingTop: '16px',
                                height: '75%',
                                width: '100%',
                                position: 'absolute',
                            }}
                        >
                            <div
                                style={{
                                    position: 'relative',
                                    height: '100%',
                                    width: '100%',
                                    overflow: 'auto',
                                }}
                            >
                                <table
                                    style={{
                                        // transform: 'rotateX(60deg) rotateY(0deg) rotateZ(-45deg)',
                                        // transformStyle: 'preserve-3d',
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
                        </Container>
                    </Grid>
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height2}`}>
                        <Grid container
                            className={classes.mainGridContainer}
                            direction="row"
                            justify="space-evenly"
                            alignItems="center" >
                            <Grid item xs={1} align="center" />
                            <Grid item xs={2} align="center">
                                <Fab size="small" color="secondary" onClick={sizeDown}>
                                    <RemoveIcon />
                                </Fab>
                            </Grid>
                            <Grid item xs={6} align="center">
                                <Slider
                                    min={6}
                                    value={typeof cellSize === 'number' ? cellSize : 0}
                                    onChange={changeCellSize}
                                />
                            </Grid>
                            <Grid item xs={2} align="center">
                                <Fab size="small" color="primary" onClick={sizeUp} >
                                    <AddIcon />
                                </Fab>
                            </Grid>
                            <Grid item xs={1} align="center" />
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