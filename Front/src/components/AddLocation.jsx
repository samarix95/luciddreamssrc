import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SwipeableViews from "react-swipeable-views";
import { SliderPicker } from 'react-color';

import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Select from "@material-ui/core/Select";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";

import { setSnackbar } from '../actions/Actions';
import { SET_SNACKBAR_MODE } from "../actions/types";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { instance } from './Config';
import { useStyles } from '../styles/Styles';

function AddLocation(props) {
    const { lang, themeMode, history, palette, setSnackbar } = props;
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [value, setValue] = React.useState(0);
    const [prevUrl, setPrevUrl] = React.useState('');
    const [isIconsLoading, setIsIconsLoading] = React.useState(false);
    const [locationIcons, setLocationIcons] = React.useState([]);

    const [nameEn, setNameEn] = React.useState('');
    const [nameRu, setNameRu] = React.useState('');
    const [selectedIcon, setSelectedIcon] = React.useState('');
    const [iconColor, setIconColor] = React.useState('');

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };

    const changeNameRu = (e) => {
        setNameRu(e.target.value)
    };

    const changeNameEn = (e) => {
        setNameEn(e.target.value)
    };

    const changeIcon = (e) => {
        setSelectedIcon(e.target.value);
    };

    const setColor = (color, e) => {
        setIconColor(color.hex);
    };

    const loadIconsList = () => {
        let errorMessage = '';
        let error = false;

        if (nameRu.length === 0) {
            errorMessage = lang.currLang.errors.EmptyName;
            error = true;
            setValue(0);
        }
        else {
            if (nameEn.length === 0) {
                errorMessage = lang.currLang.errors.EmptyName;
                error = true;
                setValue(1);
            }
        }

        if (error) {
            setLocationIcons([]);
            setSelectedIcon('');
            setSnackbar({
                type: SET_SNACKBAR_MODE,
                snackbar: {
                    open: true,
                    variant: 'error',
                    message: errorMessage,
                },
            });
        }
        else {
            setIsIconsLoading(true);
            const postData = {
                name: nameEn,
            };
            instance
                .post('/actions/users/geticons', postData)
                .then(res => {
                    if (res.data.length === 0) {
                        loadIconsList();
                    }
                    else {
                        setLocationIcons(res.data);
                        setIsIconsLoading(false);
                    }
                });
        }
    };

    const saveLocation = () => {
        let errorMessage = '';
        let error = false;
        if (!isEditMode) {
            if (iconColor.length === 0) {
                errorMessage = lang.currLang.errors.ColorNotChange;
                error = true;
            }
            if (selectedIcon.length === 0) {
                errorMessage = lang.currLang.errors.IconNotChange;
                error = true;
            }
            if (nameRu.length === 0 || nameEn.length === 0) {
                errorMessage = lang.currLang.errors.EmptyName;
                error = true;
                setValue(1);
            }

            if (error) {
                setSnackbar({
                    type: SET_SNACKBAR_MODE,
                    snackbar: {
                        open: true,
                        variant: 'error',
                        message: errorMessage,
                    },
                });
            }
            else {
                let postData = {
                    name_rus: nameRu,
                    name_eng: nameEn,
                    img_url: selectedIcon,
                    color: iconColor
                };
                console.log(postData);
            }
        }
        else {
            let chages = false;
            let postData = {
                id: props.location.defaultData.id,
            };

            if (nameRu !== props.location.defaultData.name_rus) {
                postData.name_rus = nameRu;
                chages = true;
            }
            if (nameEn !== props.location.defaultData.name_eng) {
                postData.name_eng = nameEn;
                chages = true;
            }
            if (selectedIcon !== props.location.defaultData.img_url) {
                postData.img_url = selectedIcon;
                chages = true;
            }
            if (iconColor !== props.location.defaultData.color) {
                postData.color = iconColor;
                chages = true;
            }

            if (chages) {
                console.log(postData);
            }
            else {
                setSnackbar({
                    type: SET_SNACKBAR_MODE,
                    snackbar: {
                        open: true,
                        variant: 'error',
                        message: lang.currLang.errors.NoChanges,
                    },
                });
            }
        }
    };

    React.useEffect(() => {
        if (typeof (props.location.defaultData) !== 'undefined') {
            const getIcon = (data, img_url) => {
                instance
                    .post('/actions/users/geticons', data)
                    .then(res => {
                        if (res.data.length === 0) {
                            getIcon(data, img_url);
                        }
                        else {
                            let icons = [];
                            icons.push(img_url);
                            const newArray = icons.concat(res.data);
                            setLocationIcons(newArray);
                            setIsIconsLoading(false);
                        }
                    });
            };

            if (typeof props.location.defaultData.id === 'number') {
                setIsEditMode(true);
                const { name_rus, name_eng, img_url, color, prevUrl } = props.location.defaultData;
                setNameRu(name_rus);
                setNameEn(name_eng);
                setSelectedIcon(img_url);
                setIconColor(color);
                setPrevUrl(prevUrl);
                setIsIconsLoading(true);
                const postData = {
                    name: name_eng,
                };
                getIcon(postData, img_url);
            }
            else {
                const { prevUrl } = props.location.defaultData;
                setPrevUrl(prevUrl);
            }
        }
    }, [props.location.defaultData]);
    
    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <div className={classes.root}>
                <Grid className={classes.mainGridContainer}
                    container
                    direction="column"
                    justify="center"
                    alignItems="stretch" >
                    <Grid item xs={11} className={classes.mainGridBodyItem}>
                        <Paper className={classes.paper}>
                            <Grid className={classes.mainGridContainer}
                                container
                                direction="column"
                                justify="center"
                                alignItems="stretch"
                            >
                                <Grid item xs={6} className={classes.mainGridBodyItem} >
                                    <Paper >
                                        <Tabs
                                            centered
                                            value={value}
                                            onChange={handleChange}
                                            indicatorColor="primary"
                                            textColor="primary"
                                        >
                                            <Tab label="RU" />
                                            <Tab label="EN" />
                                        </Tabs>
                                    </Paper>
                                    <SwipeableViews className={classes.SwipeableViews}
                                        animateHeight
                                        axis={muiTheme.direction === "rtl" ? "x-reverse" : "x"}
                                        index={value}
                                        onChangeIndex={handleChangeIndex}
                                    >
                                        <Grid container
                                            className={classes.mainGridContainer}
                                            direction="column"
                                            justify="center"
                                            alignItems="center"
                                            role="tabpanel"
                                        >
                                            <Grid item className={classes.fullMinWidth} >
                                                <TextField className={classes.inputDiv}
                                                    disabled={!isIconsLoading
                                                        ? false
                                                        : true
                                                    }
                                                    required
                                                    id="outlined-required"
                                                    value={nameRu}
                                                    label={lang.currLang.texts.Name}
                                                    variant="outlined"
                                                    onChange={changeNameRu}
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid container
                                            className={classes.mainGridContainer}
                                            direction="column"
                                            justify="center"
                                            alignItems="center"
                                            role="tabpanel"
                                        >
                                            <Grid item className={classes.fullMinWidth} >
                                                <TextField className={classes.inputDiv}
                                                    disabled={!isIconsLoading
                                                        ? false
                                                        : true
                                                    }
                                                    required
                                                    id="outlined-required"
                                                    value={nameEn}
                                                    label={lang.currLang.texts.Name}
                                                    variant="outlined"
                                                    onChange={changeNameEn}
                                                    onBlur={loadIconsList}
                                                />
                                            </Grid>
                                        </Grid>
                                    </SwipeableViews>
                                </Grid>
                                <Grid item xs={2} className={classes.mainGridBodyItem} >
                                    <div className={classes.formControl}>
                                        {!isIconsLoading
                                            ? <FormControl
                                                disabled={locationIcons.length !== 0
                                                    ? false
                                                    : true
                                                }
                                            >
                                                <InputLabel id="select-icon">
                                                    {lang.currLang.texts.ChangeIcon}
                                                </InputLabel>
                                                <Select value={selectedIcon}
                                                    style={{
                                                        minWidth: 100,
                                                    }}
                                                    labelId="select-icon"
                                                    onChange={changeIcon}
                                                    MenuProps={{
                                                        PaperProps: {
                                                            style: {
                                                                maxHeight: 48 * 4.5 + 8,
                                                                width: 'auto',
                                                            },
                                                        },
                                                    }}
                                                >
                                                    {locationIcons.map((item, key) => (
                                                        <MenuItem key={key} value={item} >
                                                            <Avatar className={classes.smallAvatar}
                                                                src={item}
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
                                            : <CircularProgress />
                                        }
                                    </div>
                                </Grid>
                                <Grid item xs={4} className={classes.mainGridBodyItem}>
                                    <SliderPicker className={classes.inputDiv}
                                        color={iconColor}
                                        onChangeComplete={setColor}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={1} className={classes.mainGridBodyItem} >
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                        >
                            <Grid item>
                                <Button className={classes.actionButton}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => {
                                        prevUrl.length === 0
                                            ? history.push("/dreammap")
                                            : history.push(prevUrl)
                                    }}
                                >
                                    {lang.currLang.buttons.close}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.actionButton}
                                    onClick={() => saveLocation()}
                                >
                                    {isEditMode
                                        ? lang.currLang.buttons.Save
                                        : lang.currLang.buttons.add
                                    }
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </MuiThemeProvider >
    )
}

AddLocation.propTypes = {
    setSnackbar: PropTypes.func.isRequired,
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    palette: PropTypes.object.isRequired,
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        palette: store.themeMode.palette,
        lang: store.lang,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        setSnackbar: snackbar => dispatch(setSnackbar(snackbar)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddLocation);