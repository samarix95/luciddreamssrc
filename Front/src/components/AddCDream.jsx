import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";
import enLocale from "date-fns/locale/ru";

import LinearProgress from '@material-ui/core/LinearProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import TextField from '@material-ui/core/TextField';
import Avatar from "@material-ui/core/Avatar";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Chip from "@material-ui/core/Chip";
import Grid from '@material-ui/core/Grid';

import Autocomplete from "@material-ui/lab/Autocomplete";

import MUIRichTextEditor from 'mui-rte';
import { convertToRaw } from 'draft-js';

import Rating from "@material-ui/lab/Rating";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';

import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import AddIcon from '@material-ui/icons/Add';

import { useStyles } from '../styles/Styles';
import { SET_SNACKBAR_MODE } from "../actions/types";
import { setSnackbar } from '../actions/Actions';

import { instance, fetchTagsAction, fetchTechnicsAction } from '../Config.js';
import { getTagsError, getTags, getTagsPending } from '../reducers/tagsReducer.js';
import { getTechnicsError, getTechnics, getTechnicsPending } from '../reducers/technicsReducer.js';

import { compare } from '../functions';

let defaultTechnics = [];
let defaultTags = [];

function AddCDream(props) {
    const classes = useStyles();
    const { lang, themeMode, history, auth, setSnackbar, tags, tagsError, tagsPending, fetchTags, technics, technicsError, technicsPending, fetchTechnics } = props;
    if (tagsError) {
        console.log("AddCDream");
        console.log(tagsError);
    }
    if (technicsError) {
        console.log("AddCDream");
        console.log(technicsError);
    }
    const muiTheme = createMuiTheme(themeMode);
    Object.assign(muiTheme, {
        overrides: {
            MUIRichTextEditor: {
                root: {
                    border: "1px solid gray",
                    borderRadius: '4px',
                    height: '100%',
                    //Весь компонент
                },
                container: {
                    height: '100%',
                    margin: '0 !Important',
                    //Без шапки
                },
                toolbar: {
                    //textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    height: '20%',
                    minHeight: '48px',
                    margin: '0 !Important',
                    borderBottom: "1px solid gray",
                    borderRadius: '4px',
                },
                placeHolder: {
                    height: '72%',
                },
                editor: {
                    height: '72%',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    //Эдитор
                },
                editorContainer: {
                    margin: '0 !Important',
                    padding: "0px 14px",
                    borderRadius: '4px',
                    position: 'relative',
                    boxSizing: 'border-box',
                    maxHeight: '100%',
                    overflow: 'auto',
                    //Редактор
                },
            }
        }
    })
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [titleText, setTitleText] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [contentText, setContentText] = React.useState();
    const [prevContentText, setPrevContentText] = React.useState();
    const [selectedLocations, setselectedLocations] = React.useState([]);
    const [selectedTechnics, setselectedTechnics] = React.useState([]);
    const [realisticsValue, setRealisticsValue] = React.useState(1);

    const addLocation = () => {
        saveToLocalStorage();
        history.push({
            pathname: "/addlocation",
            defaultData: {
                prevUrl: "/addcdream",
            }
        });
    };
    const handleChangeRealistics = (event, newValue) => {
        setRealisticsValue(newValue);
    };

    const handleChangeLocations = (event, value) => {
        setselectedLocations(value);
    };

    const handleChangeTechnics = (event, value) => {
        setselectedTechnics(value);
    };

    const blurTitle = (event) => {
        setTitleText(event.target.value);
    };

    const handleDateChange = date => {
        saveToLocalStorage();
        setSelectedDate(date);
    };

    const changeContent = (state) => {
        const currCont = state.getCurrentContent();
        const convert = convertToRaw(currCont);
        const content = JSON.stringify(convert);
        if (prevContentText !== content) {
            saveToLocalStorage();
            setPrevContentText(content);
        }
    };

    const savepost = () => {
        setIsLoading(true);
        let havErr = false;
        let errorMessage = '';
        if (typeof (titleText) !== 'undefined') {
            if (titleText.length === 0) {
                errorMessage = lang.currLang.errors.EmptyTitle;
                havErr = true;
            }
        }
        else {
            errorMessage = lang.currLang.errors.EmptyTitle;
            havErr = true;
        }
        if (typeof (prevContentText) !== 'undefined') {
            if (JSON.parse(prevContentText).blocks[0].text.length === 0) {
                errorMessage = lang.currLang.errors.EmptyDream;
                havErr = true;
            }
        }
        else {
            errorMessage = lang.currLang.errors.EmptyDream;
            havErr = true;
        }
        if (havErr) {
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
            if (isEditMode) {
                let hasChanges = false;
                let tagChanges = false;
                let techChanges = false;
                let postData = {
                    post_id: props.location.defaultData.post_id,
                };

                if (props.location.defaultData.post_title !== titleText) {
                    postData.title = titleText;
                    hasChanges = true;
                }

                if (props.location.defaultData.dream_date.getTime() !== selectedDate.getTime()) {
                    postData.dreamDate = selectedDate.toLocaleString("ru-RU", { timeZone: 'Europe/London' });
                    hasChanges = true;
                }

                if (props.location.defaultData.post_content !== prevContentText) {
                    postData.content = prevContentText;
                    hasChanges = true;
                }

                if (props.location.defaultData.rating !== realisticsValue) {
                    postData.rating = realisticsValue;
                    hasChanges = true;
                }

                if (defaultTechnics.length === selectedTechnics.length) {
                    if (!compare(defaultTechnics, selectedTechnics)) {
                        hasChanges = true;
                        techChanges = true;
                    }
                }
                else {
                    hasChanges = true;
                    techChanges = true;
                }

                if (defaultTags.length === selectedLocations.length) {
                    if (!compare(defaultTags, selectedLocations)) {
                        hasChanges = true;
                        tagChanges = true;
                    }
                }
                else {
                    hasChanges = true;
                    tagChanges = true;
                }

                if (hasChanges) {
                    if (tagChanges) {
                        let deleteTags = defaultTags.filter(item1 =>
                            !selectedLocations.some(item2 => (
                                item2.id === item1.id)
                            )
                        );
                        let addTags = selectedLocations.filter(item1 =>
                            !defaultTags.some(item2 => (
                                item2.id === item1.id)
                            )
                        );
                        if (addTags.length > 0) {
                            let add = {};
                            addTags.map((item, key) => (
                                add[key] = item
                            ));
                            postData.tags = { ...postData.tags, add: add };
                        }
                        if (deleteTags.length > 0) {
                            let remove = {};
                            deleteTags.map((item, key) => (
                                remove[key] = item
                            ));
                            postData.tags = { ...postData.tags, remove: remove };
                        }
                    }
                    if (techChanges) {
                        let deleteTech = defaultTechnics.filter(item1 =>
                            !selectedTechnics.some(item2 => (
                                item2.id === item1.id)
                            )
                        );
                        let addTech = selectedTechnics.filter(item1 =>
                            !defaultTechnics.some(item2 => (
                                item2.id === item1.id)
                            )
                        );
                        if (addTech.length > 0) {
                            let add = {};
                            addTech.map((item, key) => (
                                add[key] = item
                            ));
                            postData.technics = { ...postData.technics, add: add };
                        }
                        if (deleteTech.length > 0) {
                            let remove = {};
                            deleteTech.map((item, key) => (
                                remove[key] = item
                            ));
                            postData.technics = { ...postData.technics, remove: remove };
                        }
                    }
                    instance.post('/actions/users/updatepost', postData)
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
                            window.localStorage.removeItem("postСDreamData");
                            history.push("/dreams")
                        })
                        .catch(err => {
                            console.log(err);
                            setIsLoading(false);
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
                    setIsLoading(false);
                }
            }
            else {
                let postData = {
                    title: titleText,
                    dreamDate: selectedDate.toLocaleString("ru-RU", { timeZone: 'Europe/London' }),
                    content: prevContentText,
                    create_user: auth.user.id,
                    rating: realisticsValue,
                    post_type: 1,
                    nickname: auth.user.nickname,
                    tags: selectedLocations,
                    technics: selectedTechnics
                }

                instance.post('/actions/users/createpost', postData)
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
                        window.localStorage.removeItem("postСDreamData");
                        history.push("/luciddreams")
                    })
                    .catch(err => {
                        setIsLoading(false);
                    });
            }
        }
    };

    const saveToLocalStorage = () => {
        let data = {};
        if (window.localStorage.getItem("postСDreamData")) {
            data = JSON.parse(window.localStorage.getItem("postСDreamData"));
        }
        data.selectedDate = selectedDate;
        if (titleText.length !== 0) {
            data.titleText = titleText;
        }
        if (typeof prevContentText !== 'undefined')
            if (prevContentText.length !== 0) {
                data.contentText = prevContentText;
            }
        window.localStorage.setItem("postСDreamData", JSON.stringify(data));
    };

    const loadFromLocalStorage = () => {
        const { selectedDate, titleText, contentText } = JSON.parse(window.localStorage.getItem("postСDreamData"));
        if (typeof selectedDate !== 'undefined') {
            setSelectedDate(new Date(selectedDate));
        }
        if (typeof titleText !== 'undefined') {
            setTitleText(titleText);
        }
        if (typeof contentText !== 'undefined') {
            setContentText(contentText);
            setPrevContentText(contentText);
        }
    };

    React.useEffect(() => {
        if (window.localStorage.getItem("postСDreamData"))
            loadFromLocalStorage();

        defaultTechnics = [];
        defaultTags = [];

        fetchTags();
        fetchTechnics();

        if (typeof (props.location.defaultData) !== 'undefined') {
            setIsEditMode(true);
            defaultTechnics = [];
            defaultTags = [];
            const { post_title, dream_date, post_content, technics, tags, rating } = props.location.defaultData;
            setTitleText(post_title);
            setSelectedDate(dream_date);
            setContentText(post_content);
            setPrevContentText(post_content);

            if (typeof tags[0][0] === 'string') {
                tags.forEach(item => {
                    let location = {};
                    location.id = Number(item[0]);
                    location.name_rus = item[1];
                    location.name_eng = item[2];
                    location.img_url = item[3];
                    defaultTags.push(location);
                });
                setselectedLocations(defaultTags);
            }

            if (typeof technics[0][0] === 'string') {
                technics.forEach(item => {
                    let tech = {};
                    tech.id = Number(item[0]);
                    tech.name_rus = item[1];
                    tech.name_eng = item[2];
                    defaultTechnics.push(tech);
                });
                setselectedTechnics(defaultTechnics);
            }

            setRealisticsValue(rating);
        }
    }, [props.location.defaultData, lang.currLang]);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <div className={classes.root} >
                <Grid className={classes.mainGridContainer}
                    container
                    direction="column"
                    justify="center"
                    alignItems="stretch" >
                    <Grid item xs={11} className={classes.mainGridBodyItem}>
                        <Paper className={classes.paper}>
                            <Grid className={`${classes.mainGridContainer} ${classes.noWrap}`}
                                container
                                direction="column"
                                justify="center"
                                alignItems="center" >
                                <Grid item xs={2} className={classes.fullMinWidth} >
                                    <TextField className={classes.inputDiv}
                                        required
                                        id="outlined-required"
                                        value={titleText}
                                        label={lang.currLang.texts.title}
                                        variant="outlined"
                                        onChange={(e) => { blurTitle(e) }}
                                        onBlur={saveToLocalStorage}
                                    />
                                </Grid>
                                <Grid item xs={1} className={classes.fullMinWidth} >
                                    <MuiPickersUtilsProvider utils={DateFnsUtils}
                                        locale={lang.currLang.current === "Ru"
                                            ? ruLocale
                                            : enLocale}
                                    >
                                        <Grid className={classes.pickerGridContainer}
                                            container
                                            direction="row"
                                            justify="center"
                                            alignItems="stretch" >
                                            <Grid item xs={7} >
                                                <KeyboardDatePicker className={classes.pickers}
                                                    id="date-picker-dialog"
                                                    label={lang.currLang.texts.pickDate}
                                                    format="dd.MM.yyyy"
                                                    value={selectedDate}
                                                    onChange={handleDateChange}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change date',
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={5} >
                                                <KeyboardTimePicker className={classes.pickers}
                                                    id="time-picker"
                                                    label={lang.currLang.texts.pickTime}
                                                    value={selectedDate}
                                                    onChange={handleDateChange}
                                                    ampm={false}
                                                    KeyboardButtonProps={{
                                                        'aria-label': 'change time',
                                                    }}
                                                />
                                            </Grid>
                                        </Grid>
                                    </MuiPickersUtilsProvider>
                                </Grid>
                                <Grid item xs={4} className={classes.fullMinWidth} >
                                    <div className={classes.inputScrollableDiv}>
                                        <MUIRichTextEditor
                                            value={contentText}
                                            onChange={changeContent}
                                            label={lang.currLang.texts.content}
                                            inlineToolbar={false}
                                            controls={[
                                                "bold",
                                                "italic",
                                                "underline",
                                                "strikethrough",
                                                "colorfill",
                                            ]}
                                            customControls={[
                                                {
                                                    name: "colorfill",
                                                    icon: <FormatColorFillIcon />,
                                                    type: "inline",
                                                    inlineStyle: {
                                                        backgroundColor: "yellow",
                                                        color: "black"
                                                    }
                                                }
                                            ]}
                                        />
                                    </div>
                                </Grid>
                                <Grid item xs={2} className={classes.fullMinWidth}>
                                    <Grid container
                                        className={classes.mainGridContainer}
                                        direction="row"
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs={12} style={{ position: 'relative' }}>
                                            {!technicsPending
                                                ? <Autocomplete
                                                    multiple
                                                    className={classes.inputDiv}
                                                    id="technics-outlined"
                                                    size="small"
                                                    options={technics}
                                                    getOptionLabel={option => (
                                                        <Chip
                                                            size="small"
                                                            className={classes.chip}
                                                            label={
                                                                lang.currLang.current === "Ru"
                                                                    ? option.name_rus
                                                                    : option.name_eng
                                                            }
                                                        />
                                                    )}
                                                    defaultValue={
                                                        defaultTechnics.map(item => {
                                                            return technics[item.id - 1];
                                                        })}
                                                    onChange={(event, value) => handleChangeTechnics(event, value)}
                                                    filterSelectedOptions
                                                    renderInput={params => (
                                                        <TextField
                                                            {...params}
                                                            label={lang.currLang.texts.technics}
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                                : <div className={classes.inputDiv}>
                                                    <LinearProgress />
                                                </div>
                                            }
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={2} className={classes.fullMinWidth}>
                                    <Grid container
                                        className={classes.mainGridContainer}
                                        direction="row"
                                        justify="center"
                                        alignItems="center"
                                    >
                                        <Grid item xs={10} style={{ position: 'relative' }}>
                                            {!tagsPending
                                                ? <Autocomplete
                                                    multiple
                                                    className={classes.inputDiv}
                                                    id="tags-outlined"
                                                    size="small"
                                                    options={tags}
                                                    getOptionLabel={option => (
                                                        <Chip
                                                            size="small"
                                                            className={classes.chip}
                                                            avatar={
                                                                <Avatar src={option.img_url} />
                                                            }
                                                            label={
                                                                lang.currLang.current === "Ru"
                                                                    ? option.name_rus
                                                                    : option.name_eng
                                                            }
                                                        />
                                                    )}
                                                    defaultValue={
                                                        defaultTags.map(item => {
                                                            return tags[item.id - 1];
                                                        })}
                                                    onChange={(event, value) => handleChangeLocations(event, value)}
                                                    filterSelectedOptions
                                                    renderInput={params => (
                                                        <TextField
                                                            {...params}
                                                            label={lang.currLang.texts.tags}
                                                            fullWidth
                                                        />
                                                    )}
                                                />
                                                : <div className={classes.inputDiv}>
                                                    <LinearProgress />
                                                </div>
                                            }
                                        </Grid>
                                        <Grid item xs={2}>
                                            <IconButton onClick={addLocation}>
                                                <AddIcon fontSize="small" />
                                            </IconButton>
                                        </Grid>
                                    </Grid>
                                </Grid>
                                <Grid item xs={1} className={classes.fullMinWidth} >
                                    <div className={classes.div85width}>
                                        <Grid className={classes.ratingGridContainer}
                                            container
                                            direction="row"
                                            justify="center"
                                            alignItems="stretch" >
                                            <Grid item xs={6}>
                                                <Typography variant="body2">
                                                    {lang.currLang.texts.rating}:
                                                </Typography>
                                            </Grid>
                                            <Grid item xs={6}>
                                                <Rating name="simple-controlled"
                                                    value={realisticsValue}
                                                    onChange={handleChangeRealistics}
                                                />
                                            </Grid>
                                        </Grid>
                                    </div>
                                </Grid>
                            </Grid>
                        </Paper>
                    </Grid>
                    <Grid item xs={1} className={classes.mainGridBodyItem} >
                        {isLoading
                            ? <LinearProgress />
                            : <Grid
                                container
                                direction="row"
                                justify="space-evenly"
                                alignItems="center"
                            >
                                <Grid item>
                                    <Button
                                        variant="contained"
                                        color="secondary"
                                        className={classes.actionButton}
                                        onClick={() => {
                                            window.localStorage.removeItem("postСDreamData");
                                            isEditMode
                                                ? history.push("/dreams")
                                                : history.push("/luciddreams");
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
                                        onClick={() => savepost()}
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
        </MuiThemeProvider >
    );
};

AddCDream.propTypes = {
    setSnackbar: PropTypes.func.isRequired,
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    tagsError: PropTypes.object.isRequired,
    tags: PropTypes.object.isRequired,
    tagsPending: PropTypes.object.isRequired,
    technicsError: PropTypes.object.isRequired,
    technics: PropTypes.object.isRequired,
    technicsPending: PropTypes.object.isRequired,
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        auth: store.auth,
        tagsError: getTagsError(store),
        tags: getTags(store),
        tagsPending: getTagsPending(store),
        technicsError: getTechnicsError(store),
        technics: getTechnics(store),
        technicsPending: getTechnicsPending(store),
    }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setSnackbar: snackbar => dispatch(setSnackbar(snackbar)),
    fetchTags: fetchTagsAction,
    fetchTechnics: fetchTechnicsAction,
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddCDream);