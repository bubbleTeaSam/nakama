import React, {Component} from 'react';
import {RouteComponentProps} from 'react-router';
import queryString from 'query-string';

import {Dispatch} from 'redux';
import {connect} from 'react-redux';
import {ApplicationState, ConnectedReduxProps} from '../../store';
import * as tournamentActions from '../../store/tournaments/actions';
import {TournamentObject, TournamentReference, TournamentsObject, TournamentsObjectRequest} from '../../store/tournaments/types';

import {Button, Column, Control, Field, Generic, Icon, Input, Level, Section, Table, Title} from 'rbx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

import Header from '../../components/header';
import Sidebar from '../../components/sidebar';

interface PropsFromState {
  loading: boolean,
  errors: string | undefined,
  data: TournamentsObject
}

interface PropsFromDispatch {
  fetchManyRequest: typeof tournamentActions.tournamentFetchManyRequest,
  deleteRequest: typeof tournamentActions.tournamentDeleteRequest
}

type Props = RouteComponentProps & PropsFromState & PropsFromDispatch & ConnectedReduxProps;

type State = {
};

class Tournaments extends Component<Props, State> {
  public constructor(props: Props) {
    super(props);
    this.state = {};
  }

  public componentDidMount() {
    this.props.fetchManyRequest({});
  }

  public all() {
    this.props.fetchManyRequest({});
  }

  public details(id: string) {
    const {history} = this.props;
    history.push(`/tournaments/${id}`);
  }

  public create() {
    const {history} = this.props;
    history.push(`/tournaments/new`);
  }

  public remove(object: TournamentObject, event: React.FormEvent<Element>) {
    event.stopPropagation();
    event.preventDefault();
    if (confirm('Are you sure you want to delete this tournament?')) {
      this.props.deleteRequest(Object.assign(object, this.state));
    }
  }

  public clone(id: string, event: React.FormEvent<Element>) {
    event.stopPropagation();
    event.preventDefault();
    const {history} = this.props;
    history.push(`/tournaments/clone/${id}`);
  }

  public render() {
    const {data} = this.props;
    return <Generic id="tournaments">
      <Header/>
      <Section>
        <Column.Group>
          <Sidebar active="tournaments"/>

          <Column>
            <Level>
              <Level.Item align="left">
                <Level.Item>
                  <Title subtitle size={5}>
                    ~<strong>{data.total_count}</strong> tournaments
                  </Title>
                </Level.Item>
              </Level.Item>
              <Level.Item align="right">
                <Level.Item>
                  <Field kind="addons">
                    <Control>
                      <Button onClick={this.create.bind(this)}>New Tournament</Button>
                    </Control>
                  </Field>
                </Level.Item>
              </Level.Item>
            </Level>

            <Table fullwidth striped hoverable>
              <Table.Head>
                <Table.Row>
                  <Table.Heading style={{width: '25%'}}>ID</Table.Heading>
                  <Table.Heading style={{width: '25%'}}>Name</Table.Heading>
                  <Table.Heading style={{width: '36%'}}>Description</Table.Heading>
                  <Table.Heading style={{width: '7%'}}>&nbsp;</Table.Heading>
                  <Table.Heading style={{width: '7%'}}>&nbsp;</Table.Heading>
                </Table.Row>
              </Table.Head>
              <Table.Body>
                {
                  (data.tournaments || []).map((tournament, key) =>
                    <Table.Row
                      key={`cell_${key}`}
                      onClick={this.details.bind(this, tournament.id)}
                    >
                      <Table.Cell>{tournament.id}</Table.Cell>
                      <Table.Cell>{tournament.title}</Table.Cell>
                      <Table.Cell>{tournament.description}</Table.Cell>
                      <Table.Cell>
                        {
                            <Button
                              size="small"
                              onClick={this.remove.bind(this, tournament)}
                            >Delete</Button>
                        }
                      </Table.Cell>
                      <Table.Cell>
                        {
                            <Button
                              size="small"
                              onClick={this.clone.bind(this, tournament.id)}
                            >Clone</Button>
                        }
                      </Table.Cell>
                    </Table.Row>
                  )
                }
              </Table.Body>
            </Table>
          </Column>
        </Column.Group>
      </Section>
    </Generic>;
  }
}

const mapStateToProps = ({tournament}: ApplicationState) => ({
  loading: tournament.loading,
  errors: tournament.errors,
  data: tournament.data
});

const mapDispatchToProps = (dispatch: Dispatch) => ({
  fetchManyRequest: (data: TournamentsObjectRequest) => dispatch(
    tournamentActions.tournamentFetchManyRequest(data)
  ),
  deleteRequest: (data: TournamentReference) => dispatch(
    tournamentActions.tournamentDeleteRequest(data)
  )
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tournaments);
