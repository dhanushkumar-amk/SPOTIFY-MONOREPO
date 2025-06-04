// App.js
import React, { useContext, useState } from 'react';
import Sidebar from './components/Sidebar';
import Player from './components/Player';
import DisplayComponents from './components/DisplayComponents';
import toast, {Toaster} from 'react-hot-toast';

import PlayerContextProvider, { PlayerContext } from './context/playerContext';

const App = () => {
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
 


  return (
    <PlayerContextProvider>
        <Toaster
          position='top-center'
          reverseOrder={false}
        />

      <div className="h-screen bg-black flex flex-col relative">
        {/* Render Main Content */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar */}
          <Sidebar
            isExpanded={isSidebarExpanded}
            setIsExpanded={setIsSidebarExpanded}
          />

          {/* Main Display */}
          <DisplayComponents isSidebarExpanded={isSidebarExpanded} />
        </div>

        {/* Player Component */}
        <Player />
        {/* Audio Element for Playback */}


      </div>
    </PlayerContextProvider>
  );
};

export default App;
