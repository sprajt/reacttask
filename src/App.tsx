import { useRef, useState } from "react";
import { useEffect } from "react";
import { useCallback } from "react";

/**
 * Represents the data for the games.
 * each object of the games[] stores one game
 * each game contains 2 sides: home and away
 * each side has different chances to score a goal, which is defined by 'odds'
 */
const simulationData = {
  title: "Katar 2023",
  games: [
    {
      id: "1",
      home: {
        name: "Germany",
        odds: 0.2,
        score: 0,
      },
      away: {
        name: "Poland",
        odds: 0.8,
        score: 0,
      },
      active: false,
    },
    {
      id: "2",
      home: {
        name: "Brazil",
        odds: 0.7,
        score: 0,
      },
      away: {
        name: "Mexico",
        odds: 0.3,
        score: 0,
      },
      active: false,
    },
    {
      id: "3",
      home: {
        name: "Argentina",
        odds: 0.6,
        score: 0,
      },
      away: {
        name: "Uruguay",
        odds: 0.4,
        score: 0,
      },
      active: false,
    },
  ],
};

/**
 * Represents the main App component.
 */
function App() {
  const gamesArray = simulationData.games;
  const [games, setGames] = useState(gamesArray);
  const [totalGoals, setTotalGoals] = useState(0);
  const [gameStatus, setGameStatus] = useState("before");
  const [gameLength, setGameLength] = useState(90);

  /**
   * Handles the game status based on the current game status.
   */
  function handleGameStatus() {
    if (gameStatus === "before") {
      setGameStatus((gameStatus) => "ongoing");
    } else if (gameStatus === "ongoing") {
      setGameStatus((gameStatus) => "stopped");
    } else if (gameStatus === "stopped") {
      setGames(() => gamesArray);
      setTotalGoals(() => 0);
      setGameLength(90);
      setGameStatus((gameStatus) => "ongoing");
    }
  }

  /**
   * Scores a goal for a random game.
   */
  const scoreGoal = useCallback(() => {
    const randomIndex = Math.floor(Math.random() * games.length);
    const randomGame = games[randomIndex];
    let homeScore = randomGame.home.score;
    let awayScore = randomGame.away.score;
    const homeScoreProbability = 1 - randomGame.away.odds;
    const randomNumber = Math.random();
    if (randomNumber <= homeScoreProbability) {
      homeScore += 1;
    } else {
      awayScore += 1;
    }

    const updatedGames = games.map((game) => {
      if (game.id === randomGame.id) {
        return {
          ...game,
          home: {
            ...game.home,
            score: homeScore,
          },
          away: {
            ...game.away,
            score: awayScore,
          },
          active: true,
        };
      } else {
        return {
          ...game,
          active: false,
        };
      }
    });

    setGames((games) => (games = updatedGames));
    setTotalGoals((totalGoals) => totalGoals + 1);
  }, [games, setGames, setTotalGoals]);

  /**
   * score goal every 10 seconds
   */
  useEffect(
    function () {
      let intervalID: NodeJS.Timeout;
      if (gameStatus === "ongoing") {
        intervalID = setInterval(() => {
          scoreGoal();
          setGameLength((length) => length - 10);
        }, 10000);
      }
      return function () {
        clearInterval(intervalID);
      };
    },
    [gameStatus, scoreGoal, gameLength]
  );

  /**
   * stop the game after gameLength reaches 0 (10 is deducted from gameLength initial value after each goal)
   */
  useEffect(() => {
    if (gameLength === 0) {
      setGameLength(90);
      setGameStatus("stopped");
    }
  }, [gameLength]);

  return (
    <div className="App">
      <div className="container">
        <h4>{simulationData.title}</h4>
        <button onClick={handleGameStatus}>
          {gameStatus === "before"
            ? "Start"
            : gameStatus === "ongoing"
            ? "Finish"
            : "Restart"}
        </button>
        <GamesList games={games} />
        <p className="total-goals">
          Total goals: <span>{totalGoals}</span>
        </p>
      </div>
    </div>
  );
}

/**
 * Represents the list of games.
 * @param games - The array of games.
 */
function GamesList({ games }: { games: any[] }) {
  return (
    <ul>
      {games.map((item) => (
        <SingleGame key={item.id} item={item} />
      ))}
    </ul>
  );
}

/**
 * Represents a single game.
 * @param item - The game object.
 */
function SingleGame({ item }: { item: any }) {
  const activeEl = useRef<HTMLLIElement | null>(null);

  useEffect(
    function () {
      if (item.active) {
        //alert("true");
        if (activeEl.current !== null) {
          activeEl.current.classList.add("active");
          setTimeout(function () {
            if (activeEl.current !== null) {
              activeEl.current.classList.remove("active");
            }
          }, 1000);
        }
      }
    },
    [item.active]
  );

  return (
    // add highlight effect after the goal
    // <li ref={activeEl} className={`game ${item.active ? "active" : ""}`}>
    <li ref={activeEl} className="game">
      <p>
        {item.home.name} vs {item.away.name}
        <span>
          {item.home.score} : {item.away.score}
        </span>
      </p>
    </li>
  );
}

export default App;
