import React from 'react';
import clsx from "clsx";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MUIRichTextEditor from 'mui-rte';
import { EditorState, convertFromRaw } from 'draft-js';

import DialogContentText from "@material-ui/core/DialogContentText";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import DialogContent from "@material-ui/core/DialogContent";
import DialogActions from "@material-ui/core/DialogActions";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import DialogTitle from "@material-ui/core/DialogTitle";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import CardHeader from "@material-ui/core/CardHeader";
import MenuItem from "@material-ui/core/MenuItem";
import Collapse from "@material-ui/core/Collapse";
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Dialog from '@material-ui/core/Dialog';
import Paper from '@material-ui/core/Paper';
import Card from "@material-ui/core/Card";
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';

import Rating from "@material-ui/lab/Rating";

import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Visibility from '@material-ui/icons/Visibility';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@material-ui/icons/Edit";

import { useStyles } from '../../styles/Styles';

import { instance } from '../Config';

import { SET_SNACKBAR_MODE } from "../../actions/types";
import { setSnackbar } from '../../actions/Actions';

function DreamCard(props) {
    const classes = useStyles();
    const { post_id, post_title, post_content, post_type, tags, technics, rating, dream_date, is_public } = props.item;
    const { lang, palette, history, setSnackbar } = props;
    const [expanded, setExpanded] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [openAlert, setOpenAlert] = React.useState(false);
    const [publicChecked, setPublicChecked] = React.useState(false);
    const [alertTexts, setAlertTexts] = React.useState({
        header: '',
        body: '',
        commit: '',
        action: '',
    });

    const dateOfDream = new Date(dream_date).getDate() + '.' + (new Date(dream_date).getMonth() + 1) + '.' + new Date(dream_date).getFullYear() + ' ' + new Date(dream_date).getHours() + ':' + ("0" + new Date(dream_date).getMinutes()).slice(-2);
    const srcContent = post_content.toString();
    const jsonPparse = JSON.parse(srcContent);
    const convertfromraw = convertFromRaw(jsonPparse);
    const text_content = EditorState.createWithContent(convertfromraw).getCurrentContent().getPlainText('');

    React.useEffect(() => {
        is_public === 1
            ? setPublicChecked(true)
            : setPublicChecked(false);
    }, [is_public]);

    const openMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const clickMenu = (action, event) => {
        let newAlertTexts = alertTexts;
        switch (action) {
            case 'public':
                if (event.target.checked) {
                    newAlertTexts = { ...newAlertTexts, header: lang.currLang.texts.PublicAlert };
                    newAlertTexts = { ...newAlertTexts, body: lang.currLang.texts.PublicText };
                    newAlertTexts = { ...newAlertTexts, commit: lang.currLang.texts.Publish };
                    newAlertTexts = { ...newAlertTexts, action: 'publicOk' };
                    setAlertTexts(newAlertTexts);
                }
                else {
                    newAlertTexts = { ...newAlertTexts, header: lang.currLang.texts.UnpublicAlert };
                    newAlertTexts = { ...newAlertTexts, body: lang.currLang.texts.UnpublicText };
                    newAlertTexts = { ...newAlertTexts, commit: lang.currLang.texts.Unpublish };
                    newAlertTexts = { ...newAlertTexts, action: 'publicOk' };
                    setAlertTexts(newAlertTexts);
                }
                setOpenAlert(true);
                closeMenu();
                break;

            case 'edit':
                closeMenu();
                if (post_type === 0) {
                    history.push({
                        pathname: "/addregulardream",
                        defaultData: {
                            post_id: post_id,
                            post_title: post_title,
                            dream_date: new Date(dream_date),
                            post_content: post_content,
                            tags: tags,
                        }
                    });
                }
                else if (post_type === 1) {
                    history.push({
                        pathname: "/addcdream",
                        defaultData: {
                            post_id: post_id,
                            post_title: post_title,
                            dream_date: new Date(dream_date),
                            post_content: post_content,
                            tags: tags,
                            technics: technics,
                            rating: rating,
                        }
                    });
                }
                break;

            case 'delete':
                newAlertTexts = { ...newAlertTexts, header: lang.currLang.texts.DeleteAlert };
                newAlertTexts = { ...newAlertTexts, body: lang.currLang.texts.DeleteText };
                newAlertTexts = { ...newAlertTexts, commit: lang.currLang.buttons.Delete };
                newAlertTexts = { ...newAlertTexts, action: 'deleteOk' };
                setAlertTexts(newAlertTexts);
                closeMenu();
                setOpenAlert(true);
                break;

            case 'closeAlert':
                setOpenAlert(false);
                break;

            case 'deleteOk':
                const postData = {
                    post_id: post_id
                };
                instance
                    .post('/actions/users/deletepost', postData)
                    .then(res => {
                        closeMenu();
                        setSnackbar({
                            type: SET_SNACKBAR_MODE,
                            snackbar: {
                                open: true,
                                variant: 'success',
                                message: lang.currLang.texts.success,
                            },
                        });
                        setOpenAlert(false);
                        props.loadPosts();
                    })
                    .catch(err => {
                        setSnackbar({
                            type: SET_SNACKBAR_MODE,
                            snackbar: {
                                open: true,
                                variant: 'error',
                                message: lang.currLang.texts.CantDeletePost,
                            },
                        });
                        closeMenu();
                        setOpenAlert(false);
                    });
                break;

            case 'publicOk':
                closeMenu();
                setOpenAlert(false);
                if (publicChecked) {
                    const postData = {
                        post_id: post_id,
                        newPublic: 0
                    };
                    instance
                        .post('/actions/users/updatepost', postData)
                        .then(res => {
                            setPublicChecked(false);
                            setSnackbar({
                                type: SET_SNACKBAR_MODE,
                                snackbar: {
                                    open: true,
                                    variant: 'success',
                                    message: lang.currLang.texts.success,
                                },
                            });
                        })
                        .catch(err => {
                            setPublicChecked(true);
                        });
                }
                else {
                    const postData = {
                        post_id: post_id,
                        newPublic: 1,
                    };
                    instance
                        .post('/actions/users/updatepost', postData)
                        .then(res => {
                            setPublicChecked(true);
                            setSnackbar({
                                type: SET_SNACKBAR_MODE,
                                snackbar: {
                                    open: true,
                                    variant: 'success',
                                    message: lang.currLang.texts.success,
                                },
                            });
                        })
                        .catch(err => {
                            setPublicChecked(false);
                        });
                }
                break;

            default:
                console.log('Command not found');
                break;
        }
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Grid item xs={12} className={classes.dreamCardDiv}>
            <Dialog open={openAlert}
                onClose={() => clickMenu('closeAlert')}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title" >
                    {alertTexts.header}
                </DialogTitle>
                <DialogContent >
                    <DialogContentText id="alert-dialog-description" >
                        {alertTexts.body}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => clickMenu('closeAlert')}
                        color="secondary">
                        {lang.currLang.buttons.cancel}
                    </Button>
                    <Button onClick={() => clickMenu(alertTexts.action)}
                        color="primary" autoFocus>
                        {alertTexts.commit}
                    </Button>
                </DialogActions>
            </Dialog>

            <Menu id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={closeMenu}>

                <MenuItem >
                    <ListItemIcon>
                        <FormControlLabel
                            control={
                                <Checkbox
                                    onChange={(e) => clickMenu('public', e)}
                                    checked={publicChecked}
                                    value="checkedB"
                                    color="primary"
                                />
                            }
                        />
                    </ListItemIcon>
                    {lang.currLang.texts.Public}
                </MenuItem>

                <MenuItem onClick={() => clickMenu('edit')}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    {lang.currLang.buttons.Edit}
                </MenuItem>

                <MenuItem onClick={() => clickMenu('delete')}>
                    <ListItemIcon>
                        <EditIcon fontSize="small" />
                    </ListItemIcon>
                    {lang.currLang.buttons.Delete}
                </MenuItem>

            </Menu>

            <Card raised={true}
                className={classes.card}>
                <CardHeader
                    title={
                        <Grid container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Grid item xs={10} >
                                <Typography variant='h6'>
                                    {post_title}
                                </Typography>
                            </Grid>
                            <Grid item xs={2} >
                                <Tooltip
                                    disableFocusListener
                                    disableTouchListener
                                    title={publicChecked
                                        ? lang.currLang.texts.PublicDescription
                                        : lang.currLang.texts.UnpublicDescription
                                    }
                                >
                                    {publicChecked
                                        ? <Visibility className={classes.iconCenter} />
                                        : <VisibilityOff className={classes.iconCenter} />
                                    }
                                </Tooltip>
                            </Grid>
                        </Grid>
                    }
                    subheader={dateOfDream}
                    action={
                        <IconButton
                            aria-label="settings"
                            onClick={(e) => openMenu(e)}
                        >
                            <MoreVertIcon />
                        </IconButton>
                    }
                />
                <CardContent>
                    <div className={classes.avatarRoot}>
                        <Chip variant="outlined"
                            label={
                                post_type === 0
                                    ? lang.currLang.texts.Dream
                                    : lang.currLang.texts.Cdream
                            }
                        />
                        {technics.map((technic, key) =>
                            technic[0]
                                ? <Chip className={classes.smallChip}
                                    key={key}
                                    label={lang.currLang.current === "Ru"
                                        ? technic[1]
                                        : technic[2]}
                                />
                                : ''
                        )}
                    </div>
                    <div className={classes.avatarRoot}>
                        {tags.map((tag, key) =>
                            tag[0]
                                ? <Tooltip key={key}
                                    disableFocusListener
                                    disableTouchListener
                                    title={
                                        lang.currLang.current === "Ru"
                                            ? tag[1]
                                            : tag[2]
                                    }
                                >
                                    <Avatar className={classes.smallAvatar}
                                        alt="Remy Sharp"
                                        src={tag[3]}
                                        style={palette.type === 'dark'
                                            ? {
                                                filter: 'invert(1)',
                                            }
                                            : {

                                            }}
                                    />
                                </Tooltip>
                                : ''
                        )}
                    </div>
                </CardContent>
                <CardActions disableSpacing={true}>
                    <Typography
                        noWrap={expanded
                            ? false
                            : true
                        }
                        variant='body2'
                        style={{
                            padding: '12px',
                        }}
                    >
                        {expanded
                            ? lang.currLang.texts.TapToShow
                            : text_content
                        }
                    </Typography>

                    <IconButton
                        className={clsx(classes.expand, {
                            [classes.expandOpen]: expanded
                        })}
                        onClick={handleExpandClick}
                        aria-expanded={expanded}
                        aria-label="show more"
                    >
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded}
                    timeout="auto"
                    unmountOnExit >
                    <CardContent>
                        <Paper className={classes.contentPaper}>
                            <MUIRichTextEditor
                                controls={[
                                    "bold",
                                    "italic",
                                    "underline",
                                    "strikethrough",
                                    "colorfill",
                                ]}
                                customControls={[
                                    {
                                        name: "colorfill",
                                        icon: <FormatColorFillIcon />,
                                        type: "inline",
                                        inlineStyle: {
                                            backgroundColor: "yellow",
                                            color: "black"
                                        }
                                    }
                                ]}
                                readOnly={true}
                                toolbar={false}
                                value={post_content}
                            />
                        </Paper>
                        {post_type === 0
                            ? ''
                            :
                            <Grid container
                                style={{
                                    paddingTop: '10px',
                                }}
                                direction="row"
                                justify="center"
                                alignItems="stretch" >
                                <Grid item xs={6}>
                                    <Typography component="legend" variant='body2'>
                                        {lang.currLang.texts.rating}:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Rating name="simple-controlled"
                                        value={rating}
                                        readOnly
                                    />
                                </Grid>
                            </Grid>
                        }
                    </CardContent>
                </Collapse>
            </Card>
        </Grid>
    );
}

DreamCard.propTypes = {
    setSnackbar: PropTypes.func.isRequired,
    lang: PropTypes.object.isRequired,
    palette: PropTypes.object.isRequired,
}

const mapStateToProps = store => {
    return {
        lang: store.lang,
        palette: store.themeMode.palette,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setSnackbar: snackbar => dispatch(setSnackbar(snackbar)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DreamCard);