// // src/home/Home_API_Context.jsx
// import React, { createContext, useContext } from 'react';

// // ============================================
// // CONTEXT
// // ============================================
// const Home_API_Context = createContext(null);

// // ============================================
// // HOOK — use in any component
// // ============================================
// export const useHomeAPI = () => {
//     const context = useContext(Home_API_Context);
//     if (!context) {
//         throw new Error('useHomeAPI must be used within <HomeAPIProvider>');
//     }
//     return context;
// };

// // ============================================
// // RAW CONTEXT (used by Provider)
// // ============================================
// export { Home_API_Context };

// export default Home_API_Context;






// ******************** [ New smart cache system ( 2026/10/03 ) ]
// src/home/Home_API_Context.jsx
import React, { createContext, useContext } from 'react';

const Home_API_Context = createContext(null);

export const useHomeAPI = () => {
    const context = useContext(Home_API_Context);
    if (!context) {
        throw new Error('useHomeAPI must be used within <HomeAPIProvider>');
    }
    return context;
};

export { Home_API_Context };

export default Home_API_Context;