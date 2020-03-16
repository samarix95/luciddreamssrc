import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';

import CssBaseline from '@material-ui/core/CssBaseline';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { CheckTimeOut } from '../utils/CheckLoginTimeOut';
import TechnicCard from './muiltiple/TechnicCard.jsx';
import { useStyles } from '../styles/Styles';
import { fetchTechnicsAction } from '../Config.js';
import { getTechnicsError, getTechnics, getTechnicsPending } from '../reducers/technicsReducer.js';

function Technics(props) {
    const { lang, themeMode, history, auth, technics, technicsError, technicsPending, fetchTechnics } = props;
    if (technicsError) {
        console.log("Technics");
        console.log(technicsError);
    }
    const muiTheme = createMuiTheme(themeMode);
    const classes = useStyles();
    
    const loadTechnics = React.useCallback(() => {
        fetchTechnics();
    }, []);
    
    React.useEffect(() => {
        loadTechnics();
    }, [loadTechnics]);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <div className={classes.root}>
                <Grid container
                    className={`${classes.height12}`}
                    direction="column"
                    justify="center"
                    alignItems="stretch"
                >
                    <Grid item className={`${classes.hiddenOverflow} ${classes.height11}`}>
                        {technicsPending
                            ? <div className={`${classes.formControl} ${classes.centerTextAlign}`} >
                                <div className={`${classes.inlineBlock} ${classes.relativePosition}`} >
                                    <CircularProgress />
                                </div>
                                <Typography className={`${classes.relativePosition}`} component="div" >
                                    {lang.currLang.texts.Loading}
                                </Typography>
                            </div>
                            : <Container className={classes.mainGridDreamsBodyItemContainer}>
                                <Grid container
                                    className={classes.mainGridDreamsContainer}
                                    direction="column"
                                    justify="center"
                                    alignItems="stretch"
                                >
                                    {technics.map((item, key) => (
                                        <TechnicCard key={key}
                                            item={item}
                                            loadTechnics={loadTechnics}
                                            history={history}
                                        />
                                    ))}
                                </Grid>
                            </Container>
                        }
                    </Grid>
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height1}`}>
                        <Grid className={`${classes.relativePosition} ${classes.verticalCenter}`}
                            container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                        >
                            <Grid item>
                                <Button variant="outlined"
                                    color="primary"
                                    className={classes.actionButton}
                                    onClick={() => { history.push("/") }}
                                >
                                    {lang.currLang.buttons.close}
                                </Button>
                            </Grid>
                            {auth.user.roles < 2 //0 - admin; 1 - moderator
                                ? <Grid item align="center">
                                    <Button variant="outlined"
                                        color="primary"
                                        className={classes.actionButton}
                                        onClick={() => {
                                            let check = CheckTimeOut();
                                            if (check) history.push("/addtechnics");
                                            else history.push("/");
                                        }}
                                    >
                                        {lang.currLang.buttons.add}
                                    </Button>
                                </Grid>
                                : <Grid item xs={6} />
                            }
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </MuiThemeProvider >
    );
}

Technics.propTypes = {
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    technicsError: PropTypes.object.isRequired,
    technics: PropTypes.object.isRequired,
    technicsPending: PropTypes.object.isRequired,
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        auth: store.auth,
        technicsError: getTechnicsError(store),
        technics: getTechnics(store),
        technicsPending: getTechnicsPending(store),
    }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchTechnics: fetchTechnicsAction,
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Technics);