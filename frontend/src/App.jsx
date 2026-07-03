import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-background text-foreground flex flex-col">
        <header className="border-b p-4 text-xl font-bold">Task Tracker</header>
        <main className="flex-grow p-4">
          <Routes>
            <Route path="/" element={<div className="text-center mt-10">
              <h1 className="text-4xl font-extrabold text-primary mb-4">Welcome to Task Tracker</h1>
              <p className="text-muted-foreground text-lg">Phase 4 Frontend setup complete!</p>
            </div>} />
          </Routes>
        </main>
        <footer className="border-t p-4 text-center text-sm text-muted-foreground">
          &copy; 2026 Task Tracker
        </footer>
      </div>
      <ToastContainer position="bottom-right" />
    </BrowserRouter>
  );
}

export default App;
