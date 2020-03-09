import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from "@material-ui/core/Typography";
import InputBase from "@material-ui/core/InputBase";
import Paper from "@material-ui/core/Paper";
import Grid from "@material-ui/core/Grid";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { useStyles } from '../../styles/Styles.js';

import AlternateEmailIcon from '@material-ui/icons/AlternateEmail';
import VpnKeyIcon from '@material-ui/icons/VpnKey';

function SignUpStep1(props) {
    const { lang, themeMode, setUserLogin, setUserPass, setUserPassRepeat } = props;
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);

    const handleSubmit = (event) => {
        event.preventDefault();
    };

    const changeLogin = (event) => {
        setUserLogin(event.target.value);
    };

    const changePassword = (event) => {
        setUserPass(event.target.value);
    };

    const changePasswordRepeat = (event) => {
        setUserPassRepeat(event.target.value);
    };

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Grid item className={`${classes.mainGridBodyItem} ${classes.height12}`} >
                <Grid className={`${classes.height1} ${classes.relativePosition}`} />
                <Grid className={`${classes.height1} ${classes.relativePosition}`} >
                    <Typography variant="h5" component="div" className={`${classes.centerButton}`}>
                        {lang.currLang.buttons.signUp}
                    </Typography>
                </Grid>
                <Grid className={`${classes.height1} ${classes.relativePosition}`} />
                <Paper className={`${classes.height1} ${classes.width10} ${classes.SearchPaper} ${classes.relativePosition} ${classes.horizontalCenter}`} component="form" onSubmit={handleSubmit}>
                    <AlternateEmailIcon className={`${classes.margin}`} />
                    <InputBase className={`${classes.height12}`}
                        placeholder="Email"
                        type={'email'}
                        onChange={changeLogin}
                    />
                </Paper>
                <Grid className={`${classes.height2} ${classes.relativePosition}`} />
                <Paper className={`${classes.height1} ${classes.width10} ${classes.SearchPaper} ${classes.relativePosition} ${classes.horizontalCenter}`} component="form" onSubmit={handleSubmit}>
                    <VpnKeyIcon className={`${classes.margin}`} />
                    <InputBase placeholder={lang.currLang.texts.password}
                        type={'password'}
                        onChange={changePassword}
                    />
                </Paper>
                <Grid className={`${classes.height1} ${classes.relativePosition}`} />
                <Paper className={`${classes.height1} ${classes.width10} ${classes.SearchPaper} ${classes.relativePosition} ${classes.horizontalCenter}`} component="form" onSubmit={handleSubmit}>
                    <VpnKeyIcon className={`${classes.margin}`} />
                    <InputBase placeholder={lang.currLang.texts.passwordAgain}
                        type={'password'}
                        onChange={changePasswordRepeat}
                    />
                </Paper>
                <Grid className={`${classes.height3} ${classes.relativePosition}`} />
            </Grid>
        </MuiThemeProvider >
    )
}

SignUpStep1.propTypes = {
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
    }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUpStep1);
