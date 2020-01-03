import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";
import enLocale from "date-fns/locale/ru";

import LinearProgress from '@material-ui/core/LinearProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import Select from "@material-ui/core/Select";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import Grid from '@material-ui/core/Grid';

import MUIRichTextEditor from 'mui-rte';
import { convertToRaw } from 'draft-js';

import { MuiThemeProvider, createMuiTheme, useTheme } from '@material-ui/core/styles';

import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';

import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';

import { useStyles } from '../styles/Styles';
import { setSnackbar } from '../actions/Actions';
import { SET_SNACKBAR_MODE } from "../actions/types";

import { instance } from './Config';

import { areArraysEqualSets } from '../functions';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

function getStyles(name, selectedLocations, theme) {
    return {
        fontWeight:
            selectedLocations.indexOf(name) === -1
                ? theme.typography.fontWeightSmall
                : theme.typography.fontWeightMedium
    };
}

let defaultTags = [];

function AddDream(props) {
    const classes = useStyles();
    const theme = useTheme();
    const { lang, themeMode, history, auth, setSnackbar } = props;
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
                },
                editor: {
                    height: '69%',
                    width: '100%',
                    position: 'relative',
                    overflow: 'hidden',
                    //Эдитор
                },
                editorContainer: {
                    padding: "18.5px 14px",
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
    const [locations, setLocations] = React.useState({});

    const handleChangeLocations = (event) => {
        setselectedLocations(event.target.value);
    };

    const changeTitle = (event) => {
        setTitleText(event.target.value);
    };

    const handleDateChange = date => {
        setSelectedDate(date);
    };

    const changeContent = (state) => {
        const currCont = state.getCurrentContent();
        const convert = convertToRaw(currCont);
        const content = JSON.stringify(convert);
        if (prevContentText !== content) {
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

                if (!areArraysEqualSets(defaultTags, selectedLocations)) {
                    hasChanges = true;
                    let deleteTags = defaultTags.filter(item1 =>
                        !selectedLocations.some(item2 => (
                            item2 === item1)
                        )
                    );
                    let addTags = selectedLocations.filter(item1 =>
                        !defaultTags.some(item2 => (
                            item2 === item1)
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

                if (hasChanges) {
                    instance
                        .post('/actions/users/updatepost', postData)
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
                    post_type: 0,
                    nickname: auth.user.nickname,
                    tags: selectedLocations,
                }
                instance
                    .post('/actions/users/createpost', postData)
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
                        history.push("/luciddreams")
                    })
                    .catch(err => {
                        setIsLoading(false);
                    });
            }
        }
    };

    React.useEffect(() => {
        instance.get("/gettags")
            .then(res => {
                setLocations(res.data);
            })
            .catch(err => {
                console.log(err)
            });

        if (typeof (props.location.defaultData) !== 'undefined') {
            setIsEditMode(true);
            defaultTags = [];
            const { post_title, dream_date, post_content, tags } = props.location.defaultData;
            setTitleText(post_title);
            setSelectedDate(dream_date);
            setContentText(post_content);
            setPrevContentText(post_content);

            if (typeof tags[0][0] === 'string') {
                lang.currLang.current === "Ru"
                    ? tags.map(item => defaultTags.push(item[1]))
                    : tags.map(item => defaultTags.push(item[2]));
                setselectedLocations(defaultTags);
            }
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
                            <Grid container
                                className={classes.mainGridContainer}
                                direction="column"
                                justify="center"
                                alignItems="center"
                            >
                                <Grid item xs={2} className={classes.fullMinWidth} >
                                    <TextField className={classes.inputDiv}
                                        required
                                        id="outlined-required"
                                        value={titleText}
                                        label={lang.currLang.texts.title}
                                        variant="outlined"
                                        onChange={(e) => { changeTitle(e) }}
                                    />
                                </Grid>
                                <Grid item xs={2} className={classes.fullMinWidth} >
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
                                <Grid item xs={5} className={classes.fullMinWidth} >

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
                                <Grid item xs={3} className={classes.fullMinWidth} >
                                    <FormControl className={classes.inputDiv}>
                                        <InputLabel id="location-chip-label">
                                            {lang.currLang.texts.tags}
                                        </InputLabel>
                                        <Select
                                            labelId="location-chip-label"
                                            id="location-chip"
                                            multiple
                                            value={selectedLocations}
                                            onChange={handleChangeLocations}
                                            input={
                                                <Input id="select-location-chip" />
                                            }
                                            renderValue={selected =>
                                                (
                                                    <div className={classes.chips}>
                                                        {selected.map(value => (
                                                            <Chip
                                                                size="small"
                                                                avatar={
                                                                    locations.length
                                                                        ? lang.currLang.current === "Ru"
                                                                            ? < Avatar
                                                                                alt={locations.find(locations => locations.name_rus === value).name_eng}
                                                                                src={locations.find(locations => locations.name_rus === value).img_url}
                                                                            />
                                                                            : < Avatar
                                                                                alt={locations.find(locations => locations.name_eng === value).name_eng}
                                                                                src={locations.find(locations => locations.name_eng === value).img_url}
                                                                            />
                                                                        : null
                                                                }
                                                                key={value}
                                                                label={value}
                                                                className={classes.chip}
                                                            />
                                                        ))}
                                                    </div>
                                                )
                                            }
                                            MenuProps={MenuProps}
                                        >
                                            {Object.keys(locations)
                                                .map(item =>
                                                    <MenuItem
                                                        key={locations[item].id + ' chip'}
                                                        value={
                                                            lang.currLang.current === "Ru"
                                                                ? locations[item].name_rus
                                                                : locations[item].name_eng
                                                        }
                                                        style={getStyles(locations[item].name_eng, selectedLocations, theme)}
                                                    >
                                                        {lang.currLang.current === "Ru"
                                                            ? locations[item].name_rus
                                                            : locations[item].name_eng}
                                                    </MenuItem>
                                                )}
                                        </Select>
                                    </FormControl>
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
                                            isEditMode
                                                ? history.push("/dreams")
                                                : history.push("/luciddreams")
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

AddDream.propTypes = {
    setSnackbar: PropTypes.func.isRequired,
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        auth: store.auth,
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
)(AddDream);