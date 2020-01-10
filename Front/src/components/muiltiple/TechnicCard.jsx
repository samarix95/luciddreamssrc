import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import DialogContentText from '@material-ui/core/DialogContentText';
import CardActionArea from '@material-ui/core/CardActionArea';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import CardMedia from '@material-ui/core/CardMedia';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Grid from '@material-ui/core/Grid';
import Card from '@material-ui/core/Card';

import { useStyles } from '../../styles/Styles';
import { setSnackbar } from '../../actions/Actions';

function TechnicCard(props) {
    const { item, lang, auth, history } = props;
    const classes = useStyles();
    const [openAlert, setOpenAlert] = React.useState(false);
    const [alertTexts, setAlertTexts] = React.useState({
        header: '',
        body: '',
        commit: '',
        action: '',
    });
    const actions = (action) => {
        switch (action) {
            case 'edit':
                history.push({
                    pathname: "/addtechnics",
                    defaultData: {
                        item: item,
                    }
                });
                break;
            case 'delete':
                let newAlertTexts = alertTexts;
                newAlertTexts = { ...newAlertTexts, header: lang.currLang.texts.DeleteAlert };
                newAlertTexts = { ...newAlertTexts, body: lang.currLang.texts.DeleteText };
                newAlertTexts = { ...newAlertTexts, commit: lang.currLang.buttons.Delete };
                newAlertTexts = { ...newAlertTexts, action: 'deleteOk' };
                setAlertTexts(newAlertTexts);
                setOpenAlert(true);
                break;
            case 'deleteOk':
                setOpenAlert(false);
                props.loadTechnics();
                break;
            case 'closeAlert':
                setOpenAlert(false);
                break;
            default:
                break;
        }
    };

    return (
        <Grid item xs={12} className={classes.dreamCardDiv} >
            <Dialog open={openAlert}
                onClose={() => actions('closeAlert')}
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
                    <Button onClick={() => actions('closeAlert')}
                        color="secondary">
                        {lang.currLang.buttons.cancel}
                    </Button>
                    <Button onClick={() => actions(alertTexts.action)}
                        color="primary" autoFocus>
                        {alertTexts.commit}
                    </Button>
                </DialogActions>
            </Dialog>
            <Card raised={true} className={classes.card}>
                <CardActionArea>
                    <CardMedia className={classes.media}
                        image="https://4.bp.blogspot.com/-imM00o7SslA/V8NXohT8AmI/AAAAAAAAFOM/F7h1SZjMaCU4mJ6PlwUlx7tpePjVJWlcACLcB/s1600/Cockpit%2B2.png"
                    />
                    <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                            {lang.currLang.current === "Ru"
                                ? item.name_rus
                                : item.name_eng
                            }
                        </Typography>
                        <Typography variant="body2" color="textSecondary" component="p">
                            Lizards are a widespread group of squamate reptiles, with over 6,000 species, ranging
                            across all continents except Antarctica
                        </Typography>
                    </CardContent>
                </CardActionArea>
                {auth.user.roles < 2 //0 - admin; 1 - moderator
                    ? <CardActions>
                        <Button size="small" color="secondary" onClick={() => { actions('delete') }}>
                            {lang.currLang.buttons.Delete}
                        </Button>
                        <Button size="small" color="primary" onClick={() => { actions('edit') }}>
                            {lang.currLang.buttons.Edit}
                        </Button>
                    </CardActions>
                    : ''
                }
            </Card>
        </Grid>
    );
}

TechnicCard.propTypes = {
    setSnackbar: PropTypes.func.isRequired,
    lang: PropTypes.object.isRequired,
    palette: PropTypes.object.isRequired,
    auth: PropTypes.object.isRequired,
}

const mapStateToProps = store => {
    return {
        lang: store.lang,
        palette: store.themeMode.palette,
        auth: store.auth,
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
)(TechnicCard);