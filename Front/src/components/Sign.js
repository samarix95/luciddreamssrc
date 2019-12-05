import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setLogin } from '../actions/Actions';

import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import Slide from '@material-ui/core/Slide';
import Grid from '@material-ui/core/Grid';

import { mdiVk } from '@mdi/js';
import Icon from '@mdi/react';

const Transition = React.forwardRef(function Transition(props, ref) {
    return <Slide direction="up" ref={ref} {...props} />;
});

const mapStateToProps = store => {
    return {
        store,
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setLoginAction: loginState => dispatch(setLogin(loginState)),
    }
}

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Sign)

function Sign(props) {
    //const { setLoginAction, } = props;
    const { lang, themeMode, } = props.store;

    const [openLogin, setOpenLogin] = React.useState(false);

    const checkLoginState = (response) => {
        // console.log(response);
        // if (response.status === 'connected') {
        //     window.VK.Api.call('users.get', { user_ids: response.session.mid, v: "5.103", fields: "sex, bdate, city, country, has_photo, photo_50, photo_100, photo_200_orig, photo_200, photo_400_orig, photo_max, photo_max_orig, domain, timezone, screen_name, crop_photo" }, function (r) {
        //         console.log(r.response[0]);
        //         setLoginAction(true);
        //     });
        // }
    };

    const click = (action) => {
        switch (action) {
            case 'useVk':
                //window.VK.Auth.login(checkLoginState, 4194304);
                let loadItems = async () => {
                    const response = await fetch('http://10.203.117.137:3001/auth/vk', {
                        method: 'GET',
                        credentials: 'include',
                    });
                    const body = await response.json();

                    console.log(response);
                }
                break;
            case 'openLogin':
                setOpenLogin(true);
                break;
            case 'closeLogin':
                setOpenLogin(false);
                break;
            default:
                break;
        }
    }

    return (
        <Grid item xs={12} className={props.classes.menuButtonContainerItem}>
            <Dialog
                open={openLogin}
                TransitionComponent={Transition}
                keepMounted
                onClose={() => { click('closeLogin') }}
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description" >
                <DialogTitle id="alert-dialog-slide-title">
                    {lang.currLang.buttons.signIn}
                </DialogTitle>
                <DialogContent>
                    <Grid item xs={12} className={props.classes.menuButtonContainerItem}>

                        <Grid item xs={2} className={props.classes.menuDivButton} align="center">
                            <TextField
                                //className={classes.textField}
                                id="email-field"
                                type="email"
                                label="Email"
                            //value={values.email}
                            //onChange={handleChangeEmail}
                            />
                        </Grid>

                        <Grid item xs={2} className={props.classes.menuDivButton} align="center">
                            <TextField
                                //id="password-field"
                                //className={classes.textField}
                                //type={values.showPassword ? 'text' : 'password'}
                                label={lang.currLang.texts.password}
                            //value={values.password}
                            //onChange={handleChangePassword}
                            // InputProps={{
                            //     endAdornment: (
                            //         <InputAdornment position="end">
                            //             <IconButton
                            //                 tabIndex="-1"
                            //                 edge="end"
                            //                 aria-label="toggle password visibility"
                            //                 onClick={handleClickShowPassword}
                            //                 onMouseDown={handleMouseDownPassword}
                            //             >
                            //                 {values.showPassword ? <VisibilityOff /> : <Visibility />}
                            //             </IconButton>
                            //         </InputAdornment>
                            //     ),
                            // }}
                            />
                        </Grid>

                        <Grid item xs={2} className={props.classes.menuDivButton} align="center">
                            <Typography>
                                {lang.currLang.texts.or}
                            </Typography>
                        </Grid>

                        <Grid item xs={2} className={props.classes.menuDivButton} align="center">
                            <IconButton className={props.classes.button} onClick={() => { click('useVk') }}>
                                {/* <a href={"http://10.203.117.137:3001/auth/vk"}
                                    title="Войти через ВК"> */}
                                <Icon path={mdiVk} size={2} color={themeMode.palette.type === 'light' ? 'rgba(0, 0, 0, 0.54)' : 'rgba(255, 255, 255, 1)'} />
                                {/* </a> */}
                            </IconButton>
                        </Grid>

                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => { click('closeLogin') }} color="primary">
                        {lang.currLang.buttons.cancel}
                    </Button>
                    <Button onClick={() => { click('closeLogin') }} color="primary">
                        {lang.currLang.buttons.signIn}
                    </Button>
                </DialogActions>
            </Dialog>
            <Grid item xs={2} className={props.classes.menuDivButton} align="center">
                <Button variant="contained" color="primary" className={props.classes.menuButton} onClick={() => { click('openLogin') }}>
                    {lang.currLang.buttons.signIn}
                </Button>
            </Grid>

            <Grid item xs={2} className={props.classes.menuDivButton} align="center">
                <Button variant="contained" color="primary" className={props.classes.menuButton}>
                    {lang.currLang.buttons.signUp}
                </Button>
            </Grid>

            <Grid item xs={2} className={props.classes.menuDivButton} align="center"></Grid>

            <Grid item xs={2} className={props.classes.menuDivButton} align="center">
                <Button variant="contained"
                    color="primary"
                    className={props.classes.menuButton}
                    onClick={() => (props.onMenuClick('openAboutPage'))} >
                    {lang.currLang.buttons.about}
                </Button>
            </Grid>

        </Grid>
    )
}

Sign.propTypes = {
    setLoginAction: PropTypes.func.isRequired,
}