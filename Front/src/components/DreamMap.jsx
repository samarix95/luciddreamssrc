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

const JSONtable = {
    0: {
        0: {
            id: 5,
            color: "#666699",
        },
        1: {
            id: 3,
            color: "#cc9900",
        },
        2: {
            id: 4,
            color: "#669900",
        },
        3: {
            id: 4,
            color: "#669900",
        },
        4: {
            id: 4,
            color: "#669900",
        },
        5: {
            id: 4,
            color: "#669900",
        },
        6: {
            id: 4,
            color: "#669900",
        },
        7: {
            id: 4,
            color: "#669900",
        },
        8: {
            id: 4,
            color: "#669900",
        },
        9: {
            id: 4,
            color: "#669900",
        },
    },
    1: {
        0: {
            id: 5,
            color: "#666699",
        },
        1: {
            id: 6,
            color: "#3399ff",
        },
        2: {
            id: 4,
            color: "#669900",
        },
        3: {
            id: 4,
            color: "#669900",
        },
        4: {
            id: 4,
            color: "#669900",
        },
        5: {
            id: 4,
            color: "#669900",
        },
        6: {
            id: 4,
            color: "#669900",
        },
        7: {
            id: 4,
            color: "#669900",
        },
        8: {
            id: 4,
            color: "#669900",
        },
        9: {
            id: 4,
            color: "#669900",
        },
    },
    2: {
        0: {
            id: 5,
            color: "#666699",
        },
        1: {
            id: 5,
            color: "#666699",
        },
        2: {
            id: 4,
            color: "#669900",
        },
        3: {
            id: 4,
            color: "#669900",
        },
        4: {
            id: 4,
            color: "#669900",
        },
        5: {
            id: 4,
            color: "#669900",
        },
        6: {
            id: 4,
            color: "#669900",
        },
        7: {
            id: 4,
            color: "#669900",
        },
        8: {
            id: 4,
            color: "#669900",
        },
        9: {
            id: 4,
            color: "#669900",
        },
    },
    3: {
        0: {
            id: 5,
            color: "#666699",
        },
        1: {
            id: 5,
            color: "#666699",
        },
        2: {
            id: 4,
            color: "#669900",
        },
        3: {
            id: 4,
            color: "#669900",
        },
        4: {
            id: 4,
            color: "#669900",
        },
        5: {
            id: 4,
            color: "#669900",
        },
        6: {
            id: 4,
            color: "#669900",
        },
        7: {
            id: 4,
            color: "#669900",
        },
        8: {
            id: 4,
            color: "#669900",
        },
        9: {
            id: 4,
            color: "#669900",
        },
    },
    4: {
        0: {
            id: 5,
            color: "#666699",
        },
        1: {
            id: 5,
            color: "#666699",
        },
        2: {
            id: 4,
            color: "#669900",
        },
        3: {
            id: 4,
            color: "#669900",
        },
        4: {
            id: 4,
            color: "#669900",
        },
        5: {
            id: 4,
            color: "#669900",
        },
        6: {
            id: 4,
            color: "#669900",
        },
        7: {
            id: 4,
            color: "#669900",
        },
        8: {
            id: 4,
            color: "#669900",
        },
        9: {
            id: 4,
            color: "#669900",
        },
    },
    5: {
        0: {
            id: 5,
            color: "#666699",
        },
        1: {
            id: 5,
            color: "#666699",
        },
        2: {
            id: 4,
            color: "#669900",
        },
        3: {
            id: 4,
            color: "#669900",
        },
        4: {
            id: 4,
            color: "#669900",
        },
        5: {
            id: 4,
            color: "#669900",
        },
        6: {
            id: 4,
            color: "#669900",
        },
        7: {
            id: 4,
            color: "#669900",
        },
        8: {
            id: 4,
            color: "#669900",
        },
        9: {
            id: 4,
            color: "#669900",
        },
    },
    6: {
        0: {
            id: 5,
            color: "#666699",
        },
        1: {
            id: 5,
            color: "#666699",
        },
        2: {
            id: 4,
            color: "#669900",
        },
        3: {
            id: 4,
            color: "#669900",
        },
        4: {
            id: 4,
            color: "#669900",
        },
        5: {
            id: 4,
            color: "#669900",
        },
        6: {
            id: 4,
            color: "#669900",
        },
        7: {
            id: 4,
            color: "#669900",
        },
        8: {
            id: 6,
            color: "#3399ff",
        },
        9: {
            id: 4,
            color: "#669900",
        },
    },
    7: {
        0: {
            id: 5,
            color: "#666699",
        },
        1: {
            id: 5,
            color: "#666699",
        },
        2: {
            id: 4,
            color: "#669900",
        },
        3: {
            id: 4,
            color: "#669900",
        },
        4: {
            id: 4,
            color: "#669900",
        },
        5: {
            id: 4,
            color: "#669900",
        },
        6: {
            id: 4,
            color: "#669900",
        },
        7: {
            id: 4,
            color: "#669900",
        },
        8: {
            id: 4,
            color: "#669900",
        },
        9: {
            id: 4,
            color: "#669900",
        },
    },
    8: {
        0: {
            id: 5,
            color: "#666699",
        },
        1: {
            id: 5,
            color: "#666699",
        },
        2: {
            id: 4,
            color: "#669900",
        },
        3: {
            id: 4,
            color: "#669900",
        },
        4: {
            id: 4,
            color: "#669900",
        },
        5: {
            id: 4,
            color: "#669900",
        },
        6: {
            id: 4,
            color: "#669900",
        },
        7: {
            id: 4,
            color: "#669900",
        },
        8: {
            id: 4,
            color: "#669900",
        },
        9: {
            id: 4,
            color: "#669900",
        },
    },
    9: {
        0: {
            id: 5,
            color: "#666699",
        },
        1: {
            id: 5,
            color: "#666699",
        },
        2: {
            id: 4,
            color: "#669900",
        },
        3: {
            id: 4,
            color: "#669900",
        },
        4: {
            id: 4,
            color: "#669900",
        },
        5: {
            id: 4,
            color: "#669900",
        },
        6: {
            id: 4,
            color: "#669900",
        },
        7: {
            id: 4,
            color: "#669900",
        },
        8: {
            id: 4,
            color: "#669900",
        },
        9: {
            id: 4,
            color: "#669900",
        },
    },
};

