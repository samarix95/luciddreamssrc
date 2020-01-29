import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import DialogTitle from "@material-ui/core/DialogTitle";
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from '@material-ui/core/Typography';
import RadioGroup from "@material-ui/core/RadioGroup";
import Container from "@material-ui/core/Container";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import Avatar from "@material-ui/core/Avatar";
import Select from "@material-ui/core/Select";
import Button from '@material-ui/core/Button';
import Radio from "@material-ui/core/Radio";
import Input from "@material-ui/core/Input";
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chip from "@material-ui/core/Chip";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import DreamCard from './muiltiple/DreamCard.jsx';
import { useStyles } from '../styles/Styles.js';
import { instance } from './Config.js';

function ViewDreams(props) {
    const { lang, themeMode, history, auth } = props;
    const muiTheme = createMuiTheme(themeMode);
    const classes = useStyles();
    const [isLoading, setIsLoading] = React.useState(true);
    const [dreams, setDreams] = React.useState([]);
    const [locations, setLocations] = React.useState({});
    const [openDialog, setOpenDialog] = React.useState(false);
    const [locationChecked, setLocationChecked] = React.useState(false);
    const [selectedLocations, setSelectedLocations] = React.useState(null);
    const [postType, setPostType] = React.useState(2);
    const [filterData, setFilterData] = React.useState({
        location: null,
        type: 2,
    });

    const openFilter = () => {
        setOpenDialog(true);
    };

    const closeFilter = () => {
        setOpenDialog(false);
    };

    const resetFilter = () => {
        setLocationChecked(false);
        setSelectedLocations(null);
        setPostType(2);
        let newFilterData = filterData;
        newFilterData = { ...newFilterData, location: null };
        newFilterData = { ...newFilterData, type: 2 };
        setFilterData(newFilterData);
        closeFilter();
    };

    const applyFilter = () => {
        let newFilterData = filterData;

        if (locationChecked) newFilterData = { ...newFilterData, location: selectedLocations };
        else newFilterData = { ...newFilterData, location: null };

        newFilterData = { ...newFilterData, type: postType };
        setFilterData(newFilterData);
        closeFilter();
    };

    const handleLocationChecked = (event) => {
        setLocationChecked(event.target.checked);
    };

    const handleChangeLocations = (event) => {
        setSelectedLocations(event.target.value);
    };

    const handleChangepostType = (event) => {
        setPostType(parseInt(event.target.value));
    };

    const loadPosts = React.useCallback(() => {
        setIsLoading(true);
        instance.post("/actions/users/getuserposts", { id: auth.user.id })
            .then(res => {
                setDreams(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
            });
        instance.get("/gettags")
            .then(res => {
                setLocations(res.data);
            })
            .catch(err => {
                alert("Error load locations from server");
                console.log(err)
            });
    }, [auth.user.id]);

    React.useEffect(() => {
        loadPosts();

        if (typeof (props.location.defaultData) !== 'undefined') {
            let newFilterData = filterData;
            newFilterData = { ...newFilterData, location: props.location.defaultData.location.name_eng };
            setFilterData(newFilterData);
            setLocationChecked(true);
            lang.currLang.current === "Ru" ? setSelectedLocations(props.location.defaultData.location.name_rus) : setSelectedLocations(props.location.defaultData.location.name_eng);
        }

    }, [loadPosts]);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Dialog open={openDialog}
                onClose={closeFilter}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {lang.currLang.buttons.Filter}
                </DialogTitle>
                <DialogContent>
                    <Grid container
                        className={`${classes.height12}`}
                        direction="column"
                        justify="center"
                        alignItems="stretch"
                    >
                        <Grid item className={`${classes.mainGridBodyItem} ${classes.height6} ${classes.margin}`}>
                            <Grid container
                                direction="row"
                                justify="center"
                                alignItems="stretch"
                            >
                                <Grid item xs={3} className={`${classes.relativePosition}`}>
                                    <Checkbox className={classes.centerButton}
                                        color="primary"
                                        checked={locationChecked}
                                        onChange={handleLocationChecked}
                                        inputProps={{ 'aria-Location': 'primary checkbox' }}
                                    />
                                </Grid>
                                <Grid item xs={9}>
                                    <FormControl className={`${classes.aboutGridItem}`} disabled={!locationChecked}>
                                        <InputLabel id="location-chip-label">
                                            {lang.currLang.texts.tags}
                                        </InputLabel>
                                        <Select
                                            labelId="location-chip-label"
                                            id="location-chip"
                                            value={selectedLocations}
                                            onChange={handleChangeLocations}
                                            input={
                                                <Input id="select-location-chip" />
                                            }
                                            renderValue={selected =>
                                                <div className={classes.chips}>
                                                    <Chip size="small"
                                                        avatar={
                                                            locations.length
                                                                ? < Avatar src={locations.find(locations => locations.name_rus === selectedLocations || locations.name_eng === selectedLocations).img_url} />
                                                                : null
                                                        }
                                                        key={selectedLocations}
                                                        label={selectedLocations}
                                                        className={classes.chip}
                                                    />
                                                </div>
                                            }
                                            MenuProps={{
                                                PaperProps: {
                                                    style: {
                                                        maxHeight: 48 * 5 + 8,
                                                        width: 250
                                                    }
                                                }
                                            }}
                                        >
                                            {Object
                                                .keys(locations)
                                                .map(item =>
                                                    <MenuItem key={locations[item].id + ' chip'}
                                                        value={lang.currLang.current === "Ru" ? locations[item].name_rus : locations[item].name_eng}
                                                    >
                                                        {lang.currLang.current === "Ru" ? locations[item].name_rus : locations[item].name_eng}
                                                    </MenuItem>)
                                            }
                                        </Select>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Grid>
                        <Grid item className={`${classes.mainGridBodyItem} ${classes.height6} ${classes.margin}`}>
                            <RadioGroup className={`${classes.height12} ${classes.margin}`}
                                aria-label="post-type"
                                value={postType}
                                onChange={handleChangepostType}
                            >
                                <FormControlLabel
                                    value={0}
                                    control={<Radio color="primary" />}
                                    label={lang.currLang.texts.Dream}
                                />
                                <FormControlLabel
                                    value={1}
                                    control={<Radio color="primary" />}
                                    label={lang.currLang.texts.Cdream}
                                />
                                <FormControlLabel
                                    value={2}
                                    control={<Radio color="primary" />}
                                    label={lang.currLang.texts.All}
                                />
                            </RadioGroup>
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button color="secondary" onClick={closeFilter} >
                        {lang.currLang.texts.cancel}
                    </Button>
                    <Button color="primary" onClick={resetFilter} >
                        {lang.currLang.buttons.Reset}
                    </Button>
                    <Button color="primary" autoFocus onClick={applyFilter} >
                        {lang.currLang.buttons.Apply}
                    </Button>
                </DialogActions>
            </Dialog>
            <div className={classes.root}>
                <Grid container
                    className={`${classes.height12}`}
                    direction="column"
                    justify="center"
                    alignItems="stretch"
                >
                    <Grid item className={`${classes.hiddenOverflow} ${classes.height11}`}>
                        {isLoading
                            ? <div className={classes.formControl}>
                                <CircularProgress />
                            </div>
                            : <Container className={classes.mainGridDreamsBodyItemContainer}>
                                <Paper className={classes.mainGridDreamsBodyItemContainerPaper}>
                                    {dreams.length !== 0
                                        ? <Grid className={`${classes.mainGridDreamsContainer}`}
                                            container
                                            direction="column"
                                            justify="center"
                                            alignItems="stretch"
                                        >
                                            {dreams
                                                .filter(item => filterData.location ? item.tags.includes(item.tags.find(tag => tag[0] === locations.find(locations => locations.name_eng === filterData.location || locations.name_rus === filterData.location).id.toString())) : item)
                                                .filter(item => filterData.type === 2 ? item : item.post_type === filterData.type)
                                                .map((item, key) => (
                                                    <DreamCard
                                                        item={item}
                                                        key={key}
                                                        history={history}
                                                        loadPosts={loadPosts}
                                                    />
                                                ))
                                            }
                                        </Grid>
                                        : <div>
                                            <div className={classes.divDreamsNotFound} />
                                            <div className={`${classes.divDreamsNotFound} ${classes.divDreamsNotFoundImg}`} />
                                            <div className={classes.divDreamsNotFound}>
                                                <Typography>
                                                    {lang.currLang.texts.NoDreams}
                                                </Typography>
                                            </div>
                                        </div>
                                    }
                                </Paper>
                            </Container>
                        }
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
                                    onClick={() => { typeof (props.location.defaultData) !== 'undefined' ? history.push(props.location.defaultData.prevUrl) : history.push("/luciddreams") }}
                                >
                                    {lang.currLang.buttons.close}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button className={classes.actionButton}
                                    variant="contained"
                                    color="primary"
                                    onClick={openFilter}
                                >
                                    {lang.currLang.buttons.Filter}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </MuiThemeProvider >
    );
}

ViewDreams.propTypes = {
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

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewDreams);