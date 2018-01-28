import * as React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import { PLAYER_JOINED, GAME_STARTED } from '../store';
import './index.css';

class LobbyScreen extends React.Component<Props, State> {

  componentDidMount() {
    if(this.props.code === null) {
      this.props.history.push('/');
    }

    this.props.socket.addEventListener('message', function(data) {
      switch(data.op) {
        case 'PLAYER_JOINED':
          this.props.player_joined(true);
          break;
        case 'GAME_STARTED':
          this.props.game_started(data);
          this.props.history.push('/game');
          break;
        default:
          break;
      }
    });
  }

  startGame = () => {
    this.props.socket.send(JSON.stringify({ op: 'START_GAME' }));
  }

  render() {
    let content = null;

    if(this.props.joined) {
      content = <button className="button start-game-button" type="button" onClick={ this.startGame }>Start Game</button>
    } else {
      content = <div>
        <p>Tell your opponent this code:</p>
        <div className="code">
          <p>{ this.props.code }</p>
        </div>
      </div>
    }

    return (
      <div className={ this.props.playerNumber === 2 ? "player2 lobby-screen screen" : "lobby-screen screen" } >
        <h1>Ready?</h1>
        <p className="subtitle">{ this.props.player2 ? 'It\'s time for battle!' : 'Waiting for Player 2...' }</p>
        { content }
        <Link className='exit-button' to='/'>&#8249; Exit</Link>
      </div>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    player_joined: joined => {
      dispatch({ type: PLAYER_JOINED, joined });
    },
    game_started: data => {
      dispatch({ type: GAME_STARTED, health: data.health, money: data.money, income: data.income });
    }
  };
};

const mapStateToProps = (state) => state;
const ConnectedLobbyScreen = connect(mapStateToProps, mapDispatchToProps)(LobbyScreen);
export default ConnectedLobbyScreen;