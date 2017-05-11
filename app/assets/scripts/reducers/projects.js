import { REQUEST_PROJECTS, RECEIVE_PROJECTS, INVALIDATE_PROJECTS } from '../actions';

const initialState = {
  fetching: false,
  fetched: false,
  data: {
    meta: {
      page: null,
      limit: null,
      found: null
    },
    results: []
  }
};

export default function reducer (state = initialState, action) {
  switch (action.type) {
    case INVALIDATE_PROJECTS:
      return Object.assign({}, state, initialState);
    case REQUEST_PROJECTS:
      return Object.assign({}, state, { error: null, fetching: true, fetched: false });
    case RECEIVE_PROJECTS:
      state = Object.assign({}, state, { fetching: false, fetched: true });
      if (action.error) {
        state.error = action.error;
      } else {
        state.data = action.data;
      }
      break;
  }
  return state;
}
