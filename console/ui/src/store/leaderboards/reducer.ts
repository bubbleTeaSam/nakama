import {Reducer} from 'redux';
import {TournamentState, TournamentsState, TournamentActionTypes, NewTournamentState} from './types';

const initialTournamentsState: TournamentsState = {
  data:
  {
    tournaments: [],
    total_count: 0
  },
  errors: undefined,
  loading: false
};

export const tournamentsReducer: Reducer<TournamentsState> = (state = initialTournamentsState, action) =>
{
  switch(action.type)
  {
    case TournamentActionTypes.FETCH_MANY_REQUEST:
      return {...state, loading: true};
    case TournamentActionTypes.FETCH_MANY_SUCCESS:
      return {...state, loading: false, errors: undefined, data: action.payload};
    case TournamentActionTypes.FETCH_MANY_ERROR:
      return {...state, loading: false, errors: action.payload, data: initialTournamentsState.data};
    case TournamentActionTypes.DELETE_REQUEST:
      return {...state, loading: true};
    case TournamentActionTypes.DELETE_SUCCESS:
      return {...state, loading: false, errors: undefined};
    case TournamentActionTypes.DELETE_ERROR:
      return {...state, loading: false, errors: action.payload};
    default:
      return state;
  }
}

const initialTournamentState: TournamentState = {
  data:
  {
    id: '',
    sort_order: '',
    title: '',
    description: '',
    category: 0,
    size: 0,
    max_size: 0,
    max_num_score: 0,
    can_enter: true,
    duration: 0,
    create_time: 0,
    start_time: 0,
    end_time: 0,
    start_active: 0,
    end_active: 0,
    next_reset: 0,
    metadata: {}
  },
  updated: false,
  errors: undefined,
  loading: false
};

export const tournamentReducer: Reducer<TournamentState> = (state = initialTournamentState, action) =>
{
  switch(action.type)
  {
    case TournamentActionTypes.FETCH_REQUEST:
      return {...state, loading: true};
    case TournamentActionTypes.FETCH_SUCCESS:
      return {...state, loading: false, errors: undefined, data: action.payload};
    case TournamentActionTypes.FETCH_ERROR:
      return {...state, loading: false, errors: action.payload, data: initialTournamentState.data};
    case TournamentActionTypes.UPDATE_REQUEST:
      return {...state, loading: true};
    case TournamentActionTypes.UPDATE_SUCCESS:
      return {...state, loading: false, errors: undefined, updated: true};
    case TournamentActionTypes.UPDATE_ERROR:
      return {...state, loading: false, errors: action.payload, updated: false};
    case TournamentActionTypes.DELETE_REQUEST:
      return {...state, loading: true};
    case TournamentActionTypes.DELETE_SUCCESS:
      return {...state, loading: false, errors: undefined};
    case TournamentActionTypes.DELETE_ERROR:
      return {...state, loading: false, errors: action.payload};
    default:
      return state;
  }
}

const initialNewTournamentState: NewTournamentState = {
  errors: undefined,
  data: {
    id: ''
  },
  loading: false
};

export const newTournamentReducer: Reducer<NewTournamentState> = (state = initialNewTournamentState, action) =>
{
  switch(action.type)
  {
    case TournamentActionTypes.CREATE_REQUEST:
      return {...state, loading: true};
    case TournamentActionTypes.CREATE_SUCCESS:
      return {...state, loading: false, errors: undefined, data: action.payload};
    case TournamentActionTypes.CREATE_ERROR:
      return {...state, loading: false, errors: action.payload};
    default:
      return state;
  }
}
