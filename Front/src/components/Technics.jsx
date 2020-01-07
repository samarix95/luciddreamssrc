import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import ListItemText from '@material-ui/core/ListItemText';
import Container from '@material-ui/core/Container';
import ListItem from '@material-ui/core/ListItem';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';

import CssBaseline from '@material-ui/core/CssBaseline';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

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
                <Grid className={classes.mainGridContainer}
                    container
                    direction="column"
                    justify="center"
                    alignItems="stretch"
                >
                    <Grid item xs={11} zeroMinWidth className={classes.mainGridDreamsBodyItem}>
                        {isLoading
                            ? <div className={classes.centerCircularProgress}>
                                <CircularProgress disableShrink />
                            </div>
                            : <Container className={classes.mainGridDreamsBodyItemContainer}>
                                <Paper className={classes.mainGridDreamsBodyItemContainerPaper}>
                                    <List component="nav">
                                        {technics.map((item, key) => (
                                            <ListItem key={key}
                                                button
                                                onClick={() => { alert(item.id) }}
                                            >
                                                <ListItemText primary={
                                                    lang.currLang.current === "Ru"
                                                        ? item.name_rus
                                                        : item.name_eng
                                                } />
                                            </ListItem>
                                        ))}
                                    </List>
                                </Paper>
                            </Container>
                        }
                    </Grid>
                    <Grid item xs={1} zeroMinWidth className={classes.mainGridBodyItem}>
                        <Grid container
                            direction="row"
                            justify="space-evenly"
                            alignItems="center"
                            spacing={1}
                        >
                            <Grid item xs={6} align="center">
                                <Button
                                    variant="contained"
                                    color="secondary"
                                    className={classes.actionButton}
                                    onClick={() => { history.push("/luciddreams") }}
                                >
                                    {lang.currLang.buttons.close}
                                </Button>
                            </Grid>
                            {auth.user.roles < 2 //0 - admin; 1 - moderator
                                ? <Grid item xs={6}>
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        className={classes.actionButton}
                                        onClick={() => {
                                            alert('У тебя есть права, ты можешь добавлять')
                                            //history.push("/luciddreams")
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