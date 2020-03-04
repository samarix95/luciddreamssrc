import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import Dialog from '@material-ui/core/Dialog';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import List from "@material-ui/core/List";

import AddConnection from './AddConnection.jsx';

import { useStyles } from '../../styles/Styles.js';
import { instance } from '../../Config';
import { SET_SNACKBAR_MODE } from "../../actions/types.js";
import { setSnackbar } from '../../actions/Actions.js';

import InboxIcon from "@material-ui/icons/Inbox";
import ClearIcon from '@material-ui/icons/Clear';

function UserConnections(props) {
    const { lang, history, open, closeAction, user_id, setSnackbar } = props;
    const classes = useStyles();
    const [openNewConnect, setOpenNewConnect] = React.useState(false);
    const [connectionsList, setConnectionsList] = React.useState({});
    const [isConnectsLoad, setIsConnectsLoad] = React.useState(true);

    const handleOpenNewConnect = () => {
        setOpenNewConnect(true);
    };

    const handleCloseNewConnect = () => {
        setOpenNewConnect(false);
        setIsConnectsLoad(true);
        loadUserData(user_id);
    };

    const openProfile = (user_id) => {
        history.push({
            pathname: "/profile",
            defaultData: {
                friend_id: user_id,
                prevUrl: "/aeronauts",
            }
        })
        closeAction();
    };

    const deleteConnection = (id) => {
        setIsConnectsLoad(true);
        instance.post('/actions/users/edituserconnects', { action: "delete", user: user_id, connect: id })
            .then(res => {
                loadUserData(user_id);
                setSnackbar({
                    type: SET_SNACKBAR_MODE,
                    snackbar: {
                        open: true,
                        variant: 'success',
                        message: lang.currLang.texts.DeletedConnections,
                    },
                });
            })
            .catch(err => {
                alert("Cant delete user connections " + err);
                setIsConnectsLoad(false);
                closeAction();
            });
    };

    const loadUserData = React.useCallback((user_id) => {
        instance.post('/actions/users/getuserconnects', { id: user_id, })
            .then(res => {
                setConnectionsList(res.data);
                setIsConnectsLoad(false);
            })
            .catch(err => {
                alert("Cant load user connections " + err);
                setIsConnectsLoad(false);
                closeAction();
            });
    }, [user_id]);

    React.useEffect(() => {
        loadUserData(user_id);
    }, [user_id]);

    return (
        <React.Fragment>
            {openNewConnect
                ? <AddConnection
                    open={openNewConnect}
                    closeConnect={handleCloseNewConnect}
                />
                : <React.Fragment />
            }
            <Dialog open={open}
                scroll={'paper'}
                fullWidth={true}
                maxWidth={'md'}
                aria-labelledby="connections-dialog-title"
                aria-describedby="connections-dialog-description"
            >
                <DialogTitle id="connections-dialog-title">
                    {lang.currLang.buttons.Connections}
                </DialogTitle>
                <DialogContent dividers={true}>
                    <Grid container className={`${classes.height12} ${classes.minHeight100px}`} id="connections-dialog-description">
                        {isConnectsLoad
                            ? <div className={`${classes.formControl} ${classes.centerTextAlign}`}>
                                <div className={`${classes.inlineBlock} ${classes.relativePosition}`}>
                                    <CircularProgress />
                                </div>
                                <Typography className={`${classes.relativePosition}`} component="div">
                                    {lang.currLang.texts.Loading}
                                </Typography>
                            </div>
                            : <List className={`${classes.fullWidth}`} component="nav" aria-label="main">
                                {connectionsList.map((item, key) => (
                                    <ListItem button key={key} onClick={() => { openProfile(item.id) }}>
                                        <ListItemAvatar>
                                            <Avatar src={item.avatar_url} />
                                        </ListItemAvatar>
                                        <ListItemText primary={item.nickname} />
                                        <ListItemSecondaryAction>
                                            <IconButton edge="end" aria-label="delete" onClick={() => { deleteConnection(item.id) }}>
                                                <ClearIcon />
                                            </IconButton>
                                        </ListItemSecondaryAction>
                                    </ListItem>
                                ))}
                            </List>
                        }
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={closeAction} color="secondary">
                        {lang.currLang.buttons.close}
                    </Button>
                    <Button onClick={handleOpenNewConnect} color="primary">
                        {lang.currLang.buttons.add}
                    </Button>
                </DialogActions>
            </Dialog>
        </React.Fragment>
    )
}

UserConnections.propTypes = {
    lang: PropTypes.object.isRequired,
    setSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = store => {
    return {
        lang: store.lang
    }
};

const mapDispatchToProps = dispatch => {
    return {
        setSnackbar: snackbar => dispatch(setSnackbar(snackbar)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserConnections);