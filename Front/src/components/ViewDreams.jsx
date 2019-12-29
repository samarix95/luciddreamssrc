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
    
    React.useEffect(() => {
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
                        {isLoading
                            ? <CircularProgress />
                            : <Container className={classes.mainGridDreamsBodyItemContainer}>
                                <Paper className={classes.mainGridDreamsBodyItemContainerPaper}>
                                    {dreams.length !== 0
                                        ? <Grid className={classes.mainGridDreamsContainer}
                                            container
                                            direction="column"
                                            justify="center"
                                            alignItems="stretch"
                                        >
                                            {dreams.map((item, key) => (
                                                <DreamCard
                                                    item={item}
                                                    key={key}
                                                    lang={lang}
                                                    palette={themeMode.palette}
                                                />
                                            ))}
                                        </Grid>
                                        :
                                        <div>
                                            <div
                                                style={{
                                                    position: "relative",
                                                    left: "50%",
                                                    transform: "translateX(-50%)",
                                                    width: 200,
                                                    height: 100,
                                                }}
                                            >
                                            </div>
                                            <div
                                                style={{
                                                    position: "relative",
                                                    left: "50%",
                                                    transform: "translateX(-50%)",
                                                    width: 200,
                                                    height: 200,
                                                    background: "url('https://static.thenounproject.com/png/603669-200.png') no-repeat center",
                                                }}>
                                            </div>
                                            <div
                                                style={{
                                                    position: "relative",
                                                    left: "50%",
                                                    transform: "translateX(-50%)",
                                                    width: 200,
                                                    height: 100,
                                                    textAlign: "center",
                                                }}
                                            >
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
                    <Grid item xs={1} zeroMinWidth className={classes.mainGridBodyItem}>
                        <Grid
                            container
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