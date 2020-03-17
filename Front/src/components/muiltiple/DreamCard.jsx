import React from 'react';
import clsx from "clsx";
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import MUIRichTextEditor from 'mui-rte';
import { EditorState, convertFromRaw } from 'draft-js';

import FormControlLabel from "@material-ui/core/FormControlLabel";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import CardHeader from "@material-ui/core/CardHeader";
import MenuItem from "@material-ui/core/MenuItem";
import Collapse from "@material-ui/core/Collapse";
import Checkbox from '@material-ui/core/Checkbox';
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Card from "@material-ui/core/Card";
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';

import Rating from "@material-ui/lab/Rating";

import ChatBubbleOutlineIcon from '@material-ui/icons/ChatBubbleOutline';
import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Visibility from '@material-ui/icons/Visibility';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";

import { useStyles } from "../../styles/Styles.js";

function DreamCard(props) {
    const { lang, palette, history, setOpenConfirm, setConfirmData } = props;
    const { post_id, post_title, post_content, post_type, tags, technics, rating, dream_date, is_public } = props.item;

    const [expanded, setExpanded] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const [publicChecked, setPublicChecked] = React.useState(false);

    const classes = useStyles();
    const dateOfDream = new Date(dream_date).getDate() + '.' + (new Date(dream_date).getMonth() + 1) + '.' + new Date(dream_date).getFullYear() + ' ' + new Date(dream_date).getHours() + ':' + ("0" + new Date(dream_date).getMinutes()).slice(-2);
    const text_content = EditorState.createWithContent(convertFromRaw(JSON.parse(post_content.toString()))).getCurrentContent().getPlainText('');

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
        switch (action) {
            case 'public':
                setConfirmData(
                    event.target.checked
                        ? {
                            id: post_id,
                            header: lang.currLang.texts.PublicAlert,
                            body: lang.currLang.texts.PublicText,
                            commit: lang.currLang.texts.Publish,
                            action: 'publicOk'
                        }
                        : {
                            id: post_id,
                            header: lang.currLang.texts.UnpublicAlert,
                            body: lang.currLang.texts.UnpublicText,
                            commit: lang.currLang.texts.Unpublish,
                            action: 'publicOk'
                        }
                );
                setOpenConfirm(true);
                closeMenu();
                break;
            case 'delete':
                setConfirmData({
                    id: post_id,
                    header: lang.currLang.texts.DeleteAlert,
                    body: lang.currLang.texts.DeleteText,
                    commit: lang.currLang.buttons.Delete,
                    action: 'deleteOk'
                });
                setOpenConfirm(true);
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
                            tags: tags
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
                            rating: rating
                        }
                    });
                }
                break;
        }
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    const openDream = () => {
        history.push({
            pathname: "/opendream",
            defaultData: {
                post_id: post_id
            }
        });
    };

    return (
        <Grid item className={classes.dreamCardDiv}>
            <Menu id="simple-menu"
                anchorEl={anchorEl}
                keepMounted
                open={Boolean(anchorEl)}
                onClose={closeMenu}
            >
                <MenuItem >
                    <ListItemIcon>
                        <FormControlLabel
                            control={
                                <Checkbox onChange={(e) => clickMenu('public', e)}
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
                        <DeleteIcon fontSize="small" />
                    </ListItemIcon>
                    {lang.currLang.buttons.Delete}
                </MenuItem>
            </Menu>
            <Card raised={true} className={`${classes.card}`}>
                <CardHeader
                    title={
                        <Grid container
                            direction="row"
                            justify="flex-start"
                            alignItems="center"
                        >
                            <Grid item xs={10}>
                                <Typography variant='subtitle1'>
                                    {post_title} ({post_type === 0 ? lang.currLang.texts.Dream : lang.currLang.texts.Cdream})
                                </Typography>
                            </Grid>
                            <Grid item xs={2}>
                                <Tooltip disableFocusListener disableTouchListener title={publicChecked ? lang.currLang.texts.PublicDescription : lang.currLang.texts.UnpublicDescription}>
                                    {publicChecked ? <Visibility className={classes.iconCenter} /> : <VisibilityOff className={classes.iconCenter} />}
                                </Tooltip>
                            </Grid>
                        </Grid>
                    }
                    action={
                        <IconButton onClick={(e) => openMenu(e)} >
                            <MoreVertIcon />
                        </IconButton>
                    }
                    subheader={dateOfDream}
                />
                <CardActions disableSpacing={true}>
                    <Typography className={`${classes.padding}`} variant='body2' noWrap={expanded ? false : true}>
                        {expanded ? lang.currLang.texts.TapToShow : text_content}
                    </Typography>
                    <IconButton className={clsx(classes.expand, { [classes.expandOpen]: expanded })} onClick={handleExpandClick} aria-expanded={expanded}>
                        <ExpandMoreIcon />
                    </IconButton>
                </CardActions>
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <div className={classes.avatarRoot}>
                            {technics.map((technic, key) =>
                                technic[0]
                                    ? <Chip key={key} className={classes.smallChip} label={lang.currLang.current === "Ru" ? technic[1] : technic[2]} />
                                    : <React.Fragment />
                            )}
                        </div>
                        <div className={classes.avatarRoot}>
                            {tags.map((tag, key) =>
                                tag[0]
                                    ? <Tooltip key={key}
                                        disableFocusListener
                                        disableTouchListener
                                        title={lang.currLang.current === "Ru" ? tag[1] : tag[2]}
                                    >
                                        <Avatar className={classes.smallAvatar} style={palette.type === 'dark' ? { filter: 'invert(1)' } : {}} src={tag[3]} />
                                    </Tooltip>
                                    : <React.Fragment />
                            )}
                        </div>
                        <MUIRichTextEditor className={classes.contentPaper}
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
                        {post_type === 0
                            ? <React.Fragment />
                            : <Grid className={`${classes.padding}`}
                                container
                                direction="row"
                                justify="center"
                                alignItems="stretch"
                            >
                                <Grid item xs={6}>
                                    <Typography variant='body2'>
                                        {lang.currLang.texts.rating}:
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Rating readOnly value={rating} />
                                </Grid>
                            </Grid>
                        }
                    </CardContent>
                </Collapse>
                <div className={`${classes.margin}`}>
                    <IconButton onClick={openDream}>
                        <ChatBubbleOutlineIcon />
                    </IconButton>
                </div>
            </Card>
        </Grid>
    )
}

DreamCard.propTypes = {
    lang: PropTypes.object.isRequired,
    palette: PropTypes.object.isRequired
}

const mapStateToProps = store => {
    return {
        lang: store.lang,
        palette: store.themeMode.palette
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(DreamCard);