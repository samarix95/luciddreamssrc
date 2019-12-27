import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from "@material-ui/core/Container";
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import DreamCard from './muiltiple/DreamCard';
import { useStyles } from '../styles/Styles';
import { instance } from './Config';

function ViewDreams(props) {
    const { lang, themeMode, history, clouds, stars, auth } = props;
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
            <div className={classes.AppDivDark}>
                <div className={classes.AppDivLight} style={themeMode.palette.type === "light" ? { opacity: 1, } : { opacity: 0, }} />
                {themeMode.palette.type === "light"
                    ?
                    <div className={classes.AppCloudsDiv} style={themeMode.palette.type === "light" ? { opacity: 1, } : { opacity: 0, }} >
                        {clouds.clouds}
                    </div>
                    :
                    <div className={classes.AppStarsDiv} style={themeMode.palette.type === "light" ? { opacity: 0, } : { opacity: 1, }} >
                        {stars.stars}
                    </div>
                }
            </div>
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
                                    <Grid className={classes.mainGridDreamsContainer}
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
                                            />
                                        ))}
                                    </Grid>
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
    clouds: PropTypes.object.isRequired,
    stars: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        clouds: store.clouds,
        stars: store.stars,
        auth: store.auth,
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        // setCurrLangAction: currLangState => dispatch(setCurrLang(currLangState)),
        // setCloudsAction: cloudState => dispatch(setCloud(cloudState)),
        // setStarsAction: starState => dispatch(setStar(starState)),
        // setThemeModeAction: paletteState => dispatch(setThemeMode(paletteState)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ViewDreams);