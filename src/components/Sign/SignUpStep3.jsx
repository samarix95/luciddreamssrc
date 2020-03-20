import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';

import CircularProgress from '@material-ui/core/CircularProgress';
import DialogContent from "@material-ui/core/DialogContent";
import CssBaseline from "@material-ui/core/CssBaseline";
import DialogTitle from "@material-ui/core/DialogTitle";
import ButtonBase from "@material-ui/core/ButtonBase";
import Typography from "@material-ui/core/Typography";
import IconButton from "@material-ui/core/IconButton";
import Dialog from "@material-ui/core/Dialog";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { useStyles } from '../../styles/Styles.js';

import { SET_SNACKBAR_MODE } from "../../actions/types.js";
import { setSnackbar } from '../../actions/Actions.js';
import { fetchAvatarsAction } from '../../Config.js';
import { getAvatarsError, getAvatars, getAvatarsPending } from '../../reducers/avatarsReducer.js';

function SignUpStep3(props) {
    const { lang, themeMode, setUserAvatar, avatars, avatarsPending, avatarsError, fetchAvatars, setSnackbar } = props;
    const classes = useStyles();
    const muiTheme = createMuiTheme(themeMode);
    const [openAva, setOpenAva] = React.useState(false);
    const [selectedAva, setSelectedAva] = React.useState("");

    if (avatarsError) {
        setSnackbar({
            type: SET_SNACKBAR_MODE,
            snackbar: {
                open: true,
                variant: 'error',
                message: lang.currLang.errors.AvatarsLoadError
            },
        });
    }

    const changeUserAvatar = (id, url) => {
        setSelectedAva(url);
        setUserAvatar(id);
        setOpenAva(false);
    };

    const handleClickOpenAva = () => {
        setOpenAva(true);
    };

    const handleCloseAva = () => {
        setOpenAva(false);
    };

    React.useEffect(() => {
        fetchAvatars();
    }, [])

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Dialog open={openAva}
                onClose={handleCloseAva}
                scroll={'paper'}
                fullWidth={true}
                maxWidth={'md'}
                aria-labelledby="avatar-dialog-title"
                aria-describedby="avatar-dialog-description"
            >
                <DialogTitle id="avatar-dialog-title">
                    {lang.currLang.texts.ChangeAvatar}
                </DialogTitle>
                <DialogContent dividers={true}>
                    <Grid container className={`${classes.height12} ${classes.relativePosition} ${classes.minHeight100px}`} id="avatar-dialog-description" spacing={2}>
                        {!avatarsPending
                            ? avatars.map((item, key) => (
                                <Grid item xs={4} sm={3} key={key}>
                                    <div className={`${classes.relativePosition} ${classes.fullWidth} ${classes.equalHeight}`}>
                                        <ButtonBase onClick={() => changeUserAvatar(item.id, item.url)} className={`${classes.absolutePosition} ${classes.fullWidth} ${classes.fullHeight} ${classes.topLeft} ${classes.borderRadius50}`}>
                                            <Avatar src={item.url} className={`${classes.absolutePosition} ${classes.fullWidth} ${classes.fullHeight}`} />
                                        </ButtonBase>
                                    </div>
                                </Grid>
                            ))
                            : <div className={`${classes.formControl} ${classes.centerTextAlign}`}>
                                <div className={`${classes.inlineBlock} ${classes.relativePosition}`}>
                                    <CircularProgress />
                                </div>
                                <Typography className={`${classes.relativePosition}`} component="div">
                                    {lang.currLang.texts.Loading}
                                </Typography>
                            </div>
                        }
                    </Grid>
                </DialogContent>
            </Dialog>
            <Grid item className={`${classes.mainGridBodyItem} ${classes.height12}`} >
                <Grid className={`${classes.height1} ${classes.relativePosition}`} />
                <Grid className={`${classes.height1} ${classes.relativePosition}`} >
                    <Typography variant="h6" component="div" className={`${classes.centerButton}`}>
                        {lang.currLang.texts.ChangeAvatar}
                    </Typography>
                </Grid>
                <Grid className={`${classes.height1} ${classes.relativePosition}`} >
                    <Typography variant="body" component="div" className={`${classes.centerButton}`}>
                        ({lang.currLang.texts.orSkipStep})
                    </Typography>
                </Grid>
                <Grid className={`${classes.height1} ${classes.relativePosition}`} />
                <Grid className={`${classes.height3} ${classes.relativePosition} ${classes.horizontalCenter} ${classes.inlineBlock}`} >
                    <img className={`${classes.fullHeight}`} src="data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7" />
                    <IconButton className={`${classes.absolutePosition} ${classes.fullHeight} ${classes.fullWidth} ${classes.absoluteZero}`} onClick={handleClickOpenAva} >
                        <Avatar className={`${classes.absolutePosition} ${classes.fullHeight} ${classes.fullWidth} ${classes.absoluteZero}`} src={selectedAva} />
                    </IconButton>
                </Grid>
                <Grid className={`${classes.height5} ${classes.relativePosition}`} />
            </Grid>
        </MuiThemeProvider >
    )
}

SignUpStep3.propTypes = {
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    avatarsError: PropTypes.object.isRequired,
    avatars: PropTypes.object.isRequired,
    avatarsPending: PropTypes.object.isRequired,
    setSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        avatarsPending: getAvatarsPending(store),
        avatars: getAvatars(store),
        avatarsError: getAvatarsError(store),
    }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    fetchAvatars: fetchAvatarsAction,
    setSnackbar: snackbar => dispatch(setSnackbar(snackbar))
}, dispatch)

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SignUpStep3);
