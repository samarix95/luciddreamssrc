import axios from "axios";
import { diff } from 'deep-object-diff';
import {
    fetchTagsPending, fetchTagsSuccess, fetchTagsError,
    fetchTechnicsPending, fetchTechnicsSuccess, fetchTechnicsError,
    fetchAvatarsPending, fetchAvatarsSuccess, fetchAvatarsError,
    fetchUserDataPending, fetchUserDataSuccess, fetchUserDataError,
    fetchUserPostsPending, fetchUserPostsSuccess, fetchUserPostsError,
    fetchConnectPostsPending, fetchConnectPostsSuccess, fetchConnectPostsError,
    fetchUserMapPending, fetchUserMapSuccess, fetchUserMapError,
    fetchRandomUsersPending, fetchRandomUsersSuccess, fetchRandomUsersError,
    fetchUpdateUserDataPending, fetchUpdateUserDataSuccess, fetchUpdateUserDataError, fetchResetUpdateUserDataError, fetchResetUpdateUserData,
    fetchCreateUserPending, fetchCreateUserSuccess, fetchCreateUserError, fetchResetCreateUserError,
    fetchLoginUserPending, fetchLoginUserSuccess, fetchLoginUserError, fetchResetLoginUserError,
    fetchPCommentsPending, fetchPCommentsSuccess, fetchPCommentsError, fetchResetPcommentsError,
    sendPCommentPending, sendPCommentSuccess, sendPCommentError, resetSendPCommentError,
    fetchUpdatePCommentPending, fetchUpdatePCommentSuccess, fetchUpdatePCommentError, fetchResetUpdatePCommentError
} from './actions/Actions.js';

export const maxSignUpSteps = 3;

const baseURL = "https://ldserver.herokuapp.com";

export const instance = axios.create({
    baseURL: baseURL,
    timeout: 15000,
    headers: { "Access-Control-Allow-Origin": "*" }
});

/*Get data from DB*/
export function fetchTagsAction() {
    return dispatch => {
        dispatch(fetchTagsPending());
        instance.get("/gettags")
            .then(res => {
                dispatch(fetchTagsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchTagsError(error));
            });
    }
}

export function fetchTechnicsAction() {
    return dispatch => {
        dispatch(fetchTechnicsPending());
        instance.get("/gettechnics")
            .then(res => {
                dispatch(fetchTechnicsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchTechnicsError(error));
            });
    }
}

export function fetchAvatarsAction() {
    return dispatch => {
        dispatch(fetchAvatarsPending());
        instance.get("/getavatars")
            .then(res => {
                dispatch(fetchAvatarsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchAvatarsError(error));
            });
    }
}

export function fetchUserDataAction(userId, userToken) {
    return (dispatch, getState) => {
        const oldStore = getState().fetchUserData.userData;
        if (oldStore.result && oldStore.result.id === userId) {
            instance.post("/actions/users/getuserdata", { id: userId, token: userToken })
                .then(res => {
                    if (Object.keys(diff(oldStore, res.data)).length) {
                        dispatch(fetchUserDataSuccess(res.data));
                    }
                })
                .catch(error => {
                    dispatch(fetchUserDataError(error));
                });
        }
        else {
            dispatch(fetchUserDataPending());
            instance.post("/actions/users/getuserdata", { id: userId, token: userToken })
                .then(res => {
                    dispatch(fetchUserDataSuccess(res.data));
                })
                .catch(error => {
                    dispatch(fetchUserDataError(error));
                });
        }
    }
};

export function fetchUserPostsAction(userId, userToken) {
    return dispatch => {
        dispatch(fetchUserPostsPending());
        instance.post("/actions/users/getuserposts", { id: userId, token: userToken })
            .then(res => {
                dispatch(fetchUserPostsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchUserPostsError(error));
            });
    }
};

export function fetchConnectPostsAction(userId, userToken) {
    return dispatch => {
        dispatch(fetchConnectPostsPending());
        instance.post("/actions/users/getconnectposts", { id: userId, token: userToken })
            .then(res => {
                dispatch(fetchConnectPostsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchConnectPostsError(error));
            });
    }
};

