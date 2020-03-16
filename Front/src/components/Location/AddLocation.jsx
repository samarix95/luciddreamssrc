import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CssBaseline from '@material-ui/core/CssBaseline';
import StepLabel from '@material-ui/core/StepLabel';
import Stepper from '@material-ui/core/Stepper';
import Button from '@material-ui/core/Button';
import Step from '@material-ui/core/Step';
import Grid from '@material-ui/core/Grid';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { setSnackbar } from '../../actions/Actions.js';
import { SET_SNACKBAR_MODE } from "../../actions/types.js";
import { instance } from '../../Config.js';
import { useStyles } from '../../styles/Styles.js';

import Step1 from "./Step1.jsx";
import Step2 from "./Step2.jsx";

function AddLocation(props) {
    const { lang, themeMode, history, setSnackbar } = props;
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [isEditMode, setIsEditMode] = React.useState(false);
    const [prevUrl, setPrevUrl] = React.useState('');
    const [isIconsLoading, setIsIconsLoading] = React.useState(false);
    const [locationIcons, setLocationIcons] = React.useState([]);
    const [nameEn, setNameEn] = React.useState('');
    const [nameRu, setNameRu] = React.useState('');
    const [searchName, setSearchName] = React.useState('');
    const [selectedIcon, setSelectedIcon] = React.useState('');
    const [iconColor, setIconColor] = React.useState('#ffffff');


    const [activeStep, setActiveStep] = React.useState(0);
    const stepsLabels = [
        lang.currLang.texts.AddLocationStep1,
        lang.currLang.texts.AddLocationStep2
    ];
    const steps = [
        React.createElement(Step1, { nameEn, nameRu, setNameEn, setNameRu }, null),
        React.createElement(Step2, { isIconsLoading, setIsIconsLoading, searchName, setSearchName, locationIcons, setLocationIcons, selectedIcon, setSelectedIcon, iconColor, setIconColor }, null),
    ];
    const handleNextStep = () => {
        setActiveStep(activeStep + 1);
    };
    const handlePrevStep = () => {
        setActiveStep(activeStep - 1);
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
                instance.post('/actions/users/createlocation', postData)
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
                instance.post('/actions/users/updatelocation', postData)
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
                        message: lang.currLang.errors.NO_CHANGES,
                    },
                });
            }
        }
    };

    React.useEffect(() => {
        if (typeof (props.location.defaultData) !== 'undefined') {
            const getIcon = (data, img_url) => {
                instance.post('/actions/users/geticons', data)
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
                <Grid className={`${classes.height12}`}
                    container
                    direction="column"
                    justify="center"
                    alignItems="stretch"
                >
                    <Grid item className={`${classes.width12} ${classes.height2}`}>
                        <Stepper activeStep={activeStep} alternativeLabel>
                            {stepsLabels.map(label => (
                                <Step key={label}>
                                    <StepLabel>{label}</StepLabel>
                                </Step>
                            ))}
                        </Stepper>
                    </Grid>
                    <Grid item className={`${classes.width12} ${classes.height9}`}>
                        {steps[activeStep]}
                    </Grid>
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height1}`}>
                        <Grid container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                        >
                            <Grid item>
                                <Button className={classes.actionButton}
                                    variant="outlined"
                                    color="primary"
                                    onClick={() => {
                                        activeStep === 0
                                            ? prevUrl.length === 0
                                                ? history.push("/dreammap")
                                                : history.push(prevUrl)
                                            : handlePrevStep();
                                    }}
                                >
                                    {activeStep !== steps.length - 1
                                        ? lang.currLang.buttons.close
                                        : lang.currLang.buttons.Back
                                    }
                                </Button>
                            </Grid>
                            <Grid item>
                                <Button
                                    variant="outlined"
                                    color="primary"
                                    className={classes.actionButton}
                                    onClick={() => {
                                        activeStep === steps.length
                                            ? saveLocation()
                                            : handleNextStep();
                                    }}
                                >
                                    {activeStep === steps.length - 1
                                        ? isEditMode
                                            ? lang.currLang.buttons.Save
                                            : lang.currLang.buttons.add
                                        : lang.currLang.buttons.Next
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
    lang: PropTypes.object.isRequired
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
)(AddLocation);