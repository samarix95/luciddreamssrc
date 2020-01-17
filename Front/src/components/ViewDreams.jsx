import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Container from "@material-ui/core/Container";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import DreamCard from './muiltiple/DreamCard';
import { useStyles } from '../styles/Styles';
import { instance } from './Config';

function ViewDreams(props) {
    const { lang, themeMode, history, auth } = props;
    const muiTheme = createMuiTheme(themeMode);
    const classes = useStyles();
    const [isLoading, setIsLoading] = React.useState(true);
    const [dreams, setDreams] = React.useState([]);

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
    }, [auth.user.id]);

    React.useEffect(() => {
        loadPosts();
    }, [loadPosts]);

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
                                    {dreams.length !== 0
                                        ? <Grid className={`${classes.mainGridDreamsContainer}`}
                                            container
                                            direction="column"
                                            justify="center"
                                            alignItems="stretch"
                                        >
                                            {dreams.map((item, key) => (
                                                <DreamCard
                                                    item={item}
                                                    key={key}
                                                    history={history}
                                                    loadPosts={loadPosts}
                                                />
                                            ))}
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
                            <Grid item xs={6} align="center">
                                <Button variant="contained"
                                    color="secondary"
                                    className={classes.actionButton}
                                    onClick={() => { history.push("/luciddreams") }}
                                >
                                    {lang.currLang.buttons.close}
                                </Button>
                            </Grid>
                            <Grid item xs={6} />
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