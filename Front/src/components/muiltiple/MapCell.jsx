import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FormControl from "@material-ui/core/FormControl";
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";

import Skeleton from '@material-ui/lab/Skeleton';

import { useStyles } from '../../styles/Styles';
//import { SET_SNACKBAR_MODE } from "../../actions/types";
import { setSnackbar } from '../../actions/Actions';

function MapCell(props) {
    const classes = useStyles();
    const { i, j, cellHeight, cellWidth, id, color, locations, palette, lang, loadMap } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [tagId, setTagId] = React.useState(id);

    const disabledSave = tagId === id ? true : false;

    const handleClick = event => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setTagId(id);
        setAnchorEl(null);
    };

    const changeTagId = event => {
        setTagId(event.target.value);
    };
    const saveCellLoc = () => {
        let newCell = {
            "i": i,
            "j": j,
        };
        newCell.oldLoc = id;
        newCell.newLoc = tagId;
        console.log(newCell);
        setAnchorEl(null);
        loadMap();
    };

    const open = Boolean(anchorEl);
    const popoverId = open ? "simple-popover" : undefined;

    return (
        <td
            style={{
                height: cellHeight + 'px',
                minWidth: cellWidth + 'px',
                maxWidth: cellWidth + 'px',
                padding: 0,
                margin: 0,
                transition: "all 0.1s",
            }}
        >
            {locations.length
                ? <div className={classes.aboutGridContainer}
                    onClick={handleClick}
                    style={{
                        backgroundImage: 'url(' + locations.find(loc => loc.id === tagId).img_url + ')',
                        backgroundSize: 'contain',
                        backgroundColor: color,
                        overflow: 'hidden',
                        //position: 'absolute',
                        // width: cellWidth,
                        // height: cellHeight,
                        // transform: 'rotateZ(45deg) rotateY(0deg) rotateX(-60deg)',
                        // transformOrigin: 'bottom center',
                        // borderRadius: '40%',
                    }}
                />
                : <Skeleton variant="circle" width={cellHeight} height={cellWidth} />

            }

            <Popover
                id={popoverId}
                open={open}
                anchorEl={anchorEl}
                anchorOrigin={{
                    vertical: "center",
                    horizontal: "center"
                }}
                transformOrigin={{
                    vertical: "center",
                    horizontal: "center"
                }}
            >
                <Grid className={classes.mainGridContainer}
                    container
                    direction="column"
                    justify="center"
                    alignItems="stretch"
                >
                    <Grid item
                        xs={11}
                        className={classes.mainGridBodyItem}
                        style={{
                            padding: '16px'
                        }}
                    >
                        {locations.length
                            ? <Grid className={classes.mainGridContainer}
                                container
                                direction="column"
                                justify="center"
                                alignItems="stretch"
                            >
                                <Grid item
                                    style={{
                                        textAlign: 'center'
                                    }}
                                >
                                    <Typography component='div' variant='h6'>
                                        {/* {i + ' ' + j} */}
                                        {lang.currLang.current === "Ru"
                                            ? locations.find(loc => loc.id === tagId).name_rus
                                            : locations.find(loc => loc.id === tagId).name_eng
                                        }
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Grid
                                        container
                                        direction="row"
                                        justify="space-around"
                                        alignItems="center"
                                    >
                                        <Grid item>
                                            <FormControl className={classes.formControl}>
                                                <Select value={tagId}
                                                    onChange={changeTagId}
                                                    MenuProps={{
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight: 48 * 4.5 + 8,
                                                                width: 'auto',
                                                            },
                                                        },
                                                    }}
                                                >
                                                    {locations.map((item, key) => (
                                                        <MenuItem key={key} value={item.id}>
                                                            <Avatar className={classes.smallAvatar}
                                                                src={item.img_url}
                                                                style={palette.type === 'dark'
                                                                    ? {
                                                                        filter: 'invert(1)',
                                                                    }
                                                                    : {}}
                                                            />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            <Typography component='div' variant='body2'>
                                                {lang.currLang.texts.dreams}:
                                            </Typography>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            : ''
                        }
                    </Grid>
                    <Grid item xs={1} className={classes.mainGridBodyItem}>
                        <Grid className={classes.menuDivButton}
                            container
                            direction="row"
                            justify="space-around"
                            alignItems="stretch"
                        >
                            <Grid item xs={6} align="center">
                                <Button className={classes.poppupButton}
                                    variant="contained"
                                    color="secondary"
                                    onClick={handleClose}
                                >
                                    {lang.currLang.texts.cancel}
                                </Button>
                            </Grid>
                            <Grid item xs={6} align="center">
                                <Button className={classes.poppupButton}
                                    disabled={disabledSave}
                                    variant="contained"
                                    color="primary"
                                    onClick={saveCellLoc}
                                >
                                    {lang.currLang.buttons.Save}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </Popover>
        </td >
    )
}

MapCell.propTypes = {
    setSnackbar: PropTypes.func.isRequired,
    lang: PropTypes.object.isRequired,
    palette: PropTypes.object.isRequired,
}

const mapStateToProps = store => {
    return {
        lang: store.lang,
        palette: store.themeMode.palette,
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
)(MapCell);