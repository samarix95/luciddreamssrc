import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import MUIRichTextEditor from 'mui-rte';

import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CssBaseline from '@material-ui/core/CssBaseline';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import InputBase from '@material-ui/core/InputBase';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

import Skeleton from '@material-ui/lab/Skeleton';
import Rating from '@material-ui/lab/Rating';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import DeleteIcon from '@material-ui/icons/Delete';
import EditIcon from '@material-ui/icons/Edit';

import { SET_SNACKBAR_MODE } from "../actions/types.js";
import { setSnackbar } from "../actions/Actions.js";
import { useStyles } from '../styles/Styles.js';
import { getToken } from '../utils/CheckLoginTimeOut.js';
import { fetchPcommentsAction, resetPcommentsErrorAction, sendPCommentAction, resetSendPCommentErrorAction, updatePCommentAction, resetUpdatePCommentError } from '../Config.js';
import { getPcomments, getPcommentsPending, getPcommentsError } from '../reducers/pcommentsReducer.js';
import { getSendPcomments, getSendPcommentsPending, getSendPcommentsError } from '../reducers/sendPcommentsReducer.js';

function OpenDream(props) {
    const { auth, lang, themeMode, history, setSnackbar,
        fetchPcomments, pcomments, pcommentsPending, pcommentsError, resetPcommentsError,
        sendPComment, resetSendPCommentError, sendPcomments, sendPcommentsPending, sendPcommentsError,
        updatePComment, resetUpdatePCommentError } = props;

    const muiTheme = createMuiTheme(themeMode);
    const classes = useStyles();

    const { post_id, post_title, dream_date, post_content, post_type, rating, tags, technics } = props.location.defaultData;
    const [openCommentDialog, setOpenCommentDialog] = React.useState(false);
    const [commentType, setCommentType] = React.useState({
        mode: null,
        type: 0,
        id: null,
        level: null,
    });
    const [commentText, setCommentText] = React.useState('');

    let ids = [];

    const findChild = (id) => {
        pcomments
            .filter(child => child.parent_id === id)
            .map(child => {
                ids.push(child.id)
                findChild(child.id);
            });
    };

    if (!pcommentsPending) {
        let order = {};
        pcomments
            .filter(parent => parent.parent_id == null)
            .map(parent => {
                ids.push(parent.id)
                findChild(parent.id);
            });

        ids.forEach(function (a, i) { order[a] = i; });

        pcomments.sort(function (a, b) {
            return order[a.id] - order[b.id];
        });
    }

    if (pcommentsError) {
        console.log(pcommentsError);
        setSnackbar({
            type: SET_SNACKBAR_MODE,
            snackbar: {
                open: true,
                variant: 'error',
                message: pcommentsError
            }
        });
        resetPcommentsError();
    }
    if (sendPcommentsError) {
        console.log(sendPcommentsError);
        setSnackbar({
            type: SET_SNACKBAR_MODE,
            snackbar: {
                open: true,
                variant: 'error',
                message: sendPcommentsError
            }
        });
        resetSendPCommentError();
    }

    const goBack = () => {
        props.location.defaultData.friend_id === null
            ? history.push('/dreams')
            : history.push({
                pathname: props.location.defaultData.prevUrl,
                defaultData: {
                    mode: 'fromFriend',
                    friend_id: props.location.defaultData.friend_id,
                    prevUrl: "/profile"
                }
            });
    };

    const handleSendComment = () => {
        if (commentText.length === 0) {
            setSnackbar({
                type: SET_SNACKBAR_MODE,
                snackbar: {
                    open: true,
                    variant: 'error',
                    message: lang.currLang.errors.EMPTY_COMMENT
                }
            });
        }
        else {
            sendPComment({ parent_id: commentType.id, level: commentType.level + 1, post_id: post_id, user_id: auth.user.id, comment: commentText, token: getToken() });
            setCommentText('');
            setOpenCommentDialog(false);
        }
    };

    const handleCloseCommentDialog = () => {
        setCommentText('');
        setOpenCommentDialog(false);
    };

    const handleSetCommentText = (e) => {
        setCommentText(e.target.value);
    };

    const handleCreateComment = () => {
        setCommentType({ mode: 'new', type: 0, id: null, level: -1 });
        setOpenCommentDialog(true);
    };

    const handleAnswer = (id, level) => {
        setCommentType({ mode: 'new', type: 1, id: id, level: level });
        setOpenCommentDialog(true);
    };

    const handleEdit = (id, comment) => {
        setCommentType({ mode: 'edit', type: 0, id: id, level: -1 });
        setCommentText(comment);
        setOpenCommentDialog(true);
    };

    const handleEditComment = () => {
        updatePComment({ id: commentType.id, post_id: post_id, comment: commentText, token: getToken() });
        setCommentText('');
        setOpenCommentDialog(false);
    };

    const handleDelete = (id) => {
        updatePComment({ id: id, post_id: post_id, deleted: 1, token: getToken() });
    };

    React.useEffect(() => {
        fetchPcomments(props.location.defaultData.post_id, getToken());
    }, []);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
            <Dialog open={openCommentDialog} onClose={handleCloseCommentDialog} aria-labelledby="comment-dialog-title" scroll={'body'} fullWidth={true} >
                <DialogTitle id="comment-dialog-title">
                    {commentType.mode === 'new'
                        ? commentType.type === 0
                            ? lang.currLang.buttons.DoComment
                            : lang.currLang.buttons.Answer
                        : lang.currLang.texts.Edit
                    }
                </DialogTitle>
                <DialogContent>
                    {commentType.type === 1
                        ? <React.Fragment>
                            <Paper className={`${classes.padding2}`}>
                                <Grid container
                                    direction='row'
                                    justify='center'
                                    alignItems='stretch'
                                >
                                    <Grid item xs={4}>
                                        <Avatar className={`${classes.relativePosition} ${classes.horizontalCenter}`} src={pcomments.find(comm => comm.id === commentType.id).user_avatar_url} />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <Typography variant='h6'>
                                            {pcomments.find(comm => comm.id === commentType.id).user_nickname}
                                        </Typography>
                                    </Grid>
                                </Grid>
                                <Grid className={`${classes.padding2}`}>
                                    <Typography variant='body2'>
                                        {pcomments.find(comm => comm.id === commentType.id).comment}
                                    </Typography>
                                </Grid>
                            </Paper>
                            <div className={classes.margin} />
                        </React.Fragment>
                        : <React.Fragment />
                    }
                    <Paper className={`${classes.SearchPaper}`}>
                        <InputBase className={`${classes.width12}`}
                            placeholder={lang.currLang.buttons.Comment}
                            value={commentText}
                            onChange={handleSetCommentText}
                            multiline
                        />
                    </Paper>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseCommentDialog} color="primary">
                        {lang.currLang.buttons.close}
                    </Button>
                    {commentType.mode === 'new'
                        ?
                        commentType === 0
                            ? <Button onClick={handleCloseCommentDialog} color="primary">
                                {lang.currLang.buttons.DoComment}
                            </Button>
                            : <Button onClick={handleSendComment} color="primary">
                                {lang.currLang.buttons.Answer}
                            </Button>
                        : <Button onClick={handleEditComment} color="primary">
                            {lang.currLang.texts.Edit}
                        </Button>
                    }
                </DialogActions>
            </Dialog>
            <div className={classes.root}>
                <Grid className={`${classes.height12}`}
                    container
                    direction='column'
                    justify='center'
                    alignItems='stretch'
                >
                    <Grid item className={`${classes.height11} ${classes.width12} ${classes.autoOverflowX} ${classes.relativePosition}`} >
                        <Grid className={`${classes.absolutePosition} ${classes.width12}`}
                            container
                            direction='column'
                            justify='center'
                            alignItems='stretch'
                        >
                            <Grid item className={`${classes.padding} ${classes.width12}`}>
                                <Typography align='center' variant='h6'>
                                    {post_title}
                                </Typography>
                            </Grid>
                            <Grid item className={`${classes.padding} ${classes.width12}`}>
                                <Typography align='center' variant='subtitle1'>
                                    {new Date(dream_date).getDate() + '.' + (new Date(dream_date).getMonth() + 1) + '.' + new Date(dream_date).getFullYear() + ' ' + new Date(dream_date).getHours() + ':' + ('0' + new Date(dream_date).getMinutes()).slice(-2)}
                                </Typography>
                            </Grid>
                            <Grid item className={`${classes.padding2} ${classes.width12}`}>
                                <MUIRichTextEditor
                                    controls={[
                                        'bold',
                                        'italic',
                                        'underline',
                                        'strikethrough',
                                        'colorfill',
                                    ]}
                                    customControls={[
                                        {
                                            name: 'colorfill',
                                            icon: <FormatColorFillIcon />,
                                            type: 'inline',
                                            inlineStyle: {
                                                backgroundColor: 'yellow',
                                                color: 'black'
                                            }
                                        }
                                    ]}
                                    readOnly={true}
                                    toolbar={false}
                                    value={post_content}
                                />
                            </Grid>
                            <Grid item className={`${classes.padding} ${classes.width12} ${classes.avatarRoot}`} >
                                {tags.map((tag, key) =>
                                    tag[0]
                                        ? <Tooltip key={key}
                                            disableFocusListener
                                            disableTouchListener
                                            title={lang.currLang.current === "Ru" ? tag[1] : tag[2]}
                                        >
                                            <Avatar className={classes.smallAvatar} style={themeMode.palette.type === 'dark' ? { filter: 'invert(1)' } : {}} src={tag[3]} />
                                        </Tooltip>
                                        : <React.Fragment />
                                )}
                            </Grid>
                            {post_type === 0
                                ? <React.Fragment />
                                : <Grid item className={`${classes.width12}`}>
                                    <div className={`${classes.avatarRoot} ${classes.padding}`}>
                                        {technics.map((technic, key) =>
                                            technic[0]
                                                ? <Chip key={key} className={classes.smallChip} label={lang.currLang.current === "Ru" ? technic[1] : technic[2]} />
                                                : <React.Fragment />
                                        )}
                                    </div>
                                    <Grid className={`${classes.padding}`}
                                        container
                                        direction='row'
                                        justify='center'
                                        alignItems='stretch'
                                    >
                                        <Grid item xs={6}>
                                            <Typography align='center' variant='body2'>
                                                {lang.currLang.texts.rating}:
                                            </Typography>
                                        </Grid>
                                        <Grid item xs={6}>
                                            <Rating readOnly value={rating} />
                                        </Grid>
                                    </Grid>
                                </Grid>
                            }
                            <Grid item className={`${classes.padding} ${classes.width12}`}>
                                <Divider variant='middle' />
                            </Grid>
                            <Grid item className={`${classes.padding} ${classes.width12}`}>
                                <Button size='small' color='primary' onClick={handleCreateComment}>
                                    {lang.currLang.buttons.DoComment}
                                </Button>
                            </Grid>
                            <Grid item className={`${classes.padding} ${classes.width12}`}>
                                {pcommentsPending
                                    ? <Skeleton variant='rect' className={`${classes.padding} ${classes.height96} ${classes.width12}`}>
                                        <Grid className={`${classes.padding}`}
                                            container
                                            direction='row'
                                            justify='center'
                                            alignItems='stretch'
                                        >
                                            <Grid item xs={12}>
                                                <Skeleton variant='text' />
                                            </Grid>
                                        </Grid>
                                        <Skeleton variant='text' className={`${classes.padding} ${classes.width12}`} />
                                    </Skeleton>
                                    : pcomments.length === 0
                                        ? <Paper className={`${classes.padding2} ${classes.margin}`}>
                                            <Typography align='center' variant='body2'>
                                                {lang.currLang.texts.NoComments}
                                            </Typography>
                                        </Paper>
                                        : pcomments.map((item, key) => (
                                            <Paper key={key} className={`${classes.padding2} ${classes.margin}`} style={{ marginLeft: item.level * 8 }} >
                                                <Grid>
                                                    <Typography align='right' >
                                                        {new Date(item.created_date).getDate() + '.' + (new Date(item.created_date).getMonth() + 1) + '.' + new Date(item.created_date).getFullYear() + ' ' + new Date(item.created_date).getHours() + ':' + ('0' + new Date(item.created_date).getMinutes()).slice(-2)}
                                                    </Typography>
                                                </Grid>
                                                <Grid container
                                                    direction='row'
                                                    justify='center'
                                                    alignItems='stretch'
                                                >
                                                    <Grid item xs={4}>
                                                        <Avatar className={`${classes.relativePosition} ${classes.horizontalCenter}`} src={item.user_avatar_url} />
                                                    </Grid>
                                                    <Grid item xs={8}>
                                                        <Typography variant='h6'>
                                                            {item.user_nickname}
                                                        </Typography>
                                                    </Grid>
                                                </Grid>
                                                <Grid className={`${classes.padding2}`}>
                                                    <Typography variant='body2'>
                                                        {item.comment}
                                                    </Typography>
                                                </Grid>
                                                <Grid container
                                                    direction='row'
                                                    justify='flex-start'
                                                    alignItems='stretch'
                                                >
                                                    <Grid item xs={4}>
                                                        <Button size='small' color='primary' onClick={() => handleAnswer(item.id, item.level)}>
                                                            {lang.currLang.buttons.Answer}
                                                        </Button>
                                                    </Grid>
                                                    <Grid item xs={4}>

                                                    </Grid>
                                                    {auth.user.id === item.user_id && item.deleted === 0
                                                        ? <Grid item xs={4}>
                                                            <Grid container
                                                                direction='row'
                                                                justify='space-evenly'
                                                                alignItems='center'
                                                            >
                                                                <Grid item>
                                                                    <IconButton size='small' color='primary' onClick={() => handleEdit(item.id, item.comment)}>
                                                                        <EditIcon />
                                                                    </IconButton>
                                                                </Grid>
                                                                <Grid item>
                                                                    <IconButton size='small' color='primary' onClick={() => handleDelete(item.id)}>
                                                                        <DeleteIcon />
                                                                    </IconButton>
                                                                </Grid>
                                                            </Grid>
                                                        </Grid>
                                                        : <React.Fragment />
                                                    }
                                                </Grid>
                                            </Paper>
                                        ))
                                }
                            </Grid>
                        </Grid>
                    </Grid>
                    <Grid item className={`${classes.mainGridBodyItem} ${classes.height1}`}>
                        <Grid className={`${classes.relativePosition} ${classes.verticalCenter}`}
                            container
                            direction='row'
                            justify='space-evenly'
                            alignItems='center'
                        >
                            <Grid item>
                                <Button className={classes.actionButton}
                                    variant='outlined'
                                    color='primary'
                                    onClick={goBack}
                                >
                                    {lang.currLang.buttons.close}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </div>
        </MuiThemeProvider >
    )
}

OpenDream.propTypes = {
    themeMode: PropTypes.object.isRequired,
    lang: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
    setSnackbar: PropTypes.func.isRequired,
    fetchPcomments: PropTypes.func.isRequired,
    resetPcommentsError: PropTypes.func.isRequired,
    getPcomments: PropTypes.object.isRequired,
    getPcommentsPending: PropTypes.object.isRequired,
    getPcommentsError: PropTypes.object.isRequired
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        auth: store.auth,
        pcomments: getPcomments(store),
        pcommentsPending: getPcommentsPending(store),
        pcommentsError: getPcommentsError(store),
        sendPcomments: getSendPcomments(store),
        sendPcommentsPending: getSendPcommentsPending(store),
        sendPcommentsError: getSendPcommentsError(store)
    }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
    setSnackbar: snackbar => dispatch(setSnackbar(snackbar)),
    fetchPcomments: fetchPcommentsAction,
    resetPcommentsError: resetPcommentsErrorAction,
    sendPComment: sendPCommentAction,
    resetSendPCommentError: resetSendPCommentErrorAction,
    updatePComment: updatePCommentAction,
    resetUpdatePCommentError: resetUpdatePCommentError
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OpenDream);