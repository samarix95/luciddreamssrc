import React from 'react';
import clsx from "clsx";
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
import Paper from '@material-ui/core/Paper';
import Card from "@material-ui/core/Card";
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';
import Menu from '@material-ui/core/Menu';

import Rating from "@material-ui/lab/Rating";

import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import EditIcon from "@material-ui/icons/Edit";

import { useStyles } from '../../styles/Styles';

export default function DreamCard(props) {
    const classes = useStyles();
    const { post_title, post_content, post_type, tags, technics, rating, dream_date } = props.item;
    const { lang, palette } = props;
    const [expanded, setExpanded] = React.useState(false);
    const [anchorEl, setAnchorEl] = React.useState(null);

    const dateOfDream = new Date(dream_date).getDate() + '.' + new Date(dream_date).getMonth() + '.' + new Date(dream_date).getFullYear() + ' ' + new Date(dream_date).getHours() + ':' + ("0" + new Date(dream_date).getMinutes()).slice(-2);
    const srcContent = post_content.toString();
    const jsonPparse = JSON.parse(srcContent);
    const convertfromraw = convertFromRaw(jsonPparse);
    const text_content = EditorState.createWithContent(convertfromraw).getCurrentContent().getPlainText('');

    const openMenu = event => {
        setAnchorEl(event.currentTarget);
    };

    const closeMenu = () => {
        setAnchorEl(null);
    };

    const clickMenu = (action) => {
        closeMenu();
        console.log(action);
    };

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Grid item xs={12}
            style={{
                marginTop: '15px',
                marginBottom: '15px',
                width: '100%',
                height: 'auto',
                borderRadius: '4px',
            }}>

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
                                    onChange={() => clickMenu('public')}
                                    //checked={state.checkedB}
                                    value="checkedB"
                                    color="primary"
                                />
                            }
                        //label="Primary"
                        />
                    </ListItemIcon>
                    {lang.currLang.buttons.Edit}
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

            <Card raised={false}
                className={classes.card}>
                <CardHeader
                    title={post_title}
                    subheader={dateOfDream}
                    action={
                        <IconButton aria-label="settings" onClick={(e) => openMenu(e)}>
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
                        style={{ padding: '12px', }}
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
                            <Grid style={{ paddingTop: '10px', }}
                                container
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