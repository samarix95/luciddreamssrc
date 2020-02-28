import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import ListItemText from "@material-ui/core/ListItemText";
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from "@material-ui/core/IconButton";
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import ListItem from "@material-ui/core/ListItem";
import Avatar from "@material-ui/core/Avatar";
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';

import { useStyles } from '../../styles/Styles.js';
import { instance } from '../../Config';
import { SET_SNACKBAR_MODE } from "../../actions/types.js";
import { setSnackbar } from '../../actions/Actions.js';

import InboxIcon from "@material-ui/icons/Inbox";
import AddIcon from '@material-ui/icons/Add';
import SearchIcon from '@material-ui/icons/Search';

function AddConnection(props) {
    const { lang, user_id, open, closeConnect, setSnackbar } = props;
    const classes = useStyles();
    const [usersList, setUsersList] = React.useState({});
    const [isLoad, setIsLoad] = React.useState(true);
    const [filter, setFilter] = React.useState("");

    const handleSetFilter = (event) => {
        setFilter(event.target.value);
    };

    const addNewConnection = (id) => {
        setIsLoad(true);
        instance
            .post('/actions/users/edituserconnects', { action: "add", user: user_id, connect: id })
            .then(res => {
                loadUserList();
                setSnackbar({
                    type: SET_SNACKBAR_MODE,
                    snackbar: {
                        open: true,
                        variant: 'success',
                        message: lang.currLang.texts.AddedConnections,
                    },
                });
            })
            .catch(err => {
                alert("Cant add user connections " + err);
                setIsLoad(false);
                closeConnect();
            });
    };

    const loadUserList = React.useCallback(() => {
        instance
            .post('/actions/users/getusers', { id: user_id, })
            .then(res => {
                setUsersList(res.data)
                setIsLoad(false);
            })
            .catch(err => {
                alert("Cant load users " + err);
                setIsLoad(false);
                closeConnect();
            });
    }, []);

    React.useEffect(() => {
        loadUserList();
    }, []);

    return (
        <Dialog open={open}
            scroll={'paper'}
            fullWidth={true}
            maxWidth={'md'}
            aria-labelledby="add-connections-dialog-title"
            aria-describedby="add-connections-dialog-description"
        >
            <DialogTitle id="add-connections-dialog-title">
                {lang.currLang.texts.AddConnections}
            </DialogTitle>
            <DialogContent dividers={true}>
                <Grid container className={`${classes.height12} ${classes.minHeight100px}`} id="add-connections-dialog-description">
                    {isLoad
                        ? <div className={`${classes.formControl} ${classes.centerTextAlign}`}>
                            <div className={`${classes.inlineBlock} ${classes.relativePosition}`}>
                                <CircularProgress />
                            </div>
                            <Typography className={`${classes.relativePosition}`} component="div">
                                {lang.currLang.texts.Loading}
                            </Typography>
                        </div>
                        : <React.Fragment>
                            <Paper component="form" className={`${classes.SearchPaper}`}>
                                <SearchIcon />
                                <InputBase placeholder={lang.currLang.texts.nickname} onChange={handleSetFilter} />
                            </Paper>
                            <List className={`${classes.fullWidth}`} component="nav" aria-label="main">
                                {usersList
                                    .filter(item => item.nickname.toLowerCase().includes(filter.toLowerCase()) ? true : false)
                                    .map((item, key) => (
                                        <ListItem key={key}>
                                            <ListItemAvatar>
                                                <Avatar>
                                                    <InboxIcon />
                                                </Avatar>
                                            </ListItemAvatar>
                                            <ListItemText primary={item.nickname} />
                                            <ListItemSecondaryAction>
                                                <IconButton edge="end" aria-label="add" onClick={() => { addNewConnection(item.id) }}>
                                                    <AddIcon />
                                                </IconButton>
                                            </ListItemSecondaryAction>
                                        </ListItem>
                                    ))}
                            </List>
                        </React.Fragment>
                    }
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={closeConnect} color="secondary">
                    {lang.currLang.buttons.close}
                </Button>
            </DialogActions>
        </Dialog>
    )
}

AddConnection.propTypes = {
    lang: PropTypes.object.isRequired,
    user_id: PropTypes.number.isRequired,
    setSnackbar: PropTypes.func.isRequired,
};

const mapStateToProps = store => {
    return {
        lang: store.lang,
        user_id: store.auth.user.id,
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
)(AddConnection);