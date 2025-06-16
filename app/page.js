"use client";

import React, { useState } from "react";
import GamePage from "./GamePage";

export default function Home() {
  const [player1, setPlayer1] = useState("");
  const [player2, setPlayer2] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  const canStart = player1.trim() !== "" && player2.trim() !== "";

  return gameStarted ? (
    <GamePage
      player1={player1}
      player2={player2}
      onRestart={() => setGameStarted(false)}
    />
  ) : (
    <div style={{ padding: 20, fontFamily: "sans-serif", maxWidth: 600, margin: "0 auto" }}>
      <h1>Welcome to Quatro</h1>
      <br/>
      <h2>🎯 Goal:</h2>
      <p>Outsmart your opponent by being the first to align 4 pieces in a row or form a 2×2 block</p>
      <br/>
      <h2>🏆 Win conditions:</h2>
      <ul>
        <li>4 pieces sharing a trait (color or shape) in a row, column, or diagonal</li>
        <li>OR 4 in a 2×2 square block</li>
      </ul>
      <br/>
      <h2>🎲 Pieces:</h2>
      <p>Each piece has:</p>
      <ul>
        <li>Color: black or white</li>
        <li>Shape: circle or square</li>
      </ul>
      <br/>
      <h2>🕹 How to Play:</h2>
      <ol>
        <li>Players take turns selecting a piece to place on the board</li>
        <li>You can’t use the same space twice</li>
        <li>Keep playing until someone wins — or the board fills up (draw!)</li>
      </ol>
      <br/>
      <h2>👥 Enter Player Names:</h2>
      <input
        placeholder="Player 1 Name"
        value={player1}
        onChange={(e) => setPlayer1(e.target.value)}
        style={{ display: "block", margin: "8px 0", padding: 6, width: "100%" }}
      />
      <input
        placeholder="Player 2 Name"
        value={player2}
        onChange={(e) => setPlayer2(e.target.value)}
        style={{ display: "block", margin: "8px 0", padding: 6, width: "100%" }}
      />
      <button
        onClick={() => setGameStarted(true)}
        disabled={!canStart}
        style={{
          padding: "10px 20px",
          fontSize: 16,
          cursor: canStart ? "pointer" : "not-allowed",
          marginTop: 10,
        }}
      >
        Start Game
      </button>
    </div>
  );
}