function DreamMap(props) {
    const { lang, themeMode, history } = props;
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [cellSize, setCellSize] = React.useState(50);
    const [locations, setLocations] = React.useState({});
    const [dreamMap, setDreamMap] = React.useState(null);

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
                        color={dreamMap[row][col].color}
                        locations={locations}
                        loadMap={loadMap}
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
    }

    const loadMap = () => {
        instance.get("/gettags")
            .then(res => {
                setLocations(res.data);
            })
            .catch(err => {
                console.log(err)
            });
        setDreamMap(JSONtable);
    };

    React.useEffect(() => {
        loadMap();
    }, []);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <div className={classes.root}>
                <Grid className={classes.mainGridContainer}
                    container
                    direction="column"
                    justify="center"
                    alignItems="stretch" >
                    <Grid item xs={10} zeroMinWidth className={classes.mainGridDreamsBodyItem}>
                        <Container
                            style={{
                                paddingTop: '16px',
                                height: '83%',
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
                                        backgroundColor: 'rgb(196, 188, 78, 0.6)',
                                        borderRadius: '4px',
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
                    <Grid item xs={1} zeroMinWidth className={classes.mainGridBodyItem}>
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                        >
                            <Grid item xs={1} align="center"></Grid>
                            <Grid item xs={2} align="center">
                                <Fab size="small"
                                    color="secondary"
                                    onClick={sizeDown}
                                >
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
                                <Fab size="small"
                                    color="primary"
                                    onClick={sizeUp}
                                >
                                    <AddIcon />
                                </Fab>
                            </Grid>
                            <Grid item xs={1} align="center"></Grid>
                        </Grid>
                    </Grid>
                    <Grid item xs={1} zeroMinWidth className={classes.mainGridBodyItem}>
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                        >
                            <Grid item xs={6} align="center">
                                <Button className={classes.actionButton}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { history.push("/luciddreams") }}
                                >
                                    {lang.currLang.buttons.close}
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                                <Button className={classes.actionButton}
                                    variant="contained"
                                    color="primary"
                                    onClick={() => { history.push("/addlocation") }}
                                >
                                    {lang.currLang.buttons.addTag}
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
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
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