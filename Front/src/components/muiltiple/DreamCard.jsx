import React from 'react';
import clsx from "clsx";
import MUIRichTextEditor from 'mui-rte';

import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
import Typography from '@material-ui/core/Typography';
import IconButton from "@material-ui/core/IconButton";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import Tooltip from '@material-ui/core/Tooltip';
import Avatar from '@material-ui/core/Avatar';
import Card from "@material-ui/core/Card";
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

import Rating from "@material-ui/lab/Rating";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import MoreVertIcon from "@material-ui/icons/MoreVert";

import { useStyles } from '../../styles/Styles';

export default function DreamCard(props) {
    const classes = useStyles();
    const { post_title, create_date, post_content, post_type, tags, technics, rating, dream_date } = props.item;
    const { lang, palette } = props;
    const [expanded, setExpanded] = React.useState(false);

    const handleExpandClick = () => {
        setExpanded(!expanded);
    };

    return (
        <Grid item xs={12}
            style={{
                marginTop: '10px',
                marginBottom: '10px',
                width: '100%',
                height: 'auto',
                borderRadius: '4px',
            }}>
            <Card className={classes.card}>
                <CardHeader
                    action={
                        <IconButton aria-label="settings">
                            <MoreVertIcon />
                        </IconButton>
                    }
                    title={post_title}
                    subheader={create_date}
                />
                <CardContent>
                    <Chip variant="outlined"
                        label={post_type === 0
                            ? lang.currLang.texts.Dream
                            : lang.currLang.texts.Cdream
                        } />

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

                    <div className={classes.avatarRoot}>
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
                </CardContent>
                <CardActions disableSpacing>
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
                <Collapse in={expanded} timeout="auto" unmountOnExit>
                    <CardContent>
                        <div
                            style={{
                                backgroundColor: '#8080801f',
                                borderRadius: '4px',
                                padding: '4px',
                            }}
                        >
                            <MUIRichTextEditor
                                value={post_content.replace(/(:"\w+)(")(")/g, '$1\\$2$3')}
                                readOnly={true}
                                toolbar={false}
                            />
                        </div>
                        <Grid className={classes.ratingGridContainer}
                            container
                            direction="row"
                            justify="center"
                            alignItems="stretch" >
                            <Grid item xs={6}>
                                <Typography component="legend">
                                    {lang.currLang.texts.rating} :
                                            </Typography>
                            </Grid>
                            <Grid item xs={6}>
                                <Rating name="simple-controlled"
                                    value={rating}
                                    readOnly
                                />
                            </Grid>
                        </Grid>
                    </CardContent>
                    <CardActions disableSpacing>
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
                </Collapse>
            </Card>
        </Grid>
    );
}