import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Grid from "@material-ui/core/Grid";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { useStyles } from '../../styles/Styles.js';

import LanguageIcon from '@material-ui/icons/Language';

function Step1(props) {
    const { lang, themeMode, nameEn, nameRu, setNameEn, setNameRu } = props;
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);

    const changeNameEn = (e) => {
        if (e.target.value.search(/[а-яА-ЯёЁ]/g) !== -1) {
            setNameEn(e.target.value.replace(/[а-яА-ЯёЁ]/g, ''));
        }
        else {
            setNameEn(e.target.value);
        }
    };

    const changeNameRu = (e) => {
        if (e.target.value.search(/[a-zA-Z]/g) !== -1) {
            setNameRu(e.target.value.replace(/[a-zA-Z]/g, ''));
        }
        else {
            setNameRu(e.target.value);
        }
    };

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Grid item className={`${classes.width12} ${classes.height12}`} >
                <Grid item className={`${classes.width12} ${classes.height2}`} />
                <div className={`${classes.height3} ${classes.width10} ${classes.SearchPaper} ${classes.relativePosition} ${classes.horizontalCenter}`} >
                    <LanguageIcon className={`${classes.margin}`} />
                    <TextField value={nameRu}
                        label={lang.currLang.texts.Name + ' Ru'}
                        onChange={changeNameRu}
                    />
                </div>
                <Grid item className={`${classes.width12} ${classes.height2}`} />
                <div className={`${classes.height3} ${classes.width10} ${classes.SearchPaper} ${classes.relativePosition} ${classes.horizontalCenter}`} >
                    <LanguageIcon className={`${classes.margin}`} />
                    <TextField value={nameEn}
                        label={lang.currLang.texts.Name + ' En'}
                        onChange={changeNameEn}
                    />
                </div>
                <Grid item className={`${classes.width12} ${classes.height2}`} />
            </Grid>
        </MuiThemeProvider >
    )
}

Step1.propTypes = {
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
)(Step1);