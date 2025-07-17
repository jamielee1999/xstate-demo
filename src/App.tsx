import { useSelector } from '@xstate/react';
import { globalQuizActor } from './machines/appMachine';
import { QuestionModal } from './components/QuestionModal';
import { QuizResults } from './components/QuizResults';

function App() {
  // Use global actor with useSelector following Stately guide
  const state = useSelector(globalQuizActor, (snapshot) => snapshot.value);
  const score = useSelector(globalQuizActor, (snapshot) => snapshot.context.score);

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg p-8 max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          XState Quiz Demo
        </h1>
        
        <div className="mb-6">
          <p className="text-lg text-gray-600 mb-2">Current Score: {score}</p>
          <p className="text-sm text-gray-500">
            State: {String(state)}
          </p>
        </div>

        {state === 'idle' && (
          <button
            onClick={() => globalQuizActor.send({ type: 'START_QUIZ' })}
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          >
            Start Quiz
          </button>
        )}

        {/* TODO: Add buttons for "Reset Quiz", "View Results", etc. */}
        {/* TODO: Add quiz statistics display */}
        {/* TODO: Add loading state when fetching questions */}
        
        <QuestionModal />
        <QuizResults />
      </div>
    </div>
  );
}

export default App;