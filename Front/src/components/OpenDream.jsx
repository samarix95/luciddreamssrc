import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import PropTypes from 'prop-types';
import MUIRichTextEditor from 'mui-rte';

import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Tooltip from '@material-ui/core/Tooltip';
import Button from '@material-ui/core/Button';
import Avatar from '@material-ui/core/Avatar';
import Grid from '@material-ui/core/Grid';
import Chip from '@material-ui/core/Chip';

import Skeleton from '@material-ui/lab/Skeleton';
import Rating from '@material-ui/lab/Rating';

import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import FormatColorFillIcon from '@material-ui/icons/FormatColorFill';

import { useStyles } from '../styles/Styles.js';
import { getUserPosts } from '../reducers/userPostsReducer.js';
import { getConnectPosts } from '../reducers/connectPostsReducer.js';

function OpenDream(props) {
    const { lang, themeMode, history, userPosts, connectPosts } = props;
    const { post_id } = props.location.defaultData;
    const { post_title, dream_date, post_content, post_type, rating, tags, technics } = typeof userPosts !== 'undefined' ? Object.assign(userPosts, connectPosts).find(item => item.post_id === post_id) : connectPosts.find(item => item.post_id === post_id);

    const muiTheme = createMuiTheme(themeMode);
    const classes = useStyles();

    React.useEffect(() => {

    }, []);

    return (
        <MuiThemeProvider theme={muiTheme}>
            <CssBaseline />
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
                                Ко-ко-комментарии
                                <Skeleton variant='rect' className={`${classes.padding} ${classes.height96} ${classes.width12}`}>
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
                                    onClick={() => { history.push('/dreams') }}
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
    userPosts: PropTypes.object.isRequired,
    connectPosts: PropTypes.object.isRequired
};

const mapStateToProps = store => {
    return {
        themeMode: store.themeMode,
        lang: store.lang,
        auth: store.auth,
        userPosts: getUserPosts(store),
        connectPosts: getConnectPosts(store)
    }
};

const mapDispatchToProps = (dispatch) => bindActionCreators({
}, dispatch)

export default connect(mapStateToProps, mapDispatchToProps)(OpenDream);