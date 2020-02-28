import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
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

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { setSnackbar } from '../actions/Actions.js';
import { SET_SNACKBAR_MODE } from "../actions/types.js";
import { instance } from '../Config.js';
import { useStyles } from '../styles/Styles.js';

function AddLocation(props) {
    const { lang, themeMode, history, palette, setSnackbar } = props;
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [prevUrl, setPrevUrl] = React.useState('');
    const [isIconsLoading, setIsIconsLoading] = React.useState(false);
    const [locationIcons, setLocationIcons] = React.useState([]);
    const [searchName, setSearchName] = React.useState('');
    const [nameEn, setNameEn] = React.useState('');
    const [nameRu, setNameRu] = React.useState('');
    const [selectedIcon, setSelectedIcon] = React.useState('');
    const [iconColor, setIconColor] = React.useState('');

    const changeNameRu = (e) => {
        setNameRu(e.target.value)
    };

    const changeNameEn = (e) => {
        let name = e.target.value;
        const reg = /[а-яА-ЯёЁ]/g;
        if (name.search(reg) !== -1) {
            name = name.replace(reg, '');
        }
        setNameEn(name);
    };

    const changeSearchName = (e) => {
        let name = e.target.value;
        const reg = /[а-яА-ЯёЁ]/g;
        if (name.search(reg) !== -1) {
            name = name.replace(reg, '');
        }
        setSearchName(name);
    };

    const changeIcon = (e) => {
        setSelectedIcon(e.target.value);
    };

    const setColor = (color, e) => {
        setIconColor(color.hex);
    };

    const loadIconsList = () => {
        if (searchName.length !== 0) {
            setIsIconsLoading(true);
            const postData = {
                name: searchName.replace(/ /g, "%20"),
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
            if (nameRu.length === 0) {
                errorMessage = lang.currLang.errors.EmptyName;
                error = true;
            }
            if (nameEn.length === 0) {
                errorMessage = lang.currLang.errors.EmptyName;
                error = true;
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
                instance
                    .post('/actions/users/createlocation', postData)
                    .then(res => {
                        setSnackbar({
                            type: SET_SNACKBAR_MODE,
                            snackbar: {
                                open: true,
                                variant: 'success',
                                message: lang.currLang.texts.success,
                            },
                        });
                        prevUrl.length === 0
                            ? history.push("/dreammap")
                            : history.push(prevUrl);
                    })
                    .catch(err => {
                        setSnackbar({
                            type: SET_SNACKBAR_MODE,
                            snackbar: {
                                open: true,
                                variant: 'error',
                                message: lang.currLang.errors.CantAddLocation,
                            },
                        });
                    });
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
                instance
                    .post('/actions/users/updatelocation', postData)
                    .then(res => {
                        setSnackbar({
                            type: SET_SNACKBAR_MODE,
                            snackbar: {
                                open: true,
                                variant: 'success',
                                message: lang.currLang.texts.success,
                            },
                        });
                        prevUrl.length === 0
                            ? history.push("/dreammap")
                            : history.push(prevUrl);
                    })
                    .catch(err => {
                        setSnackbar({
                            type: SET_SNACKBAR_MODE,
                            snackbar: {
                                open: true,
                                variant: 'error',
                                message: lang.currLang.errors.CantUpdateLocation,
                            },
                        });
                    });
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
                <Grid container
                    className={`${classes.height12}`}
                    direction="column"
                    justify="center"
                    alignItems="stretch"
                >
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height11}`}>
                        <Paper className={classes.paper}>
                            <Grid className={`${classes.height12}`}
                                container
                                direction="column"
                                justify="center"
                                alignItems="stretch"
                            >
                                <Grid item className={`${classes.mainGridBodyItem} ${classes.height5}`}>

                                    <Grid container
                                        className={`${classes.height6}`}
                                        direction="column"
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item className={classes.fullMinWidth} >
                                            <TextField className={classes.inputDiv}
                                                disabled={!isIconsLoading
                                                    ? false
                                                    : true
                                                }
                                                required
                                                id="input-ru"
                                                value={nameRu}
                                                label={lang.currLang.texts.Name + ' Ru'}
                                                variant="outlined"
                                                onChange={changeNameRu}
                                            />
                                        </Grid>
                                    </Grid>
                                    <Grid container
                                        className={`${classes.height6}`}
                                        direction="column"
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item className={classes.fullMinWidth} >
                                            <TextField className={classes.inputDiv}
                                                disabled={!isIconsLoading
                                                    ? false
                                                    : true
                                                }
                                                required
                                                id="input-en"
                                                value={nameEn}
                                                label={lang.currLang.texts.Name + ' En'}
                                                variant="outlined"
                                                onChange={changeNameEn}
                                            />
                                        </Grid>
                                    </Grid>

                                </Grid>
                                <Grid item className={`${classes.mainGridBodyItem} ${classes.height3}`}>
                                    <Grid className={`${classes.height12}`}
                                        container
                                        direction="column"
                                        justify="center"
                                        alignItems="stretch"
                                    >
                                        <Grid item className={`${classes.mainGridBodyItem} ${classes.height6}`}>
                                            <TextField className={classes.inputDiv}
                                                disabled={!isIconsLoading
                                                    ? false
                                                    : true
                                                }
                                                value={searchName}
                                                id="input-search"
                                                label={lang.currLang.texts.FindIcon}
                                                variant="outlined"
                                                onChange={changeSearchName}
                                                onBlur={loadIconsList}
                                            />
                                        </Grid>
                                        <Grid item className={`${classes.mainGridBodyItem} ${classes.height6}`}>
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
                                    </Grid>
                                </Grid>
                                <Grid item className={`${classes.mainGridBodyItem} ${classes.height4}`}>
                                    <SliderPicker className={classes.inputDiv}
                                        color={iconColor}
                                        onChangeComplete={setColor}
                                    />
                                </Grid>
                            </Grid>
                        </Paper>
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
                                        prevUrl.length === 0
                                            ? history.push("/dreammap")
                                            : history.push(prevUrl);
                                    }}
                                >
                                    {lang.currLang.buttons.Back}
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
    );
};

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