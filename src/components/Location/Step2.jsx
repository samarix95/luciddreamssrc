import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from '@material-ui/core/DialogContent';
import FormControl from '@material-ui/core/FormControl';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from "@material-ui/core/Typography";
import IconButton from '@material-ui/core/IconButton';
import ButtonBase from '@material-ui/core/ButtonBase';
import InputLabel from '@material-ui/core/InputLabel';
import InputBase from '@material-ui/core/InputBase';
import TextField from '@material-ui/core/TextField';
import MenuItem from '@material-ui/core/MenuItem';
import Select from "@material-ui/core/Select";
import Dialog from '@material-ui/core/Dialog';
import Avatar from '@material-ui/core/Avatar';
import Paper from '@material-ui/core/Paper';
import Grid from "@material-ui/core/Grid";

import ImageSearchIcon from '@material-ui/icons/ImageSearch';
import ClearIcon from '@material-ui/icons/Clear';
import SearchIcon from '@material-ui/icons/Search';

import { instance } from '../../Config.js';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { useStyles } from '../../styles/Styles.js';

import ColourWheel from "../colourWheel/index.js"

const radius = (window.innerWidth - 100) / 2 > 200 ? 200 : ((window.innerWidth - 100) / 2);

function Step2(props) {
    const { lang, themeMode, palette, isIconsLoading, setIsIconsLoading, searchName, setSearchName, locationIcons, setLocationIcons, selectedIcon, setSelectedIcon, iconColor, setIconColor } = props;
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [openColorDialog, setOpenColorDialog] = React.useState(false);

    const changeSearchName = (e) => {
        let name = e.target.value;
        const reg = /[а-яА-ЯёЁ]/g;
        if (name.search(reg) !== -1) {
            name = name.replace(reg, '');
        }
        setSearchName(name);
    };

    const clearSearchName = () => {
        setSearchName("");
    };

    const loadIconsList = () => {
        if (searchName.length !== 0) {
            setIsIconsLoading(true);
            const postData = {
                name: searchName.replace(/ /g, "%20"),
            };
            instance.post('/actions/users/geticons', postData)
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

    const changeIcon = (e) => {
        setSelectedIcon(e.target.value);
    };

    const hadnleOpenColorDialog = () => {
        setOpenColorDialog(true);
    };

    const handleCloseColorDialog = () => {
        setOpenColorDialog(false);
    };

    const setColor = (color) => {
        setIconColor(color);
        setOpenColorDialog(false);
    };

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Dialog onClose={handleCloseColorDialog} open={openColorDialog} >
                <DialogContent style={{ padding: "8px" }}>
                    <ColourWheel
                        radius={radius}
                        padding={10}
                        lineWidth={30}
                        onCenterCircleClick={(hex) => setColor(hex)}
                        onRef={ref => (ColourWheel.ColourWheel = ref)}
                        spacers={{
                            colour: '#00000000',
                            shadowColour: 'grey',
                            shadowBlur: 5
                        }}
                        preset
                        presetColour={iconColor}
                        animated
                    />
                </DialogContent>
            </Dialog>
            <Grid item className={`${classes.width12} ${classes.height12}`} >
                <Grid item className={`${classes.mainGridBodyItem} ${classes.height7}`}>
                    <div className={`${classes.height3}`} />
                    <Paper className={`${classes.height2} ${classes.width10} ${classes.SearchPaper} ${classes.relativePosition} ${classes.horizontalCenter}`} >
                        <IconButton className={`${classes.margin}`} onClick={clearSearchName} disabled={!isIconsLoading ? false : true}>
                            <ClearIcon />
                        </IconButton>
                        <InputBase style={{ flex: 1 }}
                            disabled={!isIconsLoading ? false : true}
                            value={searchName}
                            placeholder={lang.currLang.texts.FindIcon}
                            onChange={changeSearchName}
                        />
                        <IconButton className={`${classes.margin}`} onClick={loadIconsList} disabled={!isIconsLoading ? false : true}>
                            <SearchIcon />
                        </IconButton>
                    </Paper>
                    <div className={`${classes.height2}`} />
                    <div className={`${classes.height2} ${classes.width10} ${classes.SearchPaper} ${classes.relativePosition} ${classes.horizontalCenter}`} >
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
                    </div>
                    <div className={`${classes.height3}`} />
                </Grid>
                <Grid item className={`${classes.mainGridBodyItem} ${classes.height5}`}>
                    <Paper className={`${classes.width4} ${classes.height4} ${classes.centerButton}`} style={{ backgroundColor: iconColor }}>
                        <ButtonBase className={`${classes.width12} ${classes.height12}`} onClick={hadnleOpenColorDialog}>
                            <Typography variant={'body2'}>
                                {lang.currLang.errors.ColorNotChange}
                            </Typography>
                        </ButtonBase>
                    </Paper>
                </Grid>
            </Grid>
        </MuiThemeProvider >
    )
}

Step2.propTypes = {
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    palette: PropTypes.object.isRequired
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        palette: store.themeMode.palette
    }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Step2);
