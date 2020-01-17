import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import Container from '@material-ui/core/Container';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import CssBaseline from '@material-ui/core/CssBaseline';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { CheckTimeOut } from '../utils/CheckLoginTimeOut';
import TechnicCard from './muiltiple/TechnicCard';
import { useStyles } from '../styles/Styles';
import { instance } from './Config';

function Technics(props) {
    const { lang, themeMode, history, auth } = props;
    const muiTheme = createMuiTheme(themeMode);
    const classes = useStyles();

    const [isLoading, setIsLoading] = React.useState(true);
    const [technics, setTechnics] = React.useState([]);

    const loadTechnics = React.useCallback(() => {
        setIsLoading(true);
        instance.get("/gettechnics")
            .then(res => {
                setTechnics(res.data);
                setIsLoading(false);
            })
            .catch(err => {
                setIsLoading(false);
            });
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
                        {isLoading
                            ? <div className={classes.centerCircularProgress}>
                                <CircularProgress disableShrink />
                            </div>
                            : <Container className={classes.mainGridDreamsBodyItemContainer}>
                                <Paper className={classes.mainGridDreamsBodyItemContainerPaper}>
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
                                <Button variant="contained"
                                    color="secondary"
                                    className={classes.actionButton}
                                    onClick={() => { history.push("/luciddreams") }}
                                >
                                    {lang.currLang.buttons.close}
                                </Button>
                            </Grid>
                            {auth.user.roles < 2 //0 - admin; 1 - moderator
                                ? <Grid item align="center">
                                    <Button variant="contained"
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
)(Technics);