import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import SwipeableViews from "react-swipeable-views";

import LinearProgress from '@material-ui/core/LinearProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from "@material-ui/core/TextField";
import Button from '@material-ui/core/Button';
import Paper from "@material-ui/core/Paper";
import Tabs from "@material-ui/core/Tabs";
import Grid from '@material-ui/core/Grid';
import Tab from "@material-ui/core/Tab";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { useStyles } from '../styles/Styles';
import { setSnackbar } from '../actions/Actions';
import { SET_SNACKBAR_MODE } from "../actions/types";
import { instance } from './Config';

function AddTechnics(props) {
    const classes = useStyles();
    const { lang, themeMode, history, setSnackbar } = props;
    const muiTheme = createMuiTheme(themeMode);
    const [isLoading, setIsLoading] = React.useState(false);
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [value, setValue] = React.useState(0);
    const [technicsData, setTechnicsData] = React.useState({
        titleRu: '',
        titleEn: '',
        descriptionRu: '',
        descriptionEn: '',
    });
    const [fileldsErr, setFileldsErr] = React.useState({
        titleRu: false,
        titleEn: false,
        descriptionRu: false,
        descriptionEn: false,
    });

    const changeData = (event, field) => {
        let newTechnicsData = technicsData;
        let newFileldsErr = fileldsErr;
        let name = event.target.value;
        const ruReg = /[а-яА-ЯёЁ]/g;
        switch (field) {
            case 'title-ru':
                newTechnicsData = { ...newTechnicsData, titleRu: event.target.value };
                if (newFileldsErr.titleRu) {
                    newFileldsErr = { ...newFileldsErr, titleRu: false };
                    setFileldsErr(newFileldsErr);
                }
                break;
            case 'title-en':
                
                if (name.search(ruReg) !== -1) {
                    name = name.replace(ruReg, '');
                }
                newTechnicsData = { ...newTechnicsData, titleEn: name };
                if (newFileldsErr.titleEn) {
                    newFileldsErr = { ...newFileldsErr, titleEn: false };
                    setFileldsErr(newFileldsErr);
                }
                break;
            case 'description-ru':
                newTechnicsData = { ...newTechnicsData, descriptionRu: event.target.value };
                if (newFileldsErr.descriptionRu) {
                    newFileldsErr = { ...newFileldsErr, descriptionRu: false };
                    setFileldsErr(newFileldsErr);
                }
                break;
            case 'description-en':
                if (name.search(ruReg) !== -1) {
                    name = name.replace(ruReg, '');
                }
                newTechnicsData = { ...newTechnicsData, descriptionEn: name };
                if (newFileldsErr.descriptionEn) {
                    newFileldsErr = { ...newFileldsErr, descriptionEn: false };
                    setFileldsErr(newFileldsErr);
                }
                break;
            default:
                break;
        }
        setTechnicsData(newTechnicsData);
    };

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const handleChangeIndex = index => {
        setValue(index);
    };

    const save = () => {
        setIsLoading(true);
        if (!isEditMode) {
            let isError = false;
            let errorMessage = '';
            let newFileldsErr = fileldsErr;

            if (technicsData.titleRu.length === 0) {
                isError = true;
                errorMessage = lang.currLang.errors.EmptyTitle;
                newFileldsErr = { ...newFileldsErr, titleRu: true };
                setValue(0);
            }
            if (technicsData.titleEn.length === 0 && !isError) {
                isError = true;
                errorMessage = lang.currLang.errors.EmptyTitle;
                newFileldsErr = { ...newFileldsErr, titleEn: true };
                setValue(1);
            }
            if (technicsData.descriptionRu.length === 0 && !isError) {
                isError = true;
                errorMessage = lang.currLang.errors.EmptyDescription;
                newFileldsErr = { ...newFileldsErr, descriptionRu: true };
                setValue(0);
            }
            if (technicsData.descriptionEn.length === 0 && !isError) {
                isError = true;
                errorMessage = lang.currLang.errors.EmptyDescription;
                newFileldsErr = { ...newFileldsErr, descriptionEn: true };
                setValue(1);
            }

            if (isError) {
                setFileldsErr(newFileldsErr);
                setSnackbar({
                    type: SET_SNACKBAR_MODE,
                    snackbar: {
                        open: true,
                        variant: 'error',
                        message: errorMessage,
                    },
                });
                setIsLoading(false);
            }
            else {
                instance
                    .post('/actions/users/createtechnic', technicsData)
                    .then(res => {
                        setIsLoading(false);
                        setSnackbar({
                            type: SET_SNACKBAR_MODE,
                            snackbar: {
                                open: true,
                                variant: 'success',
                                message: lang.currLang.texts.success,
                            },
                        });
                        history.push("/addtechnics")
                    })
                    .catch(err => {
                        console.log(err);
                        setIsLoading(false);
                    });
            }
        }
        else {
            let haveChanges = false;
            let postData = {
                id: props.location.defaultData.item.id,
            };

            if (technicsData.titleRu !== props.location.defaultData.item.name_rus) {
                postData.name_rus = technicsData.titleRu;
                haveChanges = true;
            }
            if (technicsData.descriptionRu !== props.location.defaultData.item.description_rus) {
                postData.description_rus = technicsData.descriptionRu;
                haveChanges = true;
            }
            if (technicsData.titleEn !== props.location.defaultData.item.name_eng) {
                postData.name_eng = technicsData.titleEn;
                haveChanges = true;
            }
            if (technicsData.descriptionEn !== props.location.defaultData.item.description_eng) {
                postData.description_eng = technicsData.descriptionEn;
                haveChanges = true;
            }

            if (haveChanges) {
                instance
                    .post('/actions/users/updatetechnic', postData)
                    .then(res => {
                        setIsLoading(false);
                        setSnackbar({
                            type: SET_SNACKBAR_MODE,
                            snackbar: {
                                open: true,
                                variant: 'success',
                                message: lang.currLang.texts.success,
                            },
                        });
                        history.push("/addtechnics")
                    })
                    .catch(err => {
                        console.log(err);
                        setIsLoading(false);
                    });
                setIsLoading(false);
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
                setIsLoading(false);
            }
        }
    };

    React.useEffect(() => {
        if (typeof (props.location.defaultData) !== 'undefined') {
            setIsEditMode(true);
            const { name_rus, name_eng, description_rus, description_eng } = props.location.defaultData.item;
            let newTechnicsData = {};
            newTechnicsData = { ...newTechnicsData, titleRu: name_rus };
            newTechnicsData = { ...newTechnicsData, titleEn: name_eng };
            if (description_rus)
                newTechnicsData = { ...newTechnicsData, descriptionRu: description_rus };
            else
                newTechnicsData = { ...newTechnicsData, descriptionRu: 'description_rus' };
            if (description_eng)
                newTechnicsData = { ...newTechnicsData, descriptionEn: description_eng };
            else
                newTechnicsData = { ...newTechnicsData, descriptionEn: 'description_eng' };
            setTechnicsData(newTechnicsData);
        }
    }, [props.location.defaultData]);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <div className={classes.root} >
                <Grid container
                    className={`${classes.height12}`}
                    direction="column"
                    justify="center"
                    alignItems="stretch" >
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height11}`}>
                        <Paper className={classes.paper}>
                            <Paper style={{
                                position: 'relative',
                                height: '10%',
                            }}>
                                <Tabs centered
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
                                axis={
                                    muiTheme.direction === "rtl"
                                        ? "x-reverse"
                                        : "x"
                                }
                                index={value}
                                onChangeIndex={handleChangeIndex}
                            >
                                <Grid container
                                    className={`${classes.height12}`}
                                    direction="column"
                                    justify="center"
                                    alignItems="stretch"
                                    role="tabpanel"
                                >
                                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height2}`}>
                                        <TextField className={classes.inputDiv}
                                            error={fileldsErr.titleRu}
                                            required
                                            id="title-ru"
                                            value={technicsData.titleRu}
                                            label={lang.currLang.texts.title}
                                            variant="outlined"
                                            onChange={(e) => { changeData(e, 'title-ru') }}
                                        />
                                    </Grid>
                                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height10}`}>
                                        <TextField className={classes.inputDiv}
                                            error={fileldsErr.descriptionRu}
                                            required
                                            id="description-ru"
                                            multiline
                                            rows="5"
                                            value={technicsData.descriptionRu}
                                            label={lang.currLang.texts.description}
                                            variant="outlined"
                                            onChange={(e) => { changeData(e, 'description-ru') }}
                                        />
                                    </Grid>
                                </Grid>
                                <Grid container
                                    className={`${classes.height12}`}
                                    direction="column"
                                    justify="center"
                                    alignItems="stretch"
                                    role="tabpanel"
                                >
                                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height2}`}>
                                        <TextField className={classes.inputDiv}
                                            error={fileldsErr.titleEn}
                                            required
                                            id="title-en"
                                            value={technicsData.titleEn}
                                            label={lang.currLang.texts.title}
                                            variant="outlined"
                                            onChange={(e) => { changeData(e, 'title-en') }}
                                        />
                                    </Grid>
                                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height10}`}>
                                        <TextField className={classes.inputDiv}
                                            error={fileldsErr.descriptionEn}
                                            required
                                            id="description-en"
                                            multiline
                                            rows="5"
                                            value={technicsData.descriptionEn}
                                            label={lang.currLang.texts.description}
                                            variant="outlined"
                                            onChange={(e) => { changeData(e, 'description-en') }}
                                        />
                                    </Grid>
                                </Grid>
                            </SwipeableViews>
                        </Paper>
                    </Grid>
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height1}`}>
                        {isLoading
                            ? <LinearProgress />
                            : <Grid container
                                direction="row"
                                justify="space-evenly"
                                alignItems="center"
                            >
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className={classes.actionButton}
                                        onClick={() => { history.push("/technics") }}
                                    >
                                        {lang.currLang.buttons.close}
                                    </Button>
                                </Grid>
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.actionButton}
                                        onClick={() => save()}
                                    >
                                        {isEditMode
                                            ? lang.currLang.buttons.Save
                                            : lang.currLang.buttons.add
                                        }
                                    </Button>
                                </Grid>
                            </Grid>
                        }
                    </Grid>
                </Grid>
            </div>
        </MuiThemeProvider>
    )
}

AddTechnics.propTypes = {
    setSnackbar: PropTypes.func.isRequired,
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
        setSnackbar: snackbar => dispatch(setSnackbar(snackbar)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddTechnics);