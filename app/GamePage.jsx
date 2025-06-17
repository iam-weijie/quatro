"use client";

import React, { useState } from "react";

const BOARD_SIZE = 4;
const COLORS = ["white", "black"];
const SHAPES = ["circle", "square"];

export default function GamePage({ player1, player2 }) {
  const [board, setBoard] = useState(
    Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null))
  );
  const [turn, setTurn] = useState(player1);
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [winner, setWinner] = useState(null);

  function shareTrait(pieces) {
    if (pieces.includes(null)) return false;
    const sameColor = pieces.every((p) => p.color === pieces[0].color);
    const sameShape = pieces.every((p) => p.shape === pieces[0].shape);
    return sameColor || sameShape;
  }

  function checkWin(r, c) {
    // We need to use the updated board state, not the old one
    const currentBoard = [...board];
    currentBoard[r][c] = selectedPiece;

    // Check horizontal line
    const horizontal = [...Array(BOARD_SIZE).keys()].map((i) => currentBoard[r][i]);
    if (shareTrait(horizontal)) return true;

    // Check vertical line
    const vertical = [...Array(BOARD_SIZE).keys()].map((i) => currentBoard[i][c]);
    if (shareTrait(vertical)) return true;

    // Check main diagonal (if the placed piece is on it)
    if (r === c) {
      const mainDiagonal = [...Array(BOARD_SIZE).keys()].map((i) => currentBoard[i][i]);
      if (shareTrait(mainDiagonal)) return true;
    }

    // Check anti-diagonal (if the placed piece is on it)
    if (r + c === BOARD_SIZE - 1) {
      const antiDiagonal = [...Array(BOARD_SIZE).keys()].map((i) => currentBoard[i][BOARD_SIZE - 1 - i]);
      if (shareTrait(antiDiagonal)) return true;
    }

    // Check all possible 2x2 blocks that include the placed piece
    const blocks = [];
    if (r > 0 && c > 0) blocks.push([[r - 1, c - 1], [r - 1, c], [r, c - 1], [r, c]]);
    if (r > 0 && c < BOARD_SIZE - 1) blocks.push([[r - 1, c], [r - 1, c + 1], [r, c], [r, c + 1]]);
    if (r < BOARD_SIZE - 1 && c > 0) blocks.push([[r, c - 1], [r, c], [r + 1, c - 1], [r + 1, c]]);
    if (r < BOARD_SIZE - 1 && c < BOARD_SIZE - 1) blocks.push([[r, c], [r, c + 1], [r + 1, c], [r + 1, c + 1]]);

    for (let block of blocks) {
      const pieces = block.map(([x, y]) => currentBoard[x][y]);
      if (shareTrait(pieces)) return true;
    }

    return false;
  }

  function handleCellClick(r, c) {
    if (winner || !selectedPiece || board[r][c]) return;
    const newBoard = board.map((row) => row.slice());
    newBoard[r][c] = selectedPiece;
    setBoard(newBoard);

    if (checkWin(r, c)) {
      setWinner(turn);
      return;
    }

    if (newBoard.flat().every((cell) => cell !== null)) {
      setWinner("Draw");
      return;
    }

    setTurn(turn === player1 ? player2 : player1);
    setSelectedPiece(null);
  }

  function renderPiece({ color, shape }) {
    const base = {
      display: "inline-block",
      width: 30,
      height: 30,
      margin: 5,
      border: "2px solid black",
      backgroundColor: color,
    };
    return shape === "circle"
      ? <div style={{ ...base, borderRadius: "50%" }} />
      : <div style={{ ...base }} />;
  }

  return (
    <div style={{ fontFamily: "sans-serif", maxWidth: 400, margin: "20px auto", textAlign: "center" }}>
      <h1>Quatro</h1>
      <h3>{winner ? (winner === "Draw" ? "It's a draw!" : `${winner} wins! 🎉`) : `${turn}'s turn`}</h3>

      <div style={{
        display: "grid",
        gridTemplateColumns: `repeat(${BOARD_SIZE}, 50px)`,
        gap: 4,
        justifyContent: "center",
        margin: "20px 0"
      }}>
        {board.map((row, r) =>
          row.map((cell, c) => (
            <div
              key={`${r}-${c}`}
              onClick={() => handleCellClick(r, c)}
              style={{
                width: 50,
                height: 50,
                backgroundColor: "#eee",
                border: "2px solid #333",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                cursor: cell || winner ? "default" : "pointer"
              }}
            >
              {cell && renderPiece(cell)}
            </div>
          ))
        )}
      </div>

      <div>
        <p>Select a piece:</p>
        <div style={{ display: "flex", justifyContent: "center", flexWrap: "wrap" }}>
          {COLORS.map((color) =>
            SHAPES.map((shape) => {
              const piece = { color, shape };
              const isSelected = selectedPiece &&
                selectedPiece.color === color &&
                selectedPiece.shape === shape;
              return (
                <div
                  key={`${color}-${shape}`}
                  onClick={() => setSelectedPiece(piece)}
                  style={{
                    padding: 5,
                    border: isSelected ? "3px solid gold" : "2px solid #aaa",
                    borderRadius: 4,
                    margin: "4px",
                    cursor: "pointer"
                  }}
                >
                  {renderPiece(piece)}
                </div>
              );
            })
          )}
        </div>
      </div>

      {winner && (
        <button
          onClick={() => {
            setBoard(Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(null)));
            setWinner(null);
            setTurn(player1);
            setSelectedPiece(null);
          }}
          style={{
            marginTop: 15,
            padding: "8px 16px",
            fontSize: 16,
            cursor: "pointer"
          }}
        >
          Restart Game
        </button>
      )}
    </div>
  );
}