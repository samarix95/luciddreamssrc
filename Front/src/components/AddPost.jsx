import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from "@material-ui/core/FormControl";
import InputLabel from "@material-ui/core/InputLabel";
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import MenuItem from "@material-ui/core/MenuItem";
import Avatar from "@material-ui/core/Avatar";
import Select from "@material-ui/core/Select";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Input from "@material-ui/core/Input";
import Chip from "@material-ui/core/Chip";
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';

import Rating from "@material-ui/lab/Rating";

import { MuiThemeProvider, createMuiTheme, useTheme } from '@material-ui/core/styles';

import { useStyles } from '../styles/Styles';

import { instance } from './Config';

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
    PaperProps: {
        style: {
            maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
            width: 250
        }
    }
};

function getStyles(name, personName, theme) {
    return {
        fontWeight:
            personName.indexOf(name) === -1
                ? theme.typography.fontWeightRegular
                : theme.typography.fontWeightMedium
    };
}

function AddPost(props) {
    const classes = useStyles();
    const theme = useTheme();
    const { lang, themeMode, history, clouds, stars } = props;
    const muiTheme = createMuiTheme(themeMode);

    const [realisticsValue, setRealisticsValue] = React.useState(1);

    const [locations, setLocations] = React.useState({});

    const handleChangeRealistics = (event, newValue) => {
        setRealisticsValue(newValue);
    };

    const [personName, setPersonName] = React.useState([]);

    const handleChange = event => {
        setPersonName(event.target.value);
    };

    React.useEffect(() => {
        instance.get("/gettags")
            .then(res => {
                setLocations(res.data);
            })
            .catch(err => {
                console.log(err)
            });
    }, []);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <div className={classes.AppDivDark}>
                <div className={classes.AppDivLight} style={themeMode.palette.type === "light" ? { opacity: 1, } : { opacity: 0, }} />
                {themeMode.palette.type === "light"
                    ?
                    <div className={classes.AppCloudsDiv} style={themeMode.palette.type === "light" ? { opacity: 1, } : { opacity: 0, }} >
                        {clouds.clouds}
                    </div>
                    :
                    <div className={classes.AppStarsDiv} style={themeMode.palette.type === "light" ? { opacity: 0, } : { opacity: 1, }} >
                        {stars.stars}
                    </div>
                }
            </div>
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
                                alignItems="center"
                                spacing={2}
                            >
                                <Grid item xs={2} className={classes.fullMinWidth}>
                                    <TextField className={classes.inputDiv}
                                        required
                                        id="outlined-required"
                                        label="Title"
                                        variant="outlined"
                                    />
                                </Grid>
                                <Grid item xs={5} className={classes.fullMinWidth} >
                                    <TextField className={classes.inputDiv}
                                        required
                                        id="outlined-required"
                                        label="Content"
                                        variant="outlined"
                                    />
                                </Grid>

                                <Grid item xs={3} className={classes.fullMinWidth} >

                                    <FormControl className={classes.formControl}>
                                        <InputLabel id="location-chip-label">Chip</InputLabel>
                                        <Select
                                            labelId="location-chip-label"
                                            id="location-chip"
                                            multiple
                                            value={personName}
                                            onChange={handleChange}
                                            input={<Input id="select-location-chip" />}
                                            renderValue={selected => (
                                                <div className={classes.chips}>
                                                    {selected.map(value => (
                                                        <Chip
                                                            avatar={
                                                                <Avatar alt="Natacha" src="https://www.freeiconspng.com/minicovers/pepe-clipart-png-collection-14.png" />
                                                            }
                                                            key={value}
                                                            label={value}
                                                            className={classes.chip}
                                                        />
                                                    ))}
                                                </div>
                                            )}
                                            MenuProps={MenuProps}
                                        >
                                            {
                                                Object.keys(locations).map(item => 
                                                // {
                                                //     console.log(locations[item].id);
                                                //     console.log(locations[item].name_rus);
                                                //     console.log(locations[item].name_eng);
                                                //     console.log(locations[item].img_url);
                                                    <MenuItem
                                                        key={locations[item].id}
                                                        value={locations[item].name_rus}
                                                        style={getStyles(locations[item].name_rus, personName, theme)}>
                                                        {locations[item].name_rus}
                                                    </MenuItem>
                                                // }
                                                )
                                            }
                                        </Select>
                                    </FormControl>

                                </Grid>

                                <Grid item xs={2} className={classes.fullMinWidth} >
                                    <Box className={classes.inputDiv}
                                        component="fieldset"
                                        borderColor="transparent"
                                    >
                                        <Typography component="legend">
                                            Reatistic
                                        </Typography>
                                        <div style={{ textAlign: 'center' }}>
                                            <Rating name="simple-controlled"
                                                value={realisticsValue}
                                                onChange={handleChangeRealistics}
                                            />
                                        </div>
                                    </Box>
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
                            spacing={1}
                        >
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classes.actionButton}
                                    onClick={() => { history.push("/luciddreams") }}
                                >
                                    {lang.currLang.buttons.close}
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    className={classes.actionButton}
                                    onClick={() => { alert('Add post') }}
                                >
                                    {lang.currLang.buttons.add}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>

            </div>
        </MuiThemeProvider >
    );
};

AddPost.propTypes = {
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    clouds: PropTypes.object.isRequired,
    stars: PropTypes.object.isRequired,
}

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        clouds: store.clouds,
        stars: store.stars,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        // setCurrLangAction: currLangState => dispatch(setCurrLang(currLangState)),
        // setCloudsAction: cloudState => dispatch(setCloud(cloudState)),
        // setStarsAction: starState => dispatch(setStar(starState)),
        // setThemeModeAction: paletteState => dispatch(setThemeMode(paletteState)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddPost);