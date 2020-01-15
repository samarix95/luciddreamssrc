import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Select from "@material-ui/core/Select";
import Grid from '@material-ui/core/Grid';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { instance } from './Config';
import { useStyles } from '../styles/Styles';

function AddLocation(props) {
    const { lang, themeMode, history, palette } = props;
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [locationIcons, setLocationIcons] = React.useState([]);
    const [selectedIcon, setSelectedIcon] = React.useState('https://static.thenounproject.com/png/1469120-200.png');
    const [nameEng, setNameEng] = React.useState('PC');
    const changeIcon = event => {
        setSelectedIcon(event.target.value);
    };

    const changeNameEng = (e) => {
        setNameEng(e.target.value)
    }

    const loadGraphicCards = () => {
        const postData = {
            name: nameEng,
        };
        instance
            .post('/actions/users/geticons', postData)
            .then(res => {
                if (res.data.length === 0) {
                    loadGraphicCards();
                }
                else {
                    setLocationIcons(res.data);
                }
            });
    };

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <div className={classes.root}>
                <Grid className={classes.mainGridContainer}
                    container
                    direction="column"
                    justify="center"
                    alignItems="stretch" >
                    <Grid item xs={11} zeroMinWidth className={classes.mainGridDreamsBodyItem}>
                        <Button className={classes.actionButton}
                            variant="contained"
                            color="secondary"
                            onClick={() => { loadGraphicCards() }}
                        >
                            {lang.currLang.buttons.close}
                        </Button>
                        <TextField className={classes.inputDiv}
                            required
                            id="outlined-required"
                            value={nameEng}
                            label={lang.currLang.texts.title}
                            variant="outlined"
                            onChange={changeNameEng}
                        />
                        {locationIcons.length !== 0
                            ? <FormControl className={classes.formControl}>
                                <Select value={selectedIcon}
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
                                        <MenuItem key={key}
                                            value={item}
                                        >
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
                            : ''
                        }
                    </Grid>
                    <Grid item xs={1} zeroMinWidth className={classes.mainGridBodyItem}>
                        <Grid
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                        >
                            <Grid item xs={6} align="center">
                                <Button className={classes.actionButton}
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => { history.push("/dreammap") }}
                                >
                                    {lang.currLang.buttons.close}
                                </Button>
                            </Grid>
                            <Grid item xs={6}>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </MuiThemeProvider >
    )
}

AddLocation.propTypes = {
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
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(AddLocation);