import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import clsx from 'clsx';
import DateFnsUtils from '@date-io/date-fns';
import ruLocale from "date-fns/locale/ru";
import enLocale from "date-fns/locale/ru";

import SnackbarContent from '@material-ui/core/SnackbarContent';
import LinearProgress from '@material-ui/core/LinearProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from "@material-ui/core/FormControl";
import IconButton from '@material-ui/core/IconButton';
import InputLabel from "@material-ui/core/InputLabel";
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import Snackbar from '@material-ui/core/Snackbar';
import Avatar from "@material-ui/core/Avatar";
import Select from "@material-ui/core/Select";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import Grid from '@material-ui/core/Grid';

import MUIRichTextEditor from 'mui-rte';
import { convertToRaw } from 'draft-js';

import Rating from "@material-ui/lab/Rating";

import { MuiThemeProvider, createMuiTheme, useTheme, makeStyles } from '@material-ui/core/styles';

import { MuiPickersUtilsProvider, KeyboardTimePicker, KeyboardDatePicker } from '@material-ui/pickers';

import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import ErrorIcon from '@material-ui/icons/Error';
import CloseIcon from '@material-ui/icons/Close';

import { useStyles } from '../styles/Styles';

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

const useStyles1 = makeStyles(theme => ({
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing(1),
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
}));

function MySnackbarContentWrapper(props) {
    const classes = useStyles1();
    const { className, message, onClose } = props;
    const Icon = ErrorIcon;

    return (
        <SnackbarContent
            className={clsx(classes.error, className)}
            aria-describedby="client-snackbar"
            message={
                <span id="client-snackbar" className={classes.message}>
                    <Icon className={clsx(classes.icon, classes.iconVariant)} />
                    <Typography className={classes.mainGridContainer}
                        align='center'
                        variant='body2'>
                        {message}
                    </Typography>
                </span>
            }
            action={[
                <IconButton key="close" aria-label="close" color="inherit" onClick={onClose}>
                    <CloseIcon className={classes.icon} />
                </IconButton>,
            ]}
        />
    );
}

let defaultTechnics = [];
let defaultTags = [];