export function fetchUserMapAction(userId, userToken) {
    return dispatch => {
        dispatch(fetchUserMapPending());
        instance.post("/actions/users/getusermap", { id: userId, token: userToken })
            .then(res => {
                dispatch(fetchUserMapSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchUserMapError(error));
            });
    }
};

export function fetchRandomUsersAction(userId, limit, userToken) {
    return dispatch => {
        dispatch(fetchRandomUsersPending());
        instance.post("/actions/users/getranomusers", { id: userId, limit: limit, token: userToken })
            .then(res => {
                dispatch(fetchRandomUsersSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchRandomUsersError(error));
            });
    }
};

export function fetchPcommentsAction(post_id, userToken) {
    return dispatch => {
        dispatch(fetchPCommentsPending());
        instance.post("/actions/users/getpostscomments", { id: post_id, token: userToken })
            .then(res => {
                dispatch(fetchPCommentsSuccess(res.data));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchPCommentsError(error.response.data));
            });
    }
}
export function resetPcommentsErrorAction() {
    return dispatch => {
        dispatch(fetchResetPcommentsError());
    }
}

/*Update data in DB*/
export function fetchUpdateUserDataAction(userId, data, userToken) {
    return dispatch => {
        dispatch(fetchUpdateUserDataPending());
        instance.post("/actions/users/updateuserdata", { id: userId, data: data, token: userToken })
            .then(res => {
                dispatch(fetchUpdateUserDataSuccess(res.data));
                dispatch(fetchUserDataAction(userId, userToken));
            })
            .catch(error => {
                dispatch(fetchUpdateUserDataError(error.response.data));
            });
    }
};
export function resetUpdateUserDataErrorAction() {
    return dispatch => {
        dispatch(fetchResetUpdateUserDataError());
    }
}
export function resetUpdateUserDataAction() {
    return dispatch => {
        dispatch(fetchResetUpdateUserData());
    }
}

/*Create user*/
export function fetchCreateUserAction(data) {
    return dispatch => {
        dispatch(fetchCreateUserPending());
        instance.post("/actions/users/register", data)
            .then(res =>
                dispatch(fetchCreateUserSuccess(res.data))
            )
            .catch(err =>
                dispatch(fetchCreateUserError(err.response.data))
            );
    }
};
export function resetCreateUserErrorAction() {
    return dispatch => {
        dispatch(fetchResetCreateUserError());
    }
}

/*Login user */
export function fetchLoginUserAction(data) {
    return dispatch => {
        dispatch(fetchLoginUserPending());
        instance.post("/actions/users/login", data)
            .then(res => {
                dispatch(fetchLoginUserSuccess(res.data))
            })
            .catch(err => {
                dispatch(fetchLoginUserError(err.response.data))
            });
    }
};
export function resetLoginUserErrorAction() {
    return dispatch => {
        dispatch(fetchResetLoginUserError());
    }
}

/*Create post comment */
export function sendPCommentAction(data) {
    return dispatch => {
        dispatch(sendPCommentPending());
        instance.post("/actions/users/addcomment", data)
            .then(res => {
                dispatch(sendPCommentSuccess(res.data))
                dispatch(fetchPcommentsAction(data.post_id, data.token));
            })
            .catch(err => {
                dispatch(sendPCommentError(err.response.data))
            });
    }
};
export function resetSendPCommentErrorAction() {
    return dispatch => {
        dispatch(resetSendPCommentError());
    }
}

/*Update post comment */
export function updatePCommentAction(data) {
    return dispatch => {
        dispatch(fetchUpdatePCommentPending());
        instance.post("/actions/users/updatepostscomments", data)
            .then(res => {
                dispatch(fetchUpdatePCommentSuccess(res.data));
                dispatch(fetchPcommentsAction(data.post_id, data.token));
                return res.data;
            })
            .catch(error => {
                dispatch(fetchUpdatePCommentError(error.response.data));
            });
    }
}
export function resetUpdatePCommentError() {
    return dispatch => {
        dispatch(fetchResetUpdatePCommentError());
    }
}