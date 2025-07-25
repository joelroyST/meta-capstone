import React, { useState } from "react";
import "./Trivia.css";

const Trivia = () => {
  const quotes = [
  "🏀 'Success is no accident. It is hard work, perseverance, learning, studying, sacrifice and most of all, love of what you are doing.' - Pelé",
  "🔥 'I've failed over and over and over again in my life. And that is why I succeed.' - Michael Jordan",
  "💪 'You have to expect things of yourself before you can do them.' - Michael Jordan",
  "🏆 'The only way to prove that you’re a good sport is to lose.' - Ernie Banks",
  "⚡ 'It's not whether you get knocked down; it's whether you get up.' - Vince Lombardi",
  "🌟 'Do not let what you cannot do interfere with what you can do.' - John Wooden",
  "💥 'Hard work beats talent when talent doesn’t work hard.' - Tim Notke",
  "🔥 'Never say never because limits, like fears, are often just an illusion.' - Michael Jordan",
  "🏀 'The more difficult the victory, the greater the happiness in winning.' - Pelé",
  "💪 'You can't put a limit on anything. The more you dream, the farther you get.' - Michael Phelps",
  "🏆 'You miss 100% of the shots you don’t take.' - Wayne Gretzky",
  "🔥 'Champions keep playing until they get it right.' - Billie Jean King",
  "💪 'Hard work beats talent when talent fails to work hard.' - Kevin Durant",
  "⚡ 'The harder the battle, the sweeter the victory.' - Les Brown",
  "🌟 'Excellence is not a singular act but a habit. You are what you repeatedly do.' - Shaquille O’Neal",
  "💥 'The difference between a successful person and others is not a lack of strength, not a lack of knowledge, but rather a lack in will.' - Vince Lombardi",
  "🏀 'Some people want it to happen, some wish it would happen, others make it happen.' - Michael Jordan",
  "🔥 'You have to expect things of yourself before you can do them.' - Michael Jordan",
  "💪 'Winning means you’re willing to go longer, work harder, and give more than anyone else.' - Vince Lombardi",
  "⚡ 'The only place success comes before work is in the dictionary.' - Vince Lombardi",
];

const trivia = [
  { question: "🧐 Who holds the record for most points scored in a single NBA game?", answer: "Wilt Chamberlain (100 points)" },
  { question: "🤔 Which NBA player is known as 'The Black Mamba'?", answer: "Kobe Bryant" },
  { question: "🏀 Which team won the first NBA championship?", answer: "Philadelphia Warriors" },
  { question: "🕵️‍♂️ Who was the first player to be drafted #1 overall straight out of high school?", answer: "Kobe Bryant" },
  { question: "🏆 Who has the most NBA MVP awards?", answer: "Kareem Abdul-Jabbar (6 MVPs)" },
  { question: "🔥 Which player is famous for the 'Sky Hook' shot?", answer: "Kareem Abdul-Jabbar" },
  { question: "💪 Who is the NBA's all-time leader in assists?", answer: "John Stockton" },
  { question: "⚡ Which NBA player is nicknamed 'The King'?", answer: "LeBron James" },
  { question: "🏀 What year was the NBA founded?", answer: "1946" },
  { question: "🤔 Which player won the NBA Finals MVP award the most times?", answer: "Michael Jordan (6 times)" },
  { question: "🧐 Who is the youngest player to score 30,000 points in the NBA?", answer: "LeBron James" },
  { question: "🤔 Which NBA player is known as 'The Chef'?", answer: "Stephen Curry" },
  { question: "🏀 Which team has the most NBA championships?", answer: "Boston Celtics (17 championships)" },
  { question: "🕵️‍♂️ Who was the first NBA player to be elected league MVP by a unanimous vote?", answer: "Stephen Curry" },
  { question: "🏆 Who was the first African American head coach to win an NBA championship?", answer: "Bill Russell" },
  { question: "🔥 Which player is known for the 'Dream Shake' move?", answer: "Hakeem Olajuwon" },
  { question: "💪 Who holds the record for most career triple-doubles?", answer: "Russell Westbrook" },
  { question: "⚡ Which NBA player is nicknamed 'The Greek Freak'?", answer: "Giannis Antetokounmpo" },
  { question: "🏀 What is the height of the basketball hoop in the NBA?", answer: "10 feet" },
  { question: "🤔 Which player was known as 'The Mailman'?", answer: "Karl Malone" },
];

  const [showQuote, setShowQuote] = useState(true);
  const [showAnswer, setShowAnswer] = useState(false);
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [triviaIndex, setTriviaIndex] = useState(0);

  const handleToggle = () => {
    if (showQuote) {
      // switch to trivia question
      setShowQuote(false);
      setShowAnswer(false);
    } else {
      if (!showAnswer) {
        // show the trivia answer
        setShowAnswer(true);
      } else {
        // switch back to quote, rotating to next quote
        setShowQuote(true);
        setShowAnswer(false);
        setQuoteIndex((prev) => (prev + 1) % quotes.length);
        setTriviaIndex((prev) => (prev + 1) % trivia.length);
      }
    }
  };

  return (
    <div
      onClick={handleToggle}
      className="quote-trivia-toggle"
      title="Tap to toggle trivia/quote/answer">
      {showQuote ? (
        <div>
          <p>{quotes[quoteIndex]}</p>
          <span className="toggle-hint">(Tap to view trivia)</span>
        </div>
      ) : !showAnswer ? (
        <div>
          <p>{trivia[triviaIndex].question}</p>
          <span className="toggle-hint">(Tap to reveal answer)</span>
        </div>
      ) : (
        <div>
          <p>{trivia[triviaIndex].answer}</p>
          <span className="toggle-hint">(Tap to view quote)</span>
        </div>
      )}
    </div>
  );
};

export default Trivia;