function AddCDream(props) {
    const classes = useStyles();
    const theme = useTheme();
    const { lang, themeMode, history, auth } = props;
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
    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const [snackbarMessage, setSnackbarMessage] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);
    const [titleText, setTitleText] = React.useState('');
    const [selectedDate, setSelectedDate] = React.useState(new Date());
    const [contentText, setContentText] = React.useState();
    const [prevContentText, setPrevContentText] = React.useState();
    const [selectedLocations, setselectedLocations] = React.useState([]);
    const [selectedTechnics, setselectedTechnics] = React.useState([]);
    const [realisticsValue, setRealisticsValue] = React.useState(1);
    const [locations, setLocations] = React.useState({});
    const [technics, setTechnics] = React.useState({});

    const handleChangeRealistics = (event, newValue) => {
        setRealisticsValue(newValue);
    };
    const handleChangeLocations = (event) => {
        setselectedLocations(event.target.value);
    };
    const handleChangeTechnics = (event) => {
        setselectedTechnics(event.target.value);
    };
    const blurTitle = (event) => {
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
        if (typeof (titleText) !== 'undefined') {
            if (titleText.length === 0) {
                setSnackbarMessage(lang.currLang.errors.EmptyTitle);
                havErr = true;
            }
        }
        else {
            setSnackbarMessage(lang.currLang.errors.EmptyTitle);
            havErr = true;
        }
        if (typeof (prevContentText) !== 'undefined') {
            if (JSON.parse(prevContentText).blocks[0].text.length === 0) {
                setSnackbarMessage(lang.currLang.errors.EmptyDream);
                havErr = true;
            }
        }
        else {
            setSnackbarMessage(lang.currLang.errors.EmptyDream);
            havErr = true;
        }
        if (havErr) {
            setOpenSnackbar(true);
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

                if (props.location.defaultData.rating !== realisticsValue) {
                    postData.rating = realisticsValue;
                    hasChanges = true;
                }

                if (!areArraysEqualSets(defaultTechnics, selectedTechnics)) {
                    hasChanges = true;
                    let deleteTechnics = defaultTechnics.filter(item1 =>
                        !selectedTechnics.some(item2 => (
                            item2 === item1)
                        )
                    );
                    let addTechnics = selectedTechnics.filter(item1 =>
                        !defaultTechnics.some(item2 => (
                            item2 === item1)
                        )
                    );
                    if (addTechnics.length > 0) {
                        let add = {};
                        addTechnics.map((item, key) => (
                            add[key] = item
                        ));
                        postData.technics = { ...postData.technics, add: add };
                    }
                    if (deleteTechnics.length > 0) {
                        let remove = {};
                        deleteTechnics.map((item, key) => (
                            remove[key] = item
                        ));
                        postData.technics = { ...postData.technics, remove: remove };
                    }
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
                            history.push("/dreams")
                        })
                        .catch(err => {
                            console.log(err);
                            setIsLoading(false);
                        });
                }
                else {
                    setSnackbarMessage(lang.currLang.errors.NoChanges);
                    setOpenSnackbar(true);
                    setIsLoading(false);
                }
            }
            else {
                //let convert = JSON.stringify(prevContentText);

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

                instance
                    .post('/actions/users/createpost', postData)
                    .then(res => {
                        setIsLoading(false);
                        history.push("/luciddreams")
                    })
                    .catch(err => {
                        setIsLoading(false);
                    });
            }
        }
    };

    const handleCloseSnackbar = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }
        setOpenSnackbar(false);
    };

    React.useEffect(() => {
        instance.get("/gettags")
            .then(res => {
                setLocations(res.data);
            })
            .catch(err => {
                console.log(err)
            });
        instance.get("/gettechnics")
            .then(res => {
                setTechnics(res.data);
            })
            .catch(err => {
                console.log(err)
            });

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
                lang.currLang.current === "Ru"
                    ? tags.map(item => defaultTags.push(item[1]))
                    : tags.map(item => defaultTags.push(item[2]));
                setselectedLocations(defaultTags);
            }

            if (typeof technics[0][0] === 'string') {
                lang.currLang.current === "Ru"
                    ? technics.map(item => defaultTechnics.push(item[1]))
                    : technics.map(item => defaultTechnics.push(item[2]));
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
                            <Grid className={classes.mainGridContainer}
                                style={{ flexWrap: 'nowrap' }}
                                container
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
                                        onChange={(e) => { blurTitle(e) }}
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
                                <Grid item xs={2} className={classes.fullMinWidth} >
                                    <FormControl className={classes.inputDiv}>
                                        <InputLabel id="technics-chip-label">
                                            {lang.currLang.texts.technics}
                                        </InputLabel>
                                        <Select
                                            labelId="technics-chip-label"
                                            id="technics-chip"
                                            multiple
                                            value={selectedTechnics}
                                            onChange={handleChangeTechnics}
                                            input={
                                                <Input id="select-technics-chip" />
                                            }
                                            renderValue={selected =>
                                                (
                                                    <div className={classes.chips}>
                                                        {selected.map(value => (
                                                            <Chip
                                                                size="small"
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
                                            {Object.keys(technics)
                                                .map(item =>
                                                    <MenuItem
                                                        key={technics[item].id + ' chip'}
                                                        value={
                                                            lang.currLang.current === "Ru"
                                                                ? technics[item].name_rus
                                                                : technics[item].name_eng
                                                        }
                                                        style={getStyles(technics[item].name_eng, selectedTechnics, theme)}
                                                    >
                                                        {lang.currLang.current === "Ru"
                                                            ? technics[item].name_rus
                                                            : technics[item].name_eng}
                                                    </MenuItem>
                                                )}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={2} className={classes.fullMinWidth} >
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
                                <Grid item xs={1} className={classes.fullMinWidth} >
                                    <div className={classes.div85width}>
                                        <Grid className={classes.ratingGridContainer}
                                            container
                                            direction="row"
                                            justify="center"
                                            alignItems="stretch" >
                                            <Grid item xs={6}>
                                                <Typography component="legend">
                                                    {lang.currLang.texts.rating} :
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
            <Snackbar
                open={openSnackbar}
                onClose={handleCloseSnackbar}
                autoHideDuration={3000}>
                <MySnackbarContentWrapper
                    className={classes.margin}
                    onClose={handleCloseSnackbar}
                    variant='error'
                    message={snackbarMessage}
                />
            </Snackbar>
        </MuiThemeProvider >
    );
};

AddCDream.propTypes = {
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
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddCDream);