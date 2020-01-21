import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import FormControl from "@material-ui/core/FormControl";
import IconButton from '@material-ui/core/IconButton';
import Typography from "@material-ui/core/Typography";
import MenuItem from "@material-ui/core/MenuItem";
import Popover from "@material-ui/core/Popover";
import Select from "@material-ui/core/Select";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";

import EditIcon from '@material-ui/icons/Edit';

import { useStyles } from '../../styles/Styles';
import { instance } from '../Config';

function MapCell(props) {
    const classes = useStyles();
    const { i, j, cellHeight, cellWidth, id, locations, palette, lang, loadMap, history, user_id, posts } = props;
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [tagId, setTagId] = React.useState(null);
    const [countDreams, setCountDreams] = React.useState(0);
    const open = Boolean(anchorEl);
    const popoverId = open ? "simple-popover" : undefined;
    const disabledSave = tagId === id ? true : false;

    const calculateCount = (tagId) => {
        let count = 0;
        posts.map(post =>
            post.tags.map(tag =>
                parseInt(tag[0]) === tagId
                    ? count++
                    : count += 0
            )
        );
        setCountDreams(count);
    };

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
        calculateCount(tagId);
    };

    const handleClose = () => {
        setTagId(id);
        setAnchorEl(null);
    };

    const changeTagId = (event) => {
        setTagId(event.target.value);
        calculateCount(event.target.value);
    };

    const editLocation = () => {
        history.push({
            pathname: "/addlocation",
            defaultData: {
                id: tagId,
                name_rus: locations.find(loc => loc.id === tagId).name_rus,
                name_eng: locations.find(loc => loc.id === tagId).name_eng,
                img_url: locations.find(loc => loc.id === tagId).img_url,
                color: locations.find(loc => loc.id === tagId).color,
                prevUrl: "/dreammap",
            }
        });
    };

    const saveCellLoc = () => {
        let newCell = {
            "user_id": user_id,
            "i": i,
            "j": j,
        };
        newCell.oldLoc = id;
        newCell.newLoc = tagId;
        instance.post("/actions/users/updateusermap", newCell)
            .then(res => {
            })
            .catch(err => {
                console.log(err);
            });
        setAnchorEl(null);
        loadMap();
    };

    React.useEffect(() => {
        if (id)
            setTagId(id);
    }, [id]);

    return (
        <td
            style={{
                height: cellHeight + 'px',
                minWidth: cellWidth + 'px',
                maxWidth: cellWidth + 'px',
                padding: 0,
                margin: 0,
                transition: "all 0.1s",
                border: '1px rgb(128,128,128,0.8) solid',
            }}
        >
            {locations.length
                ? <div className={classes.aboutGridContainer}
                    onClick={handleClick}
                    style={
                        typeof tagId === 'number'
                            ? {
                                backgroundImage: 'url(' + locations.find(loc => loc.id === tagId).img_url + ')',
                                backgroundSize: 'contain',
                                backgroundColor: locations.find(loc => loc.id === tagId).color,
                                overflow: 'hidden',
                                //position: 'absolute',
                                // width: cellWidth,
                                // height: cellHeight,
                                // transform: 'rotateZ(45deg) rotateY(0deg) rotateX(-60deg)',
                                // transformOrigin: 'bottom center',
                                // borderRadius: '40%',
                            }
                            : {
                                backgroundSize: 'contain',
                                backgroundColor: 'rgb(192,192,192,0.6)',
                                overflow: 'hidden',
                            }
                    }
                />
                : ''
            }
            <Popover id={popoverId}
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
                <Grid container
                    className={`${classes.height12}`}
                    direction="column"
                    justify="center"
                    alignItems="stretch"
                >
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height11}`} style={{ padding: '16px' }} >
                        {locations.length
                            ? <Grid container
                                className={`${classes.height12}`}
                                direction="column"
                                justify="center"
                                alignItems="stretch"
                            >
                                <Grid item className={`${classes.height6}`}>
                                    <Grid container
                                        className={`${classes.height12}`}
                                        direction="row"
                                        justify="center"
                                        alignItems="stretch"
                                    >
                                        <Grid item xs={10}
                                            style={{
                                                textAlign: 'center',
                                                position: 'relative',
                                            }}
                                        >
                                            <Typography variant='h6'
                                                style={{
                                                    position: 'absolute',
                                                    top: '50%',
                                                    left: '50%',
                                                    transform: 'translate(-50%, -50%)',
                                                }}
                                            >
                                                {typeof tagId === 'number'
                                                    ? lang.currLang.current === "Ru"
                                                        ? locations.find(loc => loc.id === tagId).name_rus
                                                        : locations.find(loc => loc.id === tagId).name_eng
                                                    : lang.currLang.texts.Nothink
                                                }
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={2}>
                                            <IconButton onClick={editLocation}
                                                disabled={
                                                    typeof tagId === 'number'
                                                        ? false
                                                        : true
                                                }
                                            >
                                                <EditIcon fontSize="small" />
                                            </IconButton >
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item className={`${classes.height6}`}>
                                    <Grid container
                                        direction="row"
                                        justify="space-around"
                                        alignItems="center"
                                    >
                                        <Grid item>
                                            <FormControl>
                                                <Select
                                                    value={
                                                        typeof tagId === 'number'
                                                            ? tagId
                                                            : ''
                                                    }
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
                                                                src={
                                                                    item.id
                                                                        ? item.img_url
                                                                        : 'https://static.thenounproject.com/png/1446402-200.png'
                                                                }
                                                                style={palette.type === 'dark'
                                                                    ? {
                                                                        filter: 'invert(1)',
                                                                    }
                                                                    : {}
                                                                }
                                                            />
                                                        </MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            <Button disabled={countDreams !== 0 ? false : true} onClick={() => { alert('Посмотреть') }}>
                                                {lang.currLang.texts.dreams}: {countDreams}
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                            : ''
                        }
                    </Grid>
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height1}`}>
                        <Grid className={classes.menuDivButton}
                            container
                            direction="row"
                            justify="space-around"
                            alignItems="stretch"
                            style={{
                                padding: '16px'
                            }}
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
    lang: PropTypes.object.isRequired,
    palette: PropTypes.object.isRequired,
};

const mapStateToProps = store => {
    return {
        lang: store.lang,
        palette: store.themeMode.palette,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
    }
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MapCell);