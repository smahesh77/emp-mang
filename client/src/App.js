// App.js

import React, { useState } from 'react';
import Sidebar from './pages/Sidebar';

const App = () => {
  const [showSidebar, setShowSidebar] = useState(false);

  const toggleSidebar = () => {
    setShowSidebar(!showSidebar);
  };

  return (
    <div className="app">
      <header>
        <button onClick={toggleSidebar}>Toggle Sidebar</button>
      </header>

      {/* Render the sidebar conditionally based on showSidebar state */}
      {showSidebar && <Sidebar />}

      <main>
        <h1>Main Content</h1>
        <p>This is the main content of your application.</p>
      </main>
    </div>
  );
};

export default App;
